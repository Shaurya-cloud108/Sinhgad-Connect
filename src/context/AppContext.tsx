
"use client";

import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { 
    initialConversationsData, 
    initialMessagesData, 
    initialCommunityMembers, 
    initialJobListings, 
    initialFeedItems, 
    initialStoriesData,
    initialEventsData
} from '@/lib/data.tsx';
import type { 
    Conversation as ConvType, 
    MessagesData as MsgType, 
    JobListing, 
    CommunityMember, 
    FeedItem, 
    Story, 
    Message, 
    StoryItem,
    Event
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
});

// Provider
export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [conversations, setConversations] = useState<Conversation[]>(initialConversationsData);
    const [messagesData, setMessagesData] = useState<MessagesData>(initialMessagesData);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [events, setEvents] = useState<Event[]>(initialEventsData);
    const [jobListings, setJobListings] = useState<JobListing[]>(initialJobListings);
    const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>(initialCommunityMembers);
    const [feedItems, setFeedItems] = useState<FeedItem[]>(initialFeedItems);
    const [stories, setStories] = useState<Story[]>(initialStoriesData);

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
            }
            return newStories;
        });
    }, []);

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
        deleteStoryItem
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
