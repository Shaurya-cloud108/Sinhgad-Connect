
"use client";

import { useState, useContext, useEffect, useRef, useMemo, use } from "react";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AppContext } from "@/context/AppContext";
import { ProfileContext } from "@/context/ProfileContext";
import { ArrowLeft, Users, Lock, CheckCircle, PlusCircle, LogOut, Crown, ImageIcon, MoreHorizontal, Heart, MessageCircle, Send, Trash2, Award, Briefcase, Edit, UserCog, Link as LinkIcon, Search, UserX, MapPin, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreatePostDialog } from "@/components/create-post-dialog";
import { EditPostDialog, PostEditFormData } from "@/components/edit-post-dialog";
import { CommentSheet } from "@/components/comment-sheet";
import { cn } from "@/lib/utils";
import type { Comment, Group, GroupLink, GroupMember, FeedItem } from "@/lib/data.tsx";
import { ShareDialog } from "@/components/share-dialog";
import { EditGroupDialog, GroupEditFormData } from "@/components/edit-group-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";


export default function GroupProfilePage({ params }: { params: { id: string } }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const { groups, joinGroup, leaveGroup, setGroups, feedItems, updateFeedItem, deleteFeedItem, toggleLike, addComment, deleteComment, communityMembers, setSelectedConversationByName } = useContext(AppContext);
  const { profileData } = useContext(ProfileContext);
  const { toast } = useToast();
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [group, setGroup] = useState<(typeof groups)[0] | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isEditPostDialogOpen, setIsEditPostDialogOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("feed");
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [postToEdit, setPostToEdit] = useState<FeedItem | null>(null);
  
  useEffect(() => {
    const groupData = groups.find((g) => g.id === resolvedParams.id);
    if (groupData) {
      setGroup(groupData);
    } else {
      notFound();
    }
  }, [resolvedParams.id, groups]);

  const userRole = useMemo(() => {
    if (!group || !profileData) return null;
    return group.members.find(m => m.handle === profileData.handle)?.role || null;
  }, [group, profileData]);


  useEffect(() => {
    if (userRole) {
      setIsMember(true);
    } else {
      setIsMember(false);
    }
  }, [userRole]);

  const groupFeedItems = useMemo(() => {
    if (!group) return [];
    return feedItems.filter(item => item.groupId === group.id);
  }, [feedItems, group]);

  const groupMembersWithDetails = useMemo(() => {
    if (!group) return [];
    const membersWithDetails = group.members.map(member => {
        const memberDetails = communityMembers.find(cm => cm.handle === member.handle);
        return {
            ...member,
            ...memberDetails,
        }
    }).filter(member => member.name); // Filter out any members not found in communityMembers
    
    if (!memberSearchQuery) {
        return membersWithDetails;
    }

    return membersWithDetails.filter(member => 
        member.name?.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
        member.handle?.toLowerCase().includes(memberSearchQuery.toLowerCase())
    );

  }, [group, communityMembers, memberSearchQuery]);


  const handleJoinClick = () => {
    if (!profileData || !group) return;

    if (group.type === "private") {
      toast({
        title: "Request Sent",
        description: `Your request to join "${group.name}" has been sent for approval.`,
      });
    } else {
      joinGroup(group.id, profileData.handle);
      toast({
        title: "Joined Group!",
        description: `You are now a member of "${group.name}".`,
      });
    }
  };

  const handleLeaveClick = () => {
    if (!profileData || !group) return;

    leaveGroup(group.id, profileData.handle);
    toast({
      title: "You have left the group",
      description: `You are no longer a member of "${group.name}".`,
    });
  };

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && group) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newBannerUrl = reader.result as string;
        setGroups(prevGroups => prevGroups.map(g => g.id === group.id ? { ...g, banner: newBannerUrl } : g));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleGroupUpdate = (data: GroupEditFormData) => {
    if (!group) return;
    setGroups(prevGroups => prevGroups.map(g => g.id === group.id ? { ...g, ...data } : g));
    toast({
      title: "Group Updated",
      description: "The group details have been saved.",
    });
  };
  
  const handleMessageClick = () => {
    if (!group) return;
    setSelectedConversationByName(group.name);
    router.push("/messages");
  }

  const triggerBannerUpload = () => {
    bannerInputRef.current?.click();
  };

  const handleAddComment = (postId: string, commentText: string) => {
    if (!profileData) return;
    const newComment = {
      author: {
        name: profileData.name,
        avatar: profileData.avatar,
        handle: profileData.handle
      },
      text: commentText,
    };
    addComment(postId, newComment);
  };

  const handleDeleteComment = (postId: string, commentId: number) => {
    deleteComment(postId, commentId);
  };

  const handleEditPost = (data: PostEditFormData) => {
    if(!postToEdit) return;
    updateFeedItem(postToEdit.id, data);
  };

  const openEditPostDialog = (post: FeedItem) => {
    setPostToEdit(post);
    setIsEditPostDialogOpen(true);
  };

  const handleSetRole = (targetHandle: string, newRole: 'moderator' | 'member') => {
    if (!group) return;
    setGroups(prevGroups => prevGroups.map(g => {
        if (g.id === group.id) {
            return {
                ...g,
                members: g.members.map(m => m.handle === targetHandle ? { ...m, role: newRole } : m)
            }
        }
        return g;
    }));
    toast({
        title: "Role Updated",
        description: `The user's role has been changed to ${newRole}.`
    });
  };

  const handleRemoveMember = (targetHandle: string) => {
    if (!group) return;
    setGroups(prevGroups => prevGroups.map(g => {
        if (g.id === group.id) {
            return {
                ...g,
                members: g.members.filter(m => m.handle !== targetHandle)
            }
        }
        return g;
    }));
    toast({
        title: "Member Removed",
        description: `The user has been removed from the group.`
    });
  };

  const activePostForComments = feedItems.find(item => item.id === activeCommentPostId);

  if (!group || !profileData) {
    return (
      <div className="container py-8 md:py-12">
        <Skeleton className="h-10 w-48 mb-8" />
        <Card className="max-w-4xl mx-auto">
          <Skeleton className="h-48 w-full" />
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/4 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const canPost = userRole === 'admin' || userRole === 'moderator';
  const isAdmin = userRole === 'admin';

  return (
    <>
    <div className="container py-8 md:py-12">
      <Button variant="ghost" onClick={() => router.back()} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Groups
      </Button>

      <Card className="max-w-4xl mx-auto overflow-hidden">
        <div className="relative h-48 w-full">
          <Image
            src={group.banner}
            alt={`${group.name} banner`}
            layout="fill"
            objectFit="cover"
            data-ai-hint={group.aiHint}
          />
        </div>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <CardTitle className="font-headline text-3xl flex items-center gap-2">
                {group.name}
                {group.type === "private" && <Lock className="h-5 w-5 text-muted-foreground" />}
              </CardTitle>
              <button onClick={() => setActiveTab('members')} className="flex items-center gap-2 text-sm mt-2 text-muted-foreground hover:text-primary hover:underline">
                <Users className="h-4 w-4" />
                {group.members.length} Members
              </button>
            </div>
            <div className="flex items-center gap-2">
              {isMember ? (
                  <>
                    <Button onClick={handleMessageClick}><MessageCircle className="mr-2 h-4 w-4" /> Message</Button>
                    <AlertDialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {isAdmin && (
                                    <>
                                        <DropdownMenuItem onClick={() => setIsEditGroupOpen(true)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Group
                                        </DropdownMenuItem>
                                        <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={handleBannerUpload} />
                                        <DropdownMenuItem onClick={triggerBannerUpload}>
                                          <ImageIcon className="mr-2 h-4 w-4" />
                                          Edit Banner
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </>
                                )}
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-destructive cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Leave Group
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Leave "{group.name}"?</AlertDialogTitle>
                          <AlertDialogDescription>
                            You will need to request to join again if this is a private group. Are you sure you want to leave?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleLeaveClick}>
                            Leave
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
              ) : (
                <Button onClick={handleJoinClick}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {group.type === "private" ? "Request to Join" : "Join Group"}
                </Button>
              )}
               <ShareDialog contentType="group" contentId={group.id}>
                 <Button variant="outline" size="icon" aria-label="Share Group">
                    <Share2 className="h-4 w-4" />
                 </Button>
               </ShareDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">{group.summary}</p>
          <div className="flex flex-wrap gap-2">
            {group.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="max-w-4xl mx-auto mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="feed" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="feed">Feed</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            <TabsContent value="feed" className="mt-6 space-y-6">
                 {isMember && canPost && (
                    <Card>
                        <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                            <Avatar>
                            <AvatarImage src={profileData.avatar} data-ai-hint="user avatar" />
                            <AvatarFallback>{profileData.name.substring(0,2)}</AvatarFallback>
                            </Avatar>
                            <button
                            className="w-full text-left bg-secondary/50 hover:bg-muted/80 transition-colors py-2 px-4 rounded-full text-sm text-muted-foreground"
                            onClick={() => setIsPostDialogOpen(true)}
                            >
                            Post in {group.name}...
                            </button>
                        </div>
                        </CardContent>
                    </Card>
                    )}
                    
                    {groupFeedItems.length > 0 ? (
                    groupFeedItems.map((item) => (
                        <Card key={item.id} id={`post-${item.id}`} className="shadow-sm">
                        <CardHeader className="p-4 flex flex-row items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Link href={`/profile/${item.author.handle}`} className="flex items-center space-x-3 group">
                            <Avatar className="w-10 h-10">
                                <AvatarImage src={item.author.avatar} data-ai-hint={item.author.aiHint} />
                                <AvatarFallback>{item.author.name.substring(0,2)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-sm group-hover:underline">{item.author.name}</p>
                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                    <span>@{item.author.handle}</span>
                                    {item.location && (
                                        <>
                                            <span className="text-muted-foreground/50">·</span>
                                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.location}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            </Link>
                        </div>
                        {item.author.handle === profileData.handle && (
                            <AlertDialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditPostDialog(item)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-destructive cursor-pointer">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your post.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteFeedItem(item.id)}>
                                    Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                        </CardHeader>
                        <CardContent className="p-0">
                        <p className="px-4 pb-3 text-sm">{item.content}</p>
                        {item.image && (
                            <div className="w-full aspect-video bg-card">
                            <Image src={item.image} alt="Feed item" className="w-full h-full object-cover" data-ai-hint={item.aiHint} width={600} height={400}/>
                            </div>
                        )}
                        </CardContent>
                        <CardFooter className="p-2 flex justify-between items-center">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Button variant="ghost" size="sm" className={cn("flex items-center gap-2", item.likedBy.includes(profileData.handle) && "text-destructive")} onClick={() => toggleLike(item.id, profileData.handle)}>
                                <Heart className={cn("w-5 h-5", item.likedBy.includes(profileData.handle) && "fill-current")} />
                                <span>{item.likes}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => setActiveCommentPostId(item.id)}>
                                <MessageCircle className="w-5 h-5" />
                                <span>{item.comments.length}</span>
                            </Button>
                            </div>
                            <div>
                                <ShareDialog contentType="post" contentId={item.id}>
                                <Button variant="ghost" size="icon">
                                    <Send className="w-5 h-5" />
                                </Button>
                                </ShareDialog>
                            </div>
                        </CardFooter>
                    </Card>
                    ))
                    ) : (
                    <Card>
                        <CardContent className="p-12 text-center text-muted-foreground">
                        <p className="font-semibold">It's quiet in here...</p>
                        <p className="text-sm">Be the first to post in this group!</p>
                        </CardContent>
                    </Card>
                    )}
            </TabsContent>
            <TabsContent value="about" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">About This Group</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{group.about}</p>
                  </CardContent>
                </Card>
                {group.links && group.links.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-headline text-xl">Useful Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {group.links.map((link, index) => (
                        <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                          <LinkIcon className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm font-medium text-primary hover:underline">{link.label}</span>
                        </a>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
             <TabsContent value="members" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Group Members ({group.members.length})</CardTitle>
                        <CardDescription>
                            {isAdmin ? "Manage member roles or search for members below." : "A list of people in this group."}
                        </CardDescription>
                         <div className="relative pt-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search members by name or handle..."
                                className="pl-10"
                                value={memberSearchQuery}
                                onChange={(e) => setMemberSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {groupMembersWithDetails.map(member => (
                            <div key={member.handle} className="flex items-center justify-between">
                                <Link href={`/profile/${member.handle}`} className="flex items-center gap-3 group">
                                    <Avatar>
                                        <AvatarImage src={member.avatar as string} />
                                        <AvatarFallback>{member.name?.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold group-hover:underline">{member.name}</p>
                                        <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                                    </div>
                                </Link>
                                {isAdmin && profileData.handle !== member.handle && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {member.role === 'member' && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem onSelect={e => e.preventDefault()}>
                                                            <UserCog className="mr-2 h-4 w-4" /> Make Moderator
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Make Moderator?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to make {member.name} a moderator? They will be able to post and manage content.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleSetRole(member.handle!, 'moderator')}>
                                                                Confirm
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                            {member.role === 'moderator' && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem onSelect={e => e.preventDefault()}>
                                                            <UserCog className="mr-2 h-4 w-4" /> Revoke Moderator
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                     <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Revoke Moderator?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to revoke moderator privileges for {member.name}?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleSetRole(member.handle!, 'member')}>
                                                                Confirm
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                            <DropdownMenuSeparator />
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem className="text-destructive" onSelect={e => e.preventDefault()}>
                                                        <UserX className="mr-2 h-4 w-4" /> Remove from Group
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Remove {member.name}?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to remove this member from the group? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleRemoveMember(member.handle!)}>
                                                            Remove
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        ))}
                         {groupMembersWithDetails.length === 0 && (
                            <p className="text-center text-muted-foreground py-4">
                                No members found matching your search.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </div>
    </div>
    <CreatePostDialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen} groupId={group.id} />
    {postToEdit && <EditPostDialog open={isEditPostDialogOpen} onOpenChange={setIsEditPostDialogOpen} onPostUpdate={handleEditPost} post={postToEdit} />}
    <EditGroupDialog open={isEditGroupOpen} onOpenChange={setIsEditGroupOpen} onGroupUpdate={handleGroupUpdate} group={group} />
    <CommentSheet
      open={!!activeCommentPostId}
      onOpenChange={(isOpen) => {
        if (!isOpen) setActiveCommentPostId(null);
      }}
      post={activePostForComments}
      onCommentSubmit={handleAddComment}
      onCommentDelete={handleDeleteComment}
      currentProfile={profileData}
    />
    </>
  );
}
