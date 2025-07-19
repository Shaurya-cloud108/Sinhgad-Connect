
"use client";

import React, { createContext, useState, ReactNode } from 'react';
import { networkingGroups as initialNetworkingGroups, conversationsData as initialConversations, messagesData as initialMessagesData } from '@/lib/data';

// Types
export type NetworkingGroup = {
  title: string;
  description: string;
  iconName: string;
  members: string;
};

export type Conversation = {
    name: string;
    avatar: string;
    aiHint: string;
    lastMessage: string;
    time: string;
    unread: number;
};

export type Message = { 
    sender: 'me' | 'other'; 
    text: string 
};

export type MessagesData = {
    [key: string]: Message[];
};


// Context Type
type AppContextType = {
    networkingGroups: NetworkingGroup[];
    addNetworkingGroup: (group: NetworkingGroup) => void;
    joinedGroups: Set<string>;
    toggleGroupMembership: (group: NetworkingGroup) => void;
    conversations: Conversation[];
    setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
    messagesData: MessagesData;
    setMessagesData: React.Dispatch<React.SetStateAction<MessagesData>>;
    selectedConversation: Conversation | null;
    setSelectedConversation: React.Dispatch<React.SetStateAction<Conversation | null>>;
    setSelectedConversationByName: (name: string) => void;
};

// Context
export const AppContext = createContext<AppContextType>({
    networkingGroups: [],
    addNetworkingGroup: () => {},
    joinedGroups: new Set(),
    toggleGroupMembership: () => {},
    conversations: [],
    setConversations: () => {},
    messagesData: {},
    setMessagesData: () => {},
    selectedConversation: null,
    setSelectedConversation: () => {},
    setSelectedConversationByName: () => {},
});

// Provider
export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [networkingGroups, setNetworkingGroups] = useState<NetworkingGroup[]>(initialNetworkingGroups);
    const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set());
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [messagesData, setMessagesData] = useState<MessagesData>(initialMessagesData);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

    const addNetworkingGroup = (group: NetworkingGroup) => {
        setNetworkingGroups(prev => [group, ...prev]);
    };

    const toggleGroupMembership = (group: NetworkingGroup) => {
        const newJoinedGroups = new Set(joinedGroups);
        if (newJoinedGroups.has(group.title)) {
            newJoinedGroups.delete(group.title);
            // Remove from conversations
            setConversations(prev => prev.filter(c => c.name !== group.title));

        } else {
            newJoinedGroups.add(group.title);
            // Add to conversations
            const newConversation: Conversation = {
                name: group.title,
                avatar: "https://placehold.co/100x100.png",
                aiHint: "university logo",
                lastMessage: "You joined the group.",
                time: "Now",
                unread: 0,
            };
            setConversations(prev => [newConversation, ...prev]);
            // Add initial message for the group
            setMessagesData(prev => ({
                ...prev,
                [group.title]: [{ sender: 'other', text: 'Welcome to the group!' }]
            }));
        }
        setJoinedGroups(newJoinedGroups);
    };

    const setSelectedConversationByName = (name: string) => {
        const conversation = conversations.find(c => c.name === name);
        if (conversation) {
            setSelectedConversation(conversation);
        }
    };

    const value = {
        networkingGroups,
        addNetworkingGroup,
        joinedGroups,
        toggleGroupMembership,
        conversations,
        setConversations,
        messagesData,
        setMessagesData,
        selectedConversation,
        setSelectedConversation,
        setSelectedConversationByName,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
