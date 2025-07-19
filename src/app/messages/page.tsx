
"use client";

import { useState, useContext, useMemo, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Send, ArrowLeft, MessageSquare, PlusCircle, Trash2, Crown, Info, LogOut, UserPlus } from "lucide-react";
import { cn, getStatusEmoji } from "@/lib/utils";
import { AppContext, Conversation, Message, Member, NetworkingGroup } from "@/context/AppContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
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

import { Badge } from "@/components/ui/badge";
import { ProfileContext } from "@/context/ProfileContext";
import { communityMembers, CommunityMember } from "@/lib/data.tsx";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SharedPostCard } from "@/components/shared-post-card";
import { SharedJobCard } from "@/components/shared-job-card";
import { SharedEventCard } from "@/components/shared-event-card";
import { SharedStoryCard } from "@/components/shared-story-card";

function AddMemberDialog({ group, onOpenChange }: { group: NetworkingGroup, onOpenChange: (open: boolean) => void }) {
    const { addMemberToGroup } = useContext(AppContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [potentialMembers, setPotentialMembers] = useState<CommunityMember[]>([]);

    useEffect(() => {
        const memberIds = new Set(group.members.map(m => m.id));
        const filtered = communityMembers
            .filter(alumnus => !memberIds.has(alumnus.handle))
            .filter(alumnus => alumnus.name.toLowerCase().includes(searchQuery.toLowerCase()));
        setPotentialMembers(filtered);
    }, [searchQuery, group.members]);


    const handleAddMember = (alumnus: CommunityMember) => {
        const newMember: Member = {
            id: alumnus.handle,
            name: alumnus.name,
            avatar: alumnus.avatar,
            role: 'member',
        };
        addMemberToGroup(group.title, newMember);
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add Members to {group.title}</DialogTitle>
                <DialogDescription>Select users to add to the group.</DialogDescription>
            </DialogHeader>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="Search by name..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <ScrollArea className="h-64">
                <div className="py-4 space-y-4 pr-6">
                    {potentialMembers.map(alumnus => (
                        <div key={alumnus.handle} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={alumnus.avatar} />
                                    <AvatarFallback>{alumnus.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">{alumnus.name} {getStatusEmoji(alumnus.graduationYear, alumnus.graduationMonth)}</p>
                                    <p className="text-xs text-muted-foreground">@{alumnus.handle}</p>
                                </div>
                            </div>
                            <Button size="sm" onClick={() => handleAddMember(alumnus)}>Add</Button>
                        </div>
                    ))}
                    {potentialMembers.length === 0 && (
                        <p className="text-sm text-center text-muted-foreground pt-4">No matching users found.</p>
                    )}
                </div>
            </ScrollArea>
        </DialogContent>
    );
}

function GroupInfoDialog({ group, currentUserRole, onOpenChange }: { group: NetworkingGroup, currentUserRole: 'admin' | 'member' | undefined, onOpenChange: (open: boolean) => void }) {
    const { profileData } = useContext(ProfileContext);
    const { updateMemberRole, removeMemberFromGroup, toggleGroupMembership } = useContext(AppContext);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

    const handleLeaveGroup = () => {
        toggleGroupMembership(group);
        onOpenChange(false);
    }
    
    if (!profileData) return null;

    return (
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle className="font-headline text-2xl">{group.title}</DialogTitle>
                <DialogDescription>{group.description}</DialogDescription>
            </DialogHeader>
            
            <div className="flex items-center justify-between my-4">
                <h3 className="text-lg font-semibold">Members ({group.members.length})</h3>
                {currentUserRole === 'admin' && (
                    <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline"><UserPlus className="mr-2 h-4 w-4"/> Add</Button>
                        </DialogTrigger>
                        <AddMemberDialog group={group} onOpenChange={setIsAddMemberOpen} />
                    </Dialog>
                )}
            </div>

            <ScrollArea className="h-64 pr-4 -mr-4">
              <TooltipProvider>
                <div className="space-y-4">
                    {group.members.map(member => {
                        const memberDetails = communityMembers.find(m => m.handle === member.id);
                        const gradYear = memberDetails?.graduationYear || 0;
                        const gradMonth = memberDetails?.graduationMonth || 0;
                        return (
                        <div key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={member.avatar} />
                                    <AvatarFallback>{member.name.substring(0,2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">{member.name} {getStatusEmoji(gradYear, gradMonth)}</p>
                                    <p className="text-xs text-muted-foreground">{member.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {currentUserRole === 'admin' && member.id !== profileData.handle && (
                                    <>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button 
                                                    size="icon" 
                                                    variant={member.role === 'admin' ? "secondary" : "ghost"}
                                                    className="h-8 w-8"
                                                    onClick={() => updateMemberRole(group.title, member.id, member.role === 'admin' ? 'member' : 'admin')}
                                                >
                                                    <Crown className="h-4 w-4" />
                                                    <span className="sr-only">{member.role === 'admin' ? "Make Member" : "Make Admin"}</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{member.role === 'admin' ? "Make Member" : "Make Admin"}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() => removeMemberFromGroup(group.title, member.id)}
                                                >
                                                   <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Remove Member</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Remove Member</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </>
                                )}
                                {member.id === profileData.handle && <Badge variant="secondary">You</Badge>}
                            </div>
                        </div>
                    )})}
                </div>
              </TooltipProvider>
            </ScrollArea>
            <Separator />
             <DialogFooter className="!justify-center">
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            <LogOut className="mr-2 h-4 w-4" />
                            Leave Group
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to leave?</AlertDialogTitle>
                            <AlertDialogDescription>
                                You will be removed from '{group.title}' and will no longer receive messages. You can rejoin later if you wish.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleLeaveGroup}>Leave</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DialogFooter>
        </DialogContent>
    );
}


export default function MessagesPage() {
  const { conversations, setConversations, messagesData, setMessagesData, selectedConversation, setSelectedConversation, networkingGroups, joinedGroups, toggleGroupMembership } = useContext(AppContext);
  const { profileData } = useContext(ProfileContext);
  const [newMessage, setNewMessage] = useState("");
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentGroup = useMemo(() => {
    return selectedConversation ? networkingGroups.find(g => g.title === selectedConversation.name) : null;
  }, [selectedConversation, networkingGroups]);

  const isUserMember = currentGroup ? joinedGroups.has(currentGroup.title) : false;

  const members: Member[] = currentGroup?.members || [];
  const currentUserRole = profileData ? members.find(m => m.id === profileData.handle)?.role : undefined;

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !selectedConversation || !profileData) return;

    const newMessageObj: Message = {
      senderId: profileData.handle,
      senderName: profileData.name,
      text: newMessage,
    };

    const conversationName = selectedConversation.name as keyof typeof messagesData;
    
    setMessagesData(prev => ({
        ...prev,
        [conversationName]: [...(prev[conversationName] || []), newMessageObj]
    }));
    
    setNewMessage("");

    setConversations(prev => {
        const otherConversations = prev.filter(convo => convo.name !== selectedConversation.name);
        const updatedConversation = {
            ...selectedConversation,
            lastMessage: newMessage,
            time: "Now",
        };
        return [updatedConversation, ...otherConversations];
    });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  }

  const handleRejoinGroup = () => {
    if (currentGroup) {
        toggleGroupMembership(currentGroup);
    }
  }
  
  const filteredConversations = conversations.filter(convo => 
    convo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const messages = selectedConversation ? messagesData[selectedConversation.name as keyof typeof messagesData] || [] : [];
  
  if (!profileData) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageSquare className="h-20 w-20 mb-4" />
            <h2 className="text-xl font-semibold">Please log in</h2>
            <p>Log in to view your messages.</p>
          </div>
      )
  }
 
  return (
    <div className="h-[calc(100vh-112px)] md:h-[calc(100vh-64px)] border-t md:border-t-0 flex">
      <div className={cn(
        "w-full md:w-1/3 lg:w-1/4 border-r flex-col",
        selectedConversation ? "hidden md:flex" : "flex"
      )}>
        <div className="p-4 border-b">
          <h1 className="text-2xl font-headline font-bold">Chats</h1>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                placeholder="Search messages..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-grow">
          {filteredConversations.map((convo) => (
            <div
              key={convo.name}
              className={cn(
                "flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50",
                selectedConversation?.name === convo.name && "bg-muted"
              )}
              onClick={() => setSelectedConversation(convo)}
            >
              <Avatar>
                <AvatarImage src={convo.avatar} data-ai-hint={convo.aiHint} />
                <AvatarFallback>{convo.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow overflow-hidden">
                <p className="font-semibold truncate">{convo.name}</p>
                <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
              </div>
              <div className="text-xs text-muted-foreground text-right">
                <p>{convo.time}</p>
                {convo.unread > 0 && (
                  <div className="mt-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center ml-auto">
                    {convo.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className={cn(
        "w-full md:w-2/3 lg:w-3/4 flex-col",
        selectedConversation ? "flex" : "hidden md:flex"
      )}>
        {selectedConversation ? (
          <>
            <div className="p-4 border-b flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                 <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedConversation(null)}>
                  <ArrowLeft />
                </Button>
                <Avatar>
                  <AvatarImage src={selectedConversation.avatar} data-ai-hint={selectedConversation.aiHint}/>
                  <AvatarFallback>{selectedConversation.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedConversation.name}</p>
                  {currentGroup ? (
                    <p className="text-sm text-muted-foreground">{members.length} Members</p>
                  ) : (
                     <p className="text-sm text-muted-foreground">Online</p>
                  )}
                </div>
              </div>
              {currentGroup && isUserMember && (
                 <Dialog open={isGroupInfoOpen} onOpenChange={setIsGroupInfoOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Info />
                      </Button>
                    </DialogTrigger>
                    {currentGroup && <GroupInfoDialog group={currentGroup} currentUserRole={currentUserRole} onOpenChange={setIsGroupInfoOpen} />}
                 </Dialog>
              )}
            </div>
            <div className="flex-grow p-4 overflow-y-auto bg-secondary/30 relative">
              <div className={cn("space-y-4", !isUserMember && currentGroup && "blur-sm")}>
                {messages.map((msg, index) => (
                  <div key={index} className={cn("flex", msg.senderId === profileData.handle ? 'justify-end' : 'justify-start')}>
                     <div className={cn("flex items-start gap-2 max-w-xs lg:max-w-md", msg.senderId === profileData.handle && 'flex-row-reverse')}>
                        <div className={cn(
                          "p-3 rounded-lg",
                          msg.senderId === profileData.handle ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                          {msg.senderId !== profileData.handle && (
                            <p className="text-xs font-semibold mb-1">{msg.senderName}</p>
                          )}
                          {msg.text && <p>{msg.text}</p>}
                          {msg.sharedPostId && <SharedPostCard postId={msg.sharedPostId} />}
                          {msg.sharedJobId && <SharedJobCard jobId={msg.sharedJobId} />}
                          {msg.sharedEventId && <SharedEventCard eventId={msg.sharedEventId} />}
                          {msg.sharedStoryId && <SharedStoryCard storyId={msg.sharedStoryId} />}
                        </div>
                    </div>
                  </div>
                ))}
              </div>
              {!isUserMember && currentGroup && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70">
                    <p className="text-lg font-semibold mb-2">You have left this group.</p>
                    <Button onClick={handleRejoinGroup}>Rejoin Group</Button>
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-background">
              <div className="relative">
                <Input 
                    placeholder={!isUserMember && currentGroup ? "You must join to send messages" : "Type a message..."}
                    className="pr-12"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={(!isUserMember && !!currentGroup) || !profileData}
                />
                <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-10" onClick={handleSendMessage} disabled={(!isUserMember && !!currentGroup) || !profileData}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
           <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageSquare className="h-20 w-20 mb-4" />
            <h2 className="text-xl font-semibold">Select a conversation</h2>
            <p>Start chatting with your connections or join a group.</p>
          </div>
        )}
      </div>
    </div>
  );
}
