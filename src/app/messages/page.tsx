
"use client";

import { useState, useContext, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Send, ArrowLeft, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppContext, Conversation, Message } from "@/context/AppContext";

export default function MessagesPage() {
  const { conversations, setConversations, messagesData, setMessagesData, selectedConversation, setSelectedConversation } = useContext(AppContext);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // This effect ensures that if a conversation was selected via context (e.g., from networking page),
    // it remains selected. The context is the source of truth.
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !selectedConversation) return;

    const newMessageObj: Message = {
      sender: 'me',
      text: newMessage,
    };

    const conversationName = selectedConversation.name as keyof typeof messagesData;
    
    setMessagesData(prev => ({
        ...prev,
        [conversationName]: [...(prev[conversationName] || []), newMessageObj]
    }));
    
    setNewMessage("");

    // Also update the last message in the conversation list
    setConversations(prev => prev.map(convo => 
        convo.name === selectedConversation.name 
        ? {...convo, lastMessage: newMessage, time: "Now"} 
        : convo
    ));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  }

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
                <Input 
                    placeholder="Type a message..." 
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
            <p>Start chatting with your connections or join a group.</p>
          </div>
        )}
      </div>
    </div>
  );
}
