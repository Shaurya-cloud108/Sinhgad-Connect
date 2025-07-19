
"use client";

import React, { useState, useContext } from 'react';
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
import { AppContext, Conversation, Message } from "@/context/AppContext";
import { ProfileContext } from "@/context/ProfileContext";
import { Check, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getContentDetails } from '@/lib/data';

type ShareDialogProps = {
  contentType: 'post' | 'job' | 'event' | 'story' | 'group';
  contentId: string | number;
  children: React.ReactNode;
};

export function ShareDialog({ contentType, contentId, children }: ShareDialogProps) {
  const { conversations, setMessagesData, setConversations } = useContext(AppContext);
  const { profileData } = useContext(ProfileContext);
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversations, setSelectedConversations] = useState<Set<string>>(new Set());

  const handleSelectConversation = (name: string) => {
    const newSelected = new Set(selectedConversations);
    if (newSelected.has(name)) {
      newSelected.delete(name);
    } else {
      newSelected.add(name);
    }
    setSelectedConversations(newSelected);
  };
  
  const handleShare = () => {
    if (!profileData || selectedConversations.size === 0) return;

    const contentDetails = getContentDetails(contentType, contentId);
    if (!contentDetails) return;
    
    const { title, url } = contentDetails;
    const shareMessage = `Check this out: ${title}\n${window.location.origin}${url}`;

    const newMessage: Message = {
      senderId: profileData.handle,
      senderName: profileData.name,
      text: shareMessage,
    };
    
    setMessagesData(prev => {
      const newMessagesData = { ...prev };
      selectedConversations.forEach(convoName => {
        newMessagesData[convoName] = [...(newMessagesData[convoName] || []), newMessage];
      });
      return newMessagesData;
    });

    setConversations(prev => prev.map(convo => 
        selectedConversations.has(convo.name) 
        ? {...convo, lastMessage: "Shared a link.", time: "Now"} 
        : convo
    ));
    
    toast({
      title: "Shared Successfully!",
      description: `Sent to ${selectedConversations.size} conversation(s).`,
    });
    
    setIsOpen(false);
    setSelectedConversations(new Set());
    setSearchQuery("");
  };

  const filteredConversations = conversations.filter(convo => 
    convo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share with...</DialogTitle>
          <DialogDescription>Select conversations to share this content with.</DialogDescription>
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
            {filteredConversations.map(convo => (
              <div 
                key={convo.name}
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                onClick={() => handleSelectConversation(convo.name)}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={convo.avatar} />
                    <AvatarFallback>{convo.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <p className="font-medium">{convo.name}</p>
                </div>
                {selectedConversations.has(convo.name) && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleShare} disabled={selectedConversations.size === 0}>
            <Send className="mr-2 h-4 w-4" /> Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
