
"use client";

import { useState, useContext, useEffect, use, useRef, useMemo } from "react";
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
import { ArrowLeft, Users, Lock, CheckCircle, PlusCircle, LogOut, Crown, ImageIcon, MoreHorizontal, Heart, MessageCircle, Send, Trash2, Award, Briefcase } from "lucide-react";
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
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreatePostDialog } from "@/components/create-post-dialog";
import { CommentSheet } from "@/components/comment-sheet";
import { cn } from "@/lib/utils";
import type { Comment } from "@/lib/data.tsx";
import { ShareDialog } from "@/components/share-dialog";


export default function GroupProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const resolvedParams = use(params);

  const { groups, joinGroup, leaveGroup, setGroups, feedItems, setFeedItems } = useContext(AppContext);
  const { profileData } = useContext(ProfileContext);
  const { toast } = useToast();
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [group, setGroup] = useState<(typeof groups)[0] | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
  
  useEffect(() => {
    const groupData = groups.find((g) => g.id === resolvedParams.id);
    if (groupData) {
      setGroup(groupData);
    } else {
      notFound();
    }
  }, [resolvedParams.id, groups]);

  useEffect(() => {
    if (group && profileData) {
      setIsMember(profileData.groups?.includes(group.id) || false);
    }
  }, [group, profileData]);

  const groupFeedItems = useMemo(() => {
    if (!group) return [];
    return feedItems.filter(item => item.groupId === group.id);
  }, [feedItems, group]);


  const handleJoinClick = () => {
    if (!profileData || !group) return;

    if (group.type === "private") {
      toast({
        title: "Request Sent",
        description: `Your request to join "${group.name}" has been sent for approval.`,
      });
    } else {
      joinGroup(group, profileData);
      toast({
        title: "Joined Group!",
        description: `You are now a member of "${group.name}".`,
      });
    }
  };

  const handleLeaveClick = () => {
    if (!profileData || !group) return;

    leaveGroup(group, profileData);
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

  const triggerBannerUpload = () => {
    bannerInputRef.current?.click();
  };

  const handleLike = (postId: number) => {
    setFeedItems(prev => prev.map(item =>
        item.id === postId
        ? {...item, liked: !item.liked, likes: item.liked ? item.likes - 1 : item.likes + 1}
        : item
    ));
  };

  const handleAddComment = (postId: number, commentText: string) => {
    if (!profileData) return;
    const newComment: Comment = {
      id: Date.now(),
      author: {
        name: profileData.name,
        avatar: profileData.avatar,
        handle: profileData.handle
      },
      text: commentText,
    };
    setFeedItems(prev => prev.map(item =>
      item.id === postId
        ? { ...item, comments: [...item.comments, newComment] }
        : item
    ));
  };

  const handleDeleteComment = (postId: number, commentId: number) => {
    setFeedItems(prev => prev.map(item =>
      item.id === postId
        ? { ...item, comments: item.comments.filter(c => c.id !== commentId) }
        : item
    ));
  };

  const handleDeletePost = (postId: number) => {
    setFeedItems(prev => prev.filter(item => item.id !== postId));
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

  const isOwnProfileAdmin = profileData.handle === group.adminHandle;

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
              <CardDescription className="flex items-center gap-2 text-sm mt-2">
                <Users className="h-4 w-4" />
                {group.memberCount} Members
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {isOwnProfileAdmin && (
                <>
                  <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={handleBannerUpload} />
                  <DropdownMenu>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Crown className="h-4 w-4 text-yellow-500" />
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Admin Controls</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={triggerBannerUpload}>
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Edit Banner
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
              {isMember ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                      <Button variant="outline">
                          <LogOut className="mr-2 h-4 w-4" />
                          Leave Group
                      </Button>
                  </AlertDialogTrigger>
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
              ) : (
                <Button onClick={handleJoinClick}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {group.type === "private" ? "Request to Join" : "Join Group"}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">{group.description}</p>
          <div className="flex flex-wrap gap-2">
            {group.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="max-w-4xl mx-auto mt-8 space-y-6">
        {isMember && (
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
                    <p className="text-xs text-muted-foreground">@{item.author.handle}</p>
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
                        <AlertDialogAction onClick={() => handleDeletePost(item.id)}>
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
                  <Button variant="ghost" size="sm" className={cn("flex items-center gap-2", item.liked && "text-destructive")} onClick={() => handleLike(item.id)}>
                    <Heart className={cn("w-5 h-5", item.liked && "fill-current")} />
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
      </div>
    </div>
    <CreatePostDialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen} groupId={group.id} />
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
