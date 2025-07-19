
"use client";

import { useState, useContext, useMemo, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Send, ArrowLeft, MessageSquare, Info } from "lucide-react";
import { cn, getStatusEmoji } from "@/lib/utils";
import { AppContext, Conversation, Message } from "@/context/AppContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { ProfileContext } from "@/context/ProfileContext";
import { communityMembers, CommunityMember } from "@/lib/data.tsx";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { SharedProfileCard } from "@/components/shared-profile-card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

function MessagesPageContent() {
  const { conversations, setConversations, messagesData, setMessagesData, selectedConversation, setSelectedConversation: setAppContextSelectedConvo } = useContext(AppContext);
  const { profileData } = useContext(ProfileContext);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const setSelectedConversation = (convo: Conversation | null) => {
    setAppContextSelectedConvo(convo);
    if (convo && convo.unread > 0) {
      setConversations(prev =>
        prev.map(c =>
          c.name === convo.name ? { ...c, unread: 0 } : c
        )
      );
    }
  };

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
  
  const filteredConversations = conversations.filter(convo => 
    convo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const messages = selectedConversation ? messagesData[selectedConversation.name as keyof typeof messagesData] || [] : [];
  
  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
                   <p className="text-sm text-muted-foreground">Online</p>
                </div>
              </div>
            </div>
            <div className="flex-grow p-4 overflow-y-auto bg-secondary/30 relative" ref={chatContainerRef}>
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={cn("flex", msg.senderId === profileData.handle ? 'justify-end' : 'justify-start')}>
                     <div className={cn("flex items-start gap-2 max-w-xs lg:max-w-md", msg.senderId === profileData.handle && 'flex-row-reverse')}>
                        <div className={cn(
                          "p-3 rounded-lg",
                          msg.senderId === profileData.handle ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                          {msg.senderId !== profileData.handle && (
                            <Link href={`/profile/${msg.senderId}`} className="hover:underline">
                              <p className="text-xs font-semibold mb-1">{msg.senderName}</p>
                            </Link>
                          )}
                          {msg.text && <p>{msg.text}</p>}
                          {msg.sharedPostId && <SharedPostCard postId={msg.sharedPostId} />}
                          {msg.sharedJobId && <SharedJobCard jobId={msg.sharedJobId} />}
                          {msg.sharedEventId && <SharedEventCard eventId={msg.sharedEventId} />}
                          {msg.sharedStoryId && <SharedStoryCard storyId={msg.sharedStoryId} />}
                          {msg.sharedProfileId && <SharedProfileCard profileId={msg.sharedProfileId} />}
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t bg-background">
              <div className="relative">
                <Input 
                    placeholder={"Type a message..."}
                    className="pr-12"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-10" onClick={handleSendMessage}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
           <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageSquare className="h-20 w-20 mb-4" />
            <h2 className="text-xl font-semibold">Select a conversation</h2>
            <p>Start chatting with your connections.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MessagesPage() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div className="h-[calc(100vh-112px)] md:h-[calc(100vh-64px)] border-t md:border-t-0 flex">
                <div className="w-full md:w-1/3 lg:w-1/4 border-r flex-col hidden md:flex">
                    <div className="p-4 border-b space-y-4">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex-grow p-4 space-y-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                </div>
                <div className="w-full md:w-2/3 lg:w-3/4 flex-col hidden md:flex">
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <MessageSquare className="h-20 w-20 mb-4" />
                        <h2 className="text-xl font-semibold">Select a conversation</h2>
                        <p>Start chatting with your connections.</p>
                    </div>
                </div>
                 <div className="flex flex-col w-full md:hidden">
                    <div className="p-4 border-b space-y-4">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex-grow p-4 space-y-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                </div>
            </div>
        );
    }
    
    return <MessagesPageContent />;
}
