
"use client";

import React, { createContext, useState, ReactNode, useContext, useMemo, useCallback } from 'react';
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
    myGroups: NetworkingGroup[];
    exploreGroups: NetworkingGroup[];
    addNetworkingGroup: (group: Omit<NetworkingGroup, 'members'> & { members: Member[] }) => void;
    addMemberToGroup: (groupTitle: string, member: Member) => void;
    removeMemberFromGroup: (groupTitle: string, memberId: string) => void;
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
    myGroups: [],
    exploreGroups: [],
    addNetworkingGroup: () => {},
    addMemberToGroup: () => {},
    removeMemberFromGroup: () => {},
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
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [messagesData, setMessagesData] = useState<MessagesData>(initialMessagesData);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [jobListings, setJobListings] = useState<JobListing[]>(initialJobListings);

    const { myGroups, exploreGroups } = useMemo(() => {
        const myGroups: NetworkingGroup[] = [];
        const exploreGroups: NetworkingGroup[] = [];
        if (profileData?.handle) {
            networkingGroups.forEach(group => {
                if (group.members.some(member => member.id === profileData.handle)) {
                    myGroups.push(group);
                } else {
                    exploreGroups.push(group);
                }
            });
        } else {
             exploreGroups.push(...networkingGroups);
        }
        return { myGroups, exploreGroups };
    }, [profileData, networkingGroups]);


    const addNetworkingGroup = (group: Omit<NetworkingGroup, 'iconName' | 'members'> & { iconName: string; members: Member[] }) => {
        if (!profileData) return;
        
        const newGroup = { ...group };
        setNetworkingGroups(prev => [newGroup, ...prev]);
        
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

    const toggleGroupMembership = useCallback((groupTitle: string) => {
        if (!profileData) return;

        setNetworkingGroups(prevGroups => {
            return prevGroups.map(group => {
                if (group.title === groupTitle) {
                    const isMember = group.members.some(member => member.id === profileData.handle);
                    if (isMember) {
                        // Leave group
                        return { ...group, members: group.members.filter(m => m.id !== profileData.handle) };
                    } else {
                        // Join group
                        const newMember: Member = {
                            id: profileData.handle,
                            name: profileData.name,
                            avatar: profileData.avatar,
                            role: 'member'
                        };
                        return { ...group, members: [...group.members, newMember] };
                    }
                }
                return group;
            });
        });
    }, [profileData]);

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
        myGroups,
        exploreGroups,
        addNetworkingGroup,
        addMemberToGroup,
        removeMemberFromGroup,
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
