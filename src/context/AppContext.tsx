
"use client";

import React, { createContext, useState, ReactNode, useContext, useMemo, useCallback } from 'react';
import { conversationsData as initialConversations, messagesData as initialMessagesData, communityMembers as initialCommunityMembers, jobListings as initialJobListings, JobListing, CommunityMember } from '@/lib/data.tsx';
import { ProfileContext } from './ProfileContext';

// Types
export type Conversation = {
    name: string;
    avatar: string;
    aiHint: string;
    lastMessage: string;
    time: string;
    unread: number;
    isGroup: boolean;
};

export type Message = { 
    senderId: string;
    senderName: string;
    text?: string;
    sharedPostId?: number;
    sharedJobId?: number;
    sharedEventId?: string;
    sharedStoryId?: string;
    sharedProfileId?: string;
    sharedGroupId?: string;
};

export type MessagesData = {
    [key: string]: Message[];
};


// Context Type
type AppContextType = {
    conversations: Conversation[];
    setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
    messagesData: MessagesData;
    setMessagesData: React.Dispatch<React.SetStateAction<MessagesData>>;
    selectedConversation: Conversation | null;
    setSelectedConversation: React.Dispatch<React.SetStateAction<Conversation | null>>;
    setSelectedConversationByName: (name: string) => void;
    jobListings: JobListing[];
    addJobListing: (job: JobListing) => void;
    communityMembers: CommunityMember[];
    setCommunityMembers: React.Dispatch<React.SetStateAction<CommunityMember[]>>;
};

// Context
export const AppContext = createContext<AppContextType>({
    conversations: [],
    setConversations: () => {},
    messagesData: {},
    setMessagesData: () => {},
    selectedConversation: null,
    setSelectedConversation: () => {},
    setSelectedConversationByName: () => {},
    jobListings: [],
    addJobListing: () => {},
    communityMembers: [],
    setCommunityMembers: () => {},
});

// Provider
export const AppProvider = ({ children }: { children: ReactNode }) => {
    const { profileData } = useContext(ProfileContext);
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [messagesData, setMessagesData] = useState<MessagesData>(initialMessagesData);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [jobListings, setJobListings] = useState<JobListing[]>(initialJobListings);
    const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>(initialCommunityMembers);

    const setSelectedConversationByName = (name: string) => {
        let conversation = conversations.find(c => c.name === name);

        if (!conversation) {
            const person = communityMembers.find(m => m.name === name || m.handle === name);
            if (person) {
                conversation = {
                     name: person.name,
                     avatar: person.avatar,
                     aiHint: person.aiHint,
                     lastMessage: "Conversation started.",
                     time: "Now",
                     unread: 0,
                     isGroup: false,
                };
                setConversations(prev => [conversation!, ...prev.filter(c => c.name !== name)]);
            }
        }
        
        setSelectedConversation(conversation || null);
    };

    const addJobListing = (job: JobListing) => {
        setJobListings(prev => [job, ...prev]);
    };

    const value = {
        conversations,
        setConversations,
        messagesData,
        setMessagesData,
        selectedConversation,
        setSelectedConversation,
        setSelectedConversationByName,
        jobListings,
        addJobListing,
        communityMembers,
        setCommunityMembers,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

    