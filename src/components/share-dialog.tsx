
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
import { Check, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { communityMembers } from '@/lib/data.tsx';

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
  const { conversations, setMessagesData, setConversations } = useContext(AppContext);
  const { profileData } = useContext(ProfileContext);
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTargets, setSelectedTargets] = useState<Set<string>>(new Set());

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
  }, [conversations, profileData, searchQuery]);


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
          <DialogTitle>Share with...</DialogTitle>
          <DialogDescription>Select people or groups to share this content with.</DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Input 
            placeholder="Search for people or groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ScrollArea className="h-64">
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
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleShare} disabled={selectedTargets.size === 0}>
            <Send className="mr-2 h-4 w-4" /> Share ({selectedTargets.size})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
