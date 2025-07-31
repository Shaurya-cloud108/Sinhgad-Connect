
"use client";

import React, { createContext, useState, ReactNode, useCallback, useContext, useEffect, useMemo } from 'react';
import {
    initialConversations as baseInitialConversations,
    initialMessages,
    initialJobListings,
    initialCommunityMembers,
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
import { ProfileContext } from './ProfileContext';
import { PostEditFormData } from '@/components/edit-post-dialog';
import {
  addFeedItem as addFeedItemFs,
  getFeedItems,
  updateFeedItem as updateFeedItemFs,
  deleteFeedItem as deleteFeedItemFs,
  toggleLike as toggleLikeFs,
  addComment as addCommentFs,
  deleteComment as deleteCommentFs,
} from '@/lib/firebase-services';
import { serverTimestamp } from 'firebase/firestore';


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
    addFeedItem: (post: Omit<FeedItem, 'id' | 'createdAt' | 'likes' | 'likedBy' | 'comments'>) => void;
    updateFeedItem: (postId: string, data: PostEditFormData) => void;
    deleteFeedItem: (postId: string) => void;
    toggleLike: (postId: string, userId: string) => void;
    addComment: (postId: string, comment: Omit<Comment, 'id'>) => void;
    deleteComment: (postId: string, commentId: number) => void;


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
    updateFeedItem: () => {},
    deleteFeedItem: () => {},
    toggleLike: () => {},
    addComment: () => {},
    deleteComment: () => {},
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
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [stories, setStories] = useState<Story[]>(initialStories);

    useEffect(() => {
        const fetchFeed = async () => {
            const items = await getFeedItems();
            setFeedItems(items);
        };
        fetchFeed();
    }, []);

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

            const existingConvoNames = new Set(baseInitialConversations.map(c => c.name));
            const newGroupConvos = groupConversations.filter(gc => !existingConvoNames.has(gc.name));

            setConversations(prev => [...newGroupConvos, ...prev.filter(c => !newGroupConvos.some(ngc => ngc.name === c.name))]);
        }
    }, [profileData, groups]);

    const setSelectedConversationByName = useCallback((name: string) => {
        const existingConversation = conversations.find(c => c.name === name);

        if (existingConversation) {
            setSelectedConversation(existingConversation);
            return;
        }

        const person = communityMembers.find(m => m.name === name);
        if (person) {
            const newConversation: Conversation = {
                name: person.name,
                avatar: person.avatar,
                aiHint: person.aiHint,
                lastMessage: "New conversation started.",
                time: "Now",
                unread: 0,
                isGroup: false,
            };
            setConversations(prev => [newConversation, ...prev]);
            setSelectedConversation(newConversation);
        }
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

    const addFeedItem = useCallback(async (post: Omit<FeedItem, 'id' | 'createdAt' | 'likes' | 'likedBy' | 'comments'>) => {
        const newPostData = {
            ...post,
            createdAt: serverTimestamp(),
            likes: 0,
            likedBy: [],
            comments: [],
        };
        const newPostId = await addFeedItemFs(newPostData);
        setFeedItems(prev => [{ ...newPostData, id: newPostId }, ...prev]);
    }, []);

    const updateFeedItem = useCallback(async (postId: string, data: PostEditFormData) => {
        await updateFeedItemFs(postId, data);
        setFeedItems(prev => prev.map(item =>
            item.id === postId ? { ...item, content: data.content, location: data.location || undefined } : item
        ));
    }, []);

    const deleteFeedItem = useCallback(async (postId: string) => {
        await deleteFeedItemFs(postId);
        setFeedItems(prev => prev.filter(item => item.id !== postId));
    }, []);

    const toggleLike = useCallback(async (postId: string, userHandle: string) => {
        const item = feedItems.find(i => i.id === postId);
        if (!item) return;
        const isLiked = item.likedBy.includes(userHandle);

        setFeedItems(prev => prev.map(i =>
            i.id === postId
                ? {
                    ...i,
                    likedBy: isLiked ? i.likedBy.filter(h => h !== userHandle) : [...i.likedBy, userHandle],
                    likes: isLiked ? i.likes - 1 : i.likes + 1,
                  }
                : i
        ));
        await toggleLikeFs(postId, userHandle, isLiked);
    }, [feedItems]);

    const addComment = useCallback(async (postId: string, comment: Omit<Comment, 'id'>) => {
      const newComment = await addCommentFs(postId, comment);
      setFeedItems(prev => prev.map(item =>
        item.id === postId
          ? { ...item, comments: [...item.comments, newComment] }
          : item
      ));
    }, []);

    const deleteComment = useCallback(async (postId: string, commentId: number) => {
      await deleteCommentFs(postId, commentId);
      setFeedItems(prev => prev.map(item =>
        item.id === postId
          ? { ...item, comments: item.comments.filter(c => c.id !== commentId) }
          : item
      ));
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
        updateFeedItem,
        deleteFeedItem,
        toggleLike,
        addComment,
        deleteComment,
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
