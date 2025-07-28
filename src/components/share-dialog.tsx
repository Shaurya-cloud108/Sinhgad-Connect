
"use client";

import React, { useState, useContext, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppContext, Message, Conversation } from "@/context/AppContext";
import { ProfileContext } from "@/context/ProfileContext";
import { Check, Send, Copy, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';

type ShareDialogProps = {
  contentType: 'post' | 'job' | 'event' | 'story' | 'group' | 'profile';
  contentId: string | number;
  children: React.ReactNode;
};

type ShareTarget = {
    id: string; // convo name or user handle
    name: string;
    avatar: string;
    isGroup: boolean;
};

export function ShareDialog({ contentType, contentId, children }: ShareDialogProps) {
  const { conversations, setMessagesData, setConversations, communityMembers } = useContext(AppContext);
  const { profileData } = useContext(ProfileContext);
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTargets, setSelectedTargets] = useState<Set<string>>(new Set());

  const publicLink = useMemo(() => {
    if (typeof window === 'undefined') return '';
    
    const baseUrl = window.location.origin;
    
    switch (contentType) {
      case 'post':
        return `${baseUrl}/?postId=${contentId}`;
      case 'job':
        return `${baseUrl}/jobs#job-${contentId}`;
      case 'event':
        return `${baseUrl}/events#event-${contentId}`;
      case 'story':
        return `${baseUrl}/success-stories#story-${contentId}`;
      case 'profile':
        return `${baseUrl}/profile/${contentId}`;
      case 'group':
        return `${baseUrl}/groups/${contentId}`;
      default:
        return baseUrl;
    }
  }, [contentType, contentId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicLink).then(() => {
      toast({
        title: "Link Copied!",
        description: "The public link is now on your clipboard.",
      });
    }, (err) => {
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Could not copy link to clipboard.",
      });
      console.error('Could not copy text: ', err);
    });
  };

  const allShareTargets = useMemo(() => {
    if (!profileData) return [];

    const targetsMap = new Map<string, ShareTarget>();

    // Add existing conversations
    conversations.forEach(convo => {
      targetsMap.set(convo.name, {
        id: convo.name,
        name: convo.name,
        avatar: convo.avatar,
        isGroup: !!convo.isGroup,
      });
    });

    // Add all community members (that aren't the user and aren't already a 1-on-1 convo)
    communityMembers.forEach(member => {
      if (member.handle !== profileData.handle && !targetsMap.has(member.name)) {
        targetsMap.set(member.name, {
            id: member.handle,
            name: member.name,
            avatar: member.avatar,
            isGroup: false,
        });
      }
    });

    return Array.from(targetsMap.values()).filter(target => 
      target.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, profileData, searchQuery, communityMembers]);


  const handleSelectTarget = (name: string) => {
    const newSelected = new Set(selectedTargets);
    if (newSelected.has(name)) {
      newSelected.delete(name);
    } else {
      newSelected.add(name);
    }
    setSelectedTargets(newSelected);
  };
  
  const handleShare = () => {
    if (!profileData || selectedTargets.size === 0) return;

    let newShareMessage: Partial<Message> = {
        senderId: profileData.handle,
        senderName: profileData.name,
    };
    let lastMessageText: string = "Shared content.";

    switch (contentType) {
        case 'post':
            newShareMessage.sharedPostId = contentId as number;
            lastMessageText = "Shared a post.";
            break;
        case 'job':
            newShareMessage.sharedJobId = contentId as number;
            lastMessageText = "Shared a job.";
            break;
        case 'event':
            newShareMessage.sharedEventId = contentId as string;
            lastMessageText = "Shared an event.";
            break;
        case 'story':
            newShareMessage.sharedStoryId = contentId as string;
            lastMessageText = "Shared a story.";
            break;
        case 'profile':
            newShareMessage.sharedProfileId = contentId as string;
            lastMessageText = "Shared a profile.";
            break;
        case 'group':
            newShareMessage.sharedGroupId = contentId as string;
            lastMessageText = "Shared a group.";
            break;
        default:
            toast({ variant: "destructive", title: "Share failed", description: "Unknown content type." });
            return;
    }
    
    // Update messages for all selected targets
    setMessagesData(prev => {
      const newMessagesData = { ...prev };
      selectedTargets.forEach(targetName => {
        const conversationKey = targetName;
        newMessagesData[conversationKey] = [...(newMessagesData[conversationKey] || []), newShareMessage as Message];
      });
      return newMessagesData;
    });

    // Update conversations list (existing and new), and reorder
    setConversations(prev => {
        const conversationMap = new Map(prev.map(c => [c.name, c]));

        selectedTargets.forEach(targetName => {
            const targetInfo = allShareTargets.find(t => t.name === targetName);
            if (!targetInfo) return;

            let updatedConvo: Conversation;

            if (conversationMap.has(targetInfo.name)) {
                // Update existing conversation
                updatedConvo = {
                    ...conversationMap.get(targetInfo.name)!,
                    lastMessage: lastMessageText,
                    time: "Now",
                };
            } else {
                // This is a new 1-on-1 conversation, create it
                updatedConvo = {
                    name: targetInfo.name,
                    avatar: targetInfo.avatar,
                    aiHint: "user avatar",
                    lastMessage: lastMessageText,
                    time: "Now",
                    unread: 0,
                    isGroup: false,
                };
            }
            conversationMap.set(targetInfo.name, updatedConvo);
        });

        const allConversations = Array.from(conversationMap.values());
        const otherConversations = allConversations.filter(c => !selectedTargets.has(c.name));
        const updatedConversations = Array.from(selectedTargets).map(name => conversationMap.get(name)!);

        return [...updatedConversations, ...otherConversations];
    });
    
    toast({
      title: "Shared Successfully!",
      description: `Sent to ${selectedTargets.size} conversation(s).`,
    });
    
    setIsOpen(false);
    setSelectedTargets(new Set());
    setSearchQuery("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
        </DialogHeader>
        
        <div className='space-y-4'>
            <div>
                <p className="text-sm font-medium mb-2">Share with connections</p>
                <Input 
                    placeholder="Search for people or groups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <ScrollArea className="h-48 mt-2">
                <div className="py-2 space-y-1 pr-4">
                    {allShareTargets.map(target => (
                    <div 
                        key={target.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                        onClick={() => handleSelectTarget(target.name)}
                    >
                        <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={target.avatar} />
                            <AvatarFallback>{target.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{target.name}</p>
                        </div>
                        {selectedTargets.has(target.name) && (
                        <Check className="h-5 w-5 text-primary" />
                        )}
                    </div>
                    ))}
                    {allShareTargets.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground pt-4">No matching results found.</p>
                    )}
                </div>
                </ScrollArea>
                 <Button onClick={handleShare} disabled={selectedTargets.size === 0} className='w-full'>
                    <Send className="mr-2 h-4 w-4" /> Share ({selectedTargets.size})
                </Button>
            </div>
            
            <Separator />

            <div>
                <p className="text-sm font-medium mb-2">Or share externally</p>
                <div className="flex w-full items-center space-x-2">
                    <Input value={publicLink} readOnly />
                    <Button type="button" size="icon" onClick={handleCopyLink}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" className='w-full'>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
