
"use client";

import React, { createContext, useState, ReactNode, useCallback, useContext, useEffect, useMemo } from 'react';
import { 
    initialConversations as baseInitialConversations, 
    initialMessages,
    initialJobListings, 
    initialCommunityMembers, 
    initialFeedItems, 
    initialStories,
    initialEventsData,
    initialGroupsData
} from '@/lib/data';
import type { 
    Conversation as ConvType, 
    MessagesData as MsgType, 
    JobListing, 
    CommunityMember, 
    FeedItem, 
    Story, 
    Message, 
    StoryItem,
    Event,
    Group,
    GroupMember
} from '@/lib/data';
import { ProfileContext } from './ProfileContext';

// Types
export type Conversation = ConvType;
export type MessagesData = MsgType;

// Context Type
type AppContextType = {
    conversations: Conversation[];
    setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
    messagesData: MessagesData;
    setMessagesData: React.Dispatch<React.SetStateAction<MessagesData>>;
    selectedConversation: Conversation | null;
    setSelectedConversation: React.Dispatch<React.SetStateAction<Conversation | null>>;
    setSelectedConversationByName: (name: string) => void;
    
    events: Event[];
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
    addEvent: (event: Event) => void;

    groups: Group[];
    setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
    addGroup: (groupData: Omit<Group, 'id' | 'members' | 'tags'>, adminHandle: string) => Group;
    joinGroup: (groupId: string, userHandle: string) => void;
    leaveGroup: (groupId: string, userHandle: string) => void;

    jobListings: JobListing[];
    setJobListings: React.Dispatch<React.SetStateAction<JobListing[]>>;
    addJobListing: (job: JobListing) => void;
    
    communityMembers: CommunityMember[];
    setCommunityMembers: React.Dispatch<React.SetStateAction<CommunityMember[]>>;

    feedItems: FeedItem[];
    setFeedItems: React.Dispatch<React.SetStateAction<FeedItem[]>>;
    addFeedItem: (post: FeedItem) => void;

    stories: Story[];
    setStories: React.Dispatch<React.SetStateAction<Story[]>>;
    addStoryItem: (userHandle: string, item: StoryItem) => void;
    deleteStoryItem: (userHandle: string, itemId: number) => void;
    addStoryForUser: (user: CommunityMember) => void;
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
    events: [],
    setEvents: () => {},
    addEvent: () => {},
    groups: [],
    setGroups: () => {},
    addGroup: () => { throw new Error('addGroup function not implemented'); },
    joinGroup: () => {},
    leaveGroup: () => {},
    jobListings: [],
    setJobListings: () => {},
    addJobListing: () => {},
    communityMembers: [],
    setCommunityMembers: () => {},
    feedItems: [],
    setFeedItems: () => {},
    addFeedItem: () => {},
    stories: [],
    setStories: () => {},
    addStoryItem: () => {},
    deleteStoryItem: () => {},
    addStoryForUser: () => {},
});

