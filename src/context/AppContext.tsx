
"use client";

import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { networkingGroups as initialNetworkingGroups, conversationsData as initialConversations, messagesData as initialMessagesData, alumniData } from '@/lib/data';
import { ProfileContext } from './ProfileContext';
import { ProfileData } from '@/lib/data';

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
        const userGroups = new Set<string>();
        initialNetworkingGroups.forEach(group => {
            if (group.members.some(member => member.id === profileData.handle)) {
                userGroups.add(group.title);
            }
        });

        // Filter groups to only those the user has joined, then create conversations
        const groupConversations = initialNetworkingGroups
            .filter(group => userGroups.has(group.title))
            .map(group => ({
                name: group.title,
                avatar: "https://placehold.co/100x100.png",
                aiHint: "university logo",
                lastMessage: messagesData[group.title]?.[messagesData[group.title].length - 1]?.text || "No messages yet.",
                time: "Yesterday",
                unread: 0,
            }));

        const allConversations = [...initialConversations, ...groupConversations.filter(gc => !initialConversations.some(ic => ic.name === gc.name))];
        
        setConversations(allConversations);
        setJoinedGroups(userGroups);

    }, [profileData.handle]);


    const addNetworkingGroup = (group: NetworkingGroup) => {
        setNetworkingGroups(prev => [group, ...prev]);
        setJoinedGroups(prev => new Set(prev).add(group.title));
        
        const newConversation: Conversation = {
            name: group.title,
            avatar: "https://placehold.co/100x100.png",
            aiHint: "university logo",
            lastMessage: "You created the group.",
            time: "Now",
            unread: 0,
        };
        setConversations(prev => [newConversation, ...prev]);
        
        setMessagesData(prev => ({
            ...prev,
            [group.title]: [{ senderId: 'system', senderName: 'System', text: 'Welcome to the group! You are the admin.' }]
        }));
    };
    
    const addMemberToGroup = (groupTitle: string, member: Member) => {
        setNetworkingGroups(prevGroups => prevGroups.map(g => {
            if (g.title === groupTitle) {
                // Avoid adding duplicate members
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
        const newJoinedGroups = new Set(joinedGroups);
        const alreadyMember = newJoinedGroups.has(group.title);
        
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

        if (alreadyMember) {
            newJoinedGroups.delete(group.title);
        } else {
            newJoinedGroups.add(group.title);
            
            const groupExistsInConvos = conversations.some(c => c.name === group.title);
            if (!groupExistsInConvos) {
                const newConversation: Conversation = {
                    name: group.title,
                    avatar: "https://placehold.co/100x100.png",
                    aiHint: "university logo",
                    lastMessage: "You joined the group.",
                    time: "Now",
                    unread: 0,
                };
                setConversations(prev => [newConversation, ...prev]);
            }

            if (!messagesData[group.title]) {
                 setMessagesData(prev => ({
                    ...prev,
                    [group.title]: [{ senderId: 'system', senderName: 'System', text: 'Welcome to the group!' }]
                }));
            }
        }
        setJoinedGroups(newJoinedGroups);
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
