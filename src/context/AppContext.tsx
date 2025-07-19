
"use client";

import React, { createContext, useState, ReactNode, useContext, useEffect, useCallback } from 'react';
import { networkingGroups as initialNetworkingGroups, conversationsData as initialConversations, messagesData as initialMessagesData, communityMembers, jobListings as initialJobListings, JobListing } from '@/lib/data.tsx';
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
    text?: string;
    sharedPostId?: number;
    sharedJobId?: number;
    sharedEventId?: string;
    sharedStoryId?: string;
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
    jobListings: JobListing[];
    addJobListing: (job: JobListing) => void;
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
    jobListings: [],
    addJobListing: () => {},
});

// Provider
export const AppProvider = ({ children }: { children: ReactNode }) => {
    const { profileData } = useContext(ProfileContext);
    const [networkingGroups, setNetworkingGroups] = useState<NetworkingGroup[]>(initialNetworkingGroups);
    const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set());
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [messagesData, setMessagesData] = useState<MessagesData>(initialMessagesData);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [jobListings, setJobListings] = useState<JobListing[]>(initialJobListings);

    const regenerateConversations = useCallback(() => {
        if (!profileData) {
            setConversations([]);
            setJoinedGroups(new Set());
            return;
        }

        const userGroupTitles = new Set<string>();
        initialNetworkingGroups.forEach(group => {
            if (group.members.some(member => member.id === profileData.handle)) {
                userGroupTitles.add(group.title);
            }
        });

        const conversationMap = new Map<string, Conversation>();

        // Process all conversations from messages data
        Object.keys(initialMessagesData).forEach(convoName => {
            const lastMessage = initialMessagesData[convoName]?.[initialMessagesData[convoName].length - 1];
            if (!lastMessage) return;

            const isGroup = initialNetworkingGroups.some(g => g.title === convoName);

            if (isGroup) {
                if (userGroupTitles.has(convoName)) {
                    conversationMap.set(convoName, {
                        name: convoName,
                        avatar: "https://placehold.co/100x100.png",
                        aiHint: "university logo",
                        lastMessage: lastMessage.text || "Shared content.",
                        time: "Yesterday",
                        unread: 0,
                        isGroup: true,
                    });
                }
            } else {
                 const otherUser = communityMembers.find(m => m.name === convoName);
                 if (otherUser) {
                     conversationMap.set(convoName, {
                         name: convoName,
                         avatar: otherUser.avatar,
                         aiHint: "user avatar",
                         lastMessage: lastMessage.text || "Shared content.",
                         time: "Yesterday",
                         unread: initialConversations.find(c => c.name === convoName)?.unread || 0,
                         isGroup: false,
                     });
                 }
            }
        });
        
        const sortedConversations = Array.from(conversationMap.values()).sort((a, b) => {
            // A simple sort, in a real app this would be based on message timestamps
            if (a.time === "Now") return -1;
            if (b.time === "Now") return 1;
            if (a.time.includes("AM") || a.time.includes("PM")) return -1;
            if (b.time.includes("AM") || b.time.includes("PM")) return 1;
            return 0;
        });

        setConversations(sortedConversations);
        setJoinedGroups(userGroupTitles);
    }, [profileData]);

    useEffect(() => {
        regenerateConversations();
    }, [regenerateConversations]);


    const addNetworkingGroup = (group: NetworkingGroup) => {
        if (!profileData) return;
        setNetworkingGroups(prev => [group, ...prev]);
        setJoinedGroups(prev => new Set(prev).add(group.title));
        
        const newConversation = {
            name: group.title,
            avatar: "https://placehold.co/100x100.png",
            aiHint: "university logo",
            lastMessage: "You created the group.",
            time: "Now",
            unread: 0,
            isGroup: true,
        };
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversation(newConversation);
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
         setJoinedGroups(prev => {
            const newSet = new Set(prev);
            if (alreadyMember) {
                newSet.delete(group.title);
            } else {
                newSet.add(group.title);
            }
            return newSet;
        });
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
                setConversations(prev => [newConversation, ...prev]);
                setSelectedConversation(newConversation);
            }
        }
    };

    const addJobListing = (job: JobListing) => {
        setJobListings(prev => [job, ...prev]);
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
        jobListings,
        addJobListing,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
