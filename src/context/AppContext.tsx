
"use client";

import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { networkingGroups as initialNetworkingGroups, conversationsData as initialConversations, messagesData as initialMessagesData, communityMembers } from '@/lib/data.tsx';
import { ProfileContext } from './ProfileContext';

// Types
export type Member = {
  id: string; // user handle
  name: string;
  avatar: string;
  role: 'admin' | 'member';
};

export type NetworkingGroup = {
  title: string;
  description: string;
  iconName: string;
  members: Member[];
};

export type Conversation = {
    name: string;
    avatar: string;
    aiHint: string;
    lastMessage: string;
    time: string;
    unread: number;
    isGroup?: boolean;
};

export type Message = { 
    senderId: string;
    senderName: string;
    text: string 
};

export type MessagesData = {
    [key: string]: Message[];
};


// Context Type
type AppContextType = {
    networkingGroups: NetworkingGroup[];
    addNetworkingGroup: (group: NetworkingGroup) => void;
    addMemberToGroup: (groupTitle: string, member: Member) => void;
    removeMemberFromGroup: (groupTitle: string, memberId: string) => void;
    joinedGroups: Set<string>;
    toggleGroupMembership: (group: NetworkingGroup) => void;
    updateMemberRole: (groupTitle: string, memberId: string, role: 'admin' | 'member') => void;
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
    addMemberToGroup: () => {},
    removeMemberFromGroup: () => {},
    joinedGroups: new Set(),
    toggleGroupMembership: () => {},
    updateMemberRole: () => {},
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
    const { profileData } = useContext(ProfileContext);
    const [networkingGroups, setNetworkingGroups] = useState<NetworkingGroup[]>(initialNetworkingGroups);
    const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set());
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [messagesData, setMessagesData] = useState<MessagesData>(initialMessagesData);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

    useEffect(() => {
        if (!profileData) {
            setConversations([]);
            setJoinedGroups(new Set());
            return;
        };

        const userGroupTitles = new Set<string>();
        networkingGroups.forEach(group => {
            if (group.members.some(member => member.id === profileData.handle)) {
                userGroupTitles.add(group.title);
            }
        });

        // Regenerate conversations from messages data and groups
        const conversationMap = new Map<string, Conversation>();

        // Add 1-on-1 conversations from messages
        Object.keys(messagesData).forEach(convoName => {
            const isGroup = networkingGroups.some(g => g.title === convoName);
            if (!isGroup) {
                const otherUser = communityMembers.find(m => m.name === convoName);
                if (otherUser) {
                    conversationMap.set(convoName, {
                        name: convoName,
                        avatar: otherUser.avatar,
                        aiHint: "user avatar",
                        lastMessage: messagesData[convoName]?.[messagesData[convoName].length - 1]?.text || "No messages yet.",
                        time: "Yesterday",
                        unread: initialConversations.find(c=> c.name === convoName)?.unread || 0,
                        isGroup: false,
                    });
                }
            }
        });
        
        // Add group conversations for joined groups
        networkingGroups
            .filter(group => userGroupTitles.has(group.title))
            .forEach(group => {
                conversationMap.set(group.title, {
                    name: group.title,
                    avatar: "https://placehold.co/100x100.png",
                    aiHint: "university logo",
                    lastMessage: messagesData[group.title]?.[messagesData[group.title].length - 1]?.text || "No messages yet.",
                    time: "Yesterday",
                    unread: 0,
                    isGroup: true,
                });
            });

        const allConversations = Array.from(conversationMap.values());
        
        setConversations(allConversations);
        setJoinedGroups(userGroupTitles);

    }, [profileData, networkingGroups, messagesData]);


    const addNetworkingGroup = (group: NetworkingGroup) => {
        if (!profileData) return;
        setNetworkingGroups(prev => [group, ...prev]);
    };
    
    const addMemberToGroup = (groupTitle: string, member: Member) => {
        setNetworkingGroups(prevGroups => prevGroups.map(g => {
            if (g.title === groupTitle) {
                if (g.members.some(m => m.id === member.id)) return g;
                return { ...g, members: [...g.members, member] };
            }
            return g;
        }));
    };
    
    const removeMemberFromGroup = (groupTitle: string, memberId: string) => {
        setNetworkingGroups(prevGroups => prevGroups.map(g => {
            if (g.title === groupTitle) {
                return { ...g, members: g.members.filter(m => m.id !== memberId) };
            }
            return g;
        }));
    };

    const toggleGroupMembership = (group: NetworkingGroup) => {
        if (!profileData) return;
        
        const alreadyMember = joinedGroups.has(group.title);
        
        setNetworkingGroups(prevGroups => prevGroups.map(g => {
            if (g.title === group.title) {
                if (alreadyMember) {
                    return { ...g, members: g.members.filter(m => m.id !== profileData.handle) };
                } else {
                    const newMember: Member = {
                        id: profileData.handle,
                        name: profileData.name,
                        avatar: profileData.avatar,
                        role: 'member'
                    };
                    return { ...g, members: [...g.members, newMember] };
                }
            }
            return g;
        }));
    };

    const updateMemberRole = (groupTitle: string, memberId: string, role: 'admin' | 'member') => {
        setNetworkingGroups(prevGroups => prevGroups.map(g => {
            if (g.title === groupTitle) {
                return {
                    ...g,
                    members: g.members.map(m => m.id === memberId ? { ...m, role } : m)
                };
            }
            return g;
        }));
    };


    const setSelectedConversationByName = (name: string) => {
        const conversation = conversations.find(c => c.name === name);
        if (conversation) {
            setSelectedConversation(conversation);
        } else {
            const group = networkingGroups.find(g => g.title === name);
            if (group) {
                const newConversation: Conversation = {
                    name: group.title,
                    avatar: "https://placehold.co/100x100.png",
                    aiHint: "university logo",
                    lastMessage: "You joined the group.",
                    time: "Now",
                    unread: 0,
                    isGroup: true,
                };
                setConversations(prev => [...prev, newConversation]);
                setSelectedConversation(newConversation);
            }
        }
    };

    const value = {
        networkingGroups,
        addNetworkingGroup,
        addMemberToGroup,
        removeMemberFromGroup,
        joinedGroups,
        toggleGroupMembership,
        updateMemberRole,
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
