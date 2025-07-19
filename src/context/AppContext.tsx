
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
    networkingGroups: NetworkingGroup[];
    addNetworkingGroup: (group: Omit<NetworkingGroup, 'members'> & { members: Member[] }) => void;
    addMemberToGroup: (groupTitle: string, member: Member) => void;
    removeMemberFromGroup: (groupTitle: string, memberId: string) => void;
    joinedGroups: Set<string>;
    toggleGroupMembership: (groupTitle: string) => void;
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

    const syncUserGroups = useCallback(() => {
        if (profileData) {
            const userGroups = new Set<string>();
            networkingGroups.forEach(group => {
                if (group.members.some(member => member.id === profileData.handle)) {
                    userGroups.add(group.title);
                }
            });
            setJoinedGroups(userGroups);
        } else {
            setJoinedGroups(new Set());
        }
    }, [profileData, networkingGroups]);

    useEffect(() => {
        syncUserGroups();
    }, [profileData, networkingGroups]);


    const addNetworkingGroup = (group: Omit<NetworkingGroup, 'iconName' | 'members'> & { iconName: string; members: Member[] }) => {
        if (!profileData) return;
        
        // Add group
        const newGroup = { ...group };
        setNetworkingGroups(prev => [newGroup, ...prev]);
        
        // Create conversation for the new group
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
        let wasMember = false;
        setNetworkingGroups(prevGroups => prevGroups.map(g => {
            if (g.title === groupTitle) {
                if (g.members.some(m => m.id === memberId)) {
                    wasMember = true;
                }
                return { ...g, members: g.members.filter(m => m.id !== memberId) };
            }
            return g;
        }));
        
        if (wasMember && profileData?.handle === memberId && selectedConversation?.name === groupTitle) {
            setSelectedConversation(null);
        }
    };

    const toggleGroupMembership = (groupTitle: string) => {
        if (!profileData) return;
        
        const group = networkingGroups.find(g => g.title === groupTitle);
        if (!group) return;

        const isMember = group.members.some(m => m.id === profileData.handle);
        const updatedGroups = networkingGroups.map(g => {
            if (g.title === groupTitle) {
                if (isMember) {
                    // Leave group
                    return { ...g, members: g.members.filter(m => m.id !== profileData.handle) };
                } else {
                    // Join group
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
        });
        
        setNetworkingGroups(updatedGroups);

        if (!isMember) {
            // If user just joined, check if a conversation exists, if not create one.
            const conversationExists = conversations.some(c => c.name === groupTitle);
            if (!conversationExists) {
                const newConversation = {
                    name: groupTitle,
                    avatar: "https://placehold.co/100x100.png",
                    aiHint: "university logo",
                    lastMessage: "You joined the group.",
                    time: "Now",
                    unread: 0,
                    isGroup: true,
                };
                setConversations(prev => [newConversation, ...prev]);
            }
        } else if (selectedConversation?.name === groupTitle) {
            // If user just left the group they were viewing, deselect it
            setSelectedConversation(null);
        }
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
            return;
        }

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
            return;
        }

        const person = communityMembers.find(m => m.name === name || m.handle === name);
        if (person) {
            const newConversation: Conversation = {
                 name: person.name,
                 avatar: person.avatar,
                 aiHint: person.aiHint,
                 lastMessage: "Conversation started.",
                 time: "Now",
                 unread: 0,
                 isGroup: false,
            };
            setConversations(prev => [newConversation, ...prev]);
            setSelectedConversation(newConversation);
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
