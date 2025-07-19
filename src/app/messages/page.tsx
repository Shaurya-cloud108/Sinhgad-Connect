"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Send, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const conversations = [
  {
    name: "Priya Sharma",
    avatar: "https://placehold.co/100x100.png",
    aiHint: "professional woman",
    lastMessage: "Sure, I can help with that. Let's connect tomorrow.",
    time: "10:42 AM",
    unread: 2,
  },
  {
    name: "Rohan Verma",
    avatar: "https://placehold.co/100x100.png",
    aiHint: "professional man",
    lastMessage: "Thanks for the resume tips!",
    time: "9:15 AM",
    unread: 0,
  },
  {
    name: "Alumni Events Group",
    avatar: "https://placehold.co/100x100.png",
    aiHint: "university logo",
    lastMessage: "Don't forget the upcoming Tech Talk on AI.",
    time: "Yesterday",
    unread: 1,
  },
  {
    name: "Vikram Singh",
    avatar: "https://placehold.co/100x100.png",
    aiHint: "corporate man",
    lastMessage: "It was great meeting you at the reunion.",
    time: "3d ago",
    unread: 0,
  },
];

const messagesData = {
  "Priya Sharma": [
    { sender: "other", text: "Hey! I'm a final year student and I saw your profile. Your work at Google is really inspiring!" },
    { sender: "me", text: "Hi! Thanks for reaching out. Happy to help if you have any questions." },
    { sender: "other", text: "That would be amazing. I'm preparing for interviews and would love to get your advice on my resume." },
    { sender: "me", text: "Sure, I can help with that. Let's connect tomorrow." },
  ],
  "Rohan Verma": [
    { sender: "other", text: "Thanks for the resume tips!" },
  ],
};

type Conversation = typeof conversations[0];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);

  const messages = selectedConversation ? messagesData[selectedConversation.name as keyof typeof messagesData] || [] : [];

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
            <Input placeholder="Search messages..." className="pl-10" />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
          {conversations.map((convo) => (
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
        </div>
      </div>
      <div className={cn(
        "w-full md:w-2/3 lg:w-3/4 flex-col",
        selectedConversation ? "flex" : "hidden md:flex"
      )}>
        {selectedConversation ? (
          <>
            <div className="p-4 border-b flex items-center gap-4">
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
            <div className="flex-grow p-4 overflow-y-auto bg-secondary/30">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={cn("flex", msg.sender === 'me' ? 'justify-end' : 'justify-start')}>
                    <div className={cn(
                      "max-w-xs lg:max-w-md p-3 rounded-lg",
                      msg.sender === 'me' ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t bg-background">
              <div className="relative">
                <Input placeholder="Type a message..." className="pr-12" />
                <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-10">
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