// Provider
export const AppProvider = ({ children }: { children: ReactNode }) => {
    const { profileData } = useContext(ProfileContext);
    const [conversations, setConversations] = useState<Conversation[]>(baseInitialConversations);
    const [messagesData, setMessagesData] = useState<MessagesData>(initialMessages);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [events, setEvents] = useState<Event[]>(initialEventsData);
    const [groups, setGroups] = useState<Group[]>(initialGroupsData);
    const [jobListings, setJobListings] = useState<JobListing[]>(initialJobListings);
    const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>(initialCommunityMembers);
    const [feedItems, setFeedItems] = useState<FeedItem[]>(initialFeedItems);
    const [stories, setStories] = useState<Story[]>(initialStories);
    
    useEffect(() => {
        if (profileData) {
            const userGroupIds = new Set(groups.filter(g => g.members.some(m => m.handle === profileData.handle)).map(g => g.id));
            const groupConversations = initialGroupsData
                .filter(group => userGroupIds.has(group.id))
                .map(group => ({
                    name: group.name,
                    avatar: group.banner,
                    aiHint: group.aiHint,
                    lastMessage: "You are a member of this group.",
                    time: "Synced",
                    unread: 0,
                    isGroup: true,
                }));
            
            // Filter out any duplicates that might already be in baseInitialConversations
            const existingConvoNames = new Set(baseInitialConversations.map(c => c.name));
            const newGroupConvos = groupConversations.filter(gc => !existingConvoNames.has(gc.name));

            setConversations(prev => [...prev, ...newGroupConvos]);
        }
    }, [profileData, groups]);

    const setSelectedConversationByName = useCallback((name: string) => {
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
    }, [conversations, communityMembers]);

    const addEvent = useCallback((event: Event) => {
        setEvents(prev => [event, ...prev]);
    }, []);

    const addGroup = useCallback((groupData: Omit<Group, 'id' | 'members' | 'tags'>, adminHandle: string): Group => {
        const newGroup: Group = {
            ...groupData,
            id: groupData.name.toLowerCase().replace(/\s+/g, '-'),
            members: [{ handle: adminHandle, role: 'admin' }],
            tags: [], // Tags can be added later
        };
        setGroups(prev => [newGroup, ...prev]);
        return newGroup;
    }, []);
    
    const joinGroup = useCallback((groupId: string, userHandle: string) => {
      setGroups(prevGroups => prevGroups.map(g => {
        if (g.id === groupId && !g.members.some(m => m.handle === userHandle)) {
          return {
            ...g,
            members: [...g.members, { handle: userHandle, role: 'member' }],
          };
        }
        return g;
      }));

      const group = groups.find(g => g.id === groupId);
      if (group) {
        const existingConvo = conversations.find(c => c.name === group.name);
        if (!existingConvo) {
          const newConversation: Conversation = {
            name: group.name,
            avatar: group.banner,
            aiHint: group.aiHint,
            lastMessage: "You joined the group.",
            time: "Now",
            unread: 0,
            isGroup: true,
          };
          setConversations(prev => [newConversation, ...prev]);
          setMessagesData(prev => ({
            ...prev,
            [group.name]: [{ senderId: 'system', senderName: 'System', text: 'Welcome to the group!' }]
          }));
        }
      }
    }, [groups, conversations]);

    const leaveGroup = useCallback((groupId: string, userHandle: string) => {
      setGroups(prevGroups => prevGroups.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            members: g.members.filter(m => m.handle !== userHandle),
          };
        }
        return g;
      }));
    }, []);

    const addJobListing = useCallback((job: JobListing) => {
        setJobListings(prev => [job, ...prev]);
    }, []);



    const addFeedItem = useCallback((post: FeedItem) => {
        setFeedItems(prev => [post, ...prev]);
    }, []);

    const addStoryItem = useCallback((userHandle: string, item: StoryItem) => {
        setStories(prevStories => {
            const newStories = [...prevStories];
            const userStoryIndex = newStories.findIndex(story => story.author.handle === userHandle);
            
            if (userStoryIndex !== -1) {
                const updatedStory = {
                    ...newStories[userStoryIndex],
                    items: [...newStories[userStoryIndex].items, item]
                };
                newStories[userStoryIndex] = updatedStory;
            } else {
                 const member = communityMembers.find(m => m.handle === userHandle);
                 if (member) {
                    newStories.push({
                        id: Date.now(),
                        author: {
                            name: member.name,
                            avatar: member.avatar,
                            handle: member.handle,
                            aiHint: member.aiHint,
                        },
                        items: [item]
                    });
                 }
            }
            return newStories;
        });
    }, [communityMembers]);

    const deleteStoryItem = useCallback((userHandle: string, itemId: number) => {
        setStories(prev => prev.map(story => {
            if (story.author.handle === userHandle) {
                return {
                    ...story,
                    items: story.items.filter(item => item.id !== itemId)
                };
            }
            return story;
        }));
    }, []);

    const addStoryForUser = useCallback((user: CommunityMember) => {
        const newStory: Story = {
            id: Date.now(),
            author: {
                name: user.name,
                avatar: user.avatar,
                handle: user.handle,
                aiHint: user.aiHint,
            },
            items: [],
            viewers: [],
        };
        setStories(prev => [...prev, newStory]);
    }, []);

    const value = {
        conversations,
        setConversations,
        messagesData,
        setMessagesData,
        selectedConversation,
        setSelectedConversation,
        setSelectedConversationByName,
        events,
        setEvents,
        addEvent,
        groups,
        setGroups,
        addGroup,
        joinGroup,
        leaveGroup,
        jobListings,
        setJobListings,
        addJobListing,
        communityMembers,
        setCommunityMembers,
        feedItems,
        setFeedItems,
        addFeedItem,
        stories,
        setStories,
        addStoryItem,
        deleteStoryItem,
        addStoryForUser,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
