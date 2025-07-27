
"use client";

import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { 
    initialConversations, 
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
    Group
} from '@/lib/data';

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
    addGroup: (group: Group) => void;
    addConversationForGroup: (group: Group) => void;
    removeConversationForGroup: (group: Group) => void;

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
    addGroup: () => {},
    addConversationForGroup: () => {},
    removeConversationForGroup: () => {},
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
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [messagesData, setMessagesData] = useState<MessagesData>(initialMessages);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [events, setEvents] = useState<Event[]>(initialEventsData);
    const [groups, setGroups] = useState<Group[]>(initialGroupsData);
    const [jobListings, setJobListings] = useState<JobListing[]>(initialJobListings);
    const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>(initialCommunityMembers);
    const [feedItems, setFeedItems] = useState<FeedItem[]>(initialFeedItems);
    const [stories, setStories] = useState<Story[]>(initialStories);
    
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

    const addGroup = useCallback((group: Group) => {
        setGroups(prev => [group, ...prev]);
    }, []);
    
    const addConversationForGroup = useCallback((group: Group) => {
        const existingConvo = conversations.find(c => c.name === group.name);
        if (existingConvo) return; // Don't add if it already exists

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

        // Optionally, add a welcome message to the group chat
        setMessagesData(prev => ({
            ...prev,
            [group.name]: [{
                senderId: 'system',
                senderName: 'System',
                text: 'Welcome to the group!'
            }]
        }));
    }, [conversations]);
    
    const removeConversationForGroup = useCallback((group: Group) => {
        setConversations(prev => prev.filter(c => c.name !== group.name));
        
        // Also clear the selected conversation if it's the one being left
        setSelectedConversation(prev => (prev?.name === group.name ? null : prev));
        
        // We can choose to keep or delete the message history. 
        // For now, we'll keep it, but one could delete it like this:
        // setMessagesData(prev => {
        //   const newMessages = { ...prev };
        //   delete newMessages[group.name];
        //   return newMessages;
        // });
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
        addConversationForGroup,
        removeConversationForGroup,
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
