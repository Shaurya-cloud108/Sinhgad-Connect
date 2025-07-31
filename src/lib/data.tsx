

"use client";

import { initialCommunityMembers, initialFeedItems, initialConversations, initialMessages, initialEvents, initialGroups, initialStories, initialSuccessStories, initialNotifications } from './data-seed';

// This file now only contains type definitions and exports the initial data.
// The data itself is defined in `data-seed.ts`.

export type GroupMember = {
  handle: string;
  role: 'admin' | 'moderator' | 'member';
};

export type GroupLink = {
  label: string;
  url: string;
};

export type Group = {
  id: string;
  name: string;
  summary: string;
  about: string;
  banner: string;
  aiHint: string;
  members: GroupMember[];
  type: 'public' | 'private';
  tags: string[];
  links?: GroupLink[];
};

export type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  aiHint: string;
};

export type JobListing = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Contract" | "Internship";
  tags: string[];
  postedBy: string;
  postedByHandle: string;
  description: string;
  applicationUrl?: string;
};

export type StoryViewer = {
  name: string;
  avatar: string;
};

export type StoryItem = {
  id: number;
  url: string;
  type: 'image' | 'video';
  timestamp: number;
};

export type Story = {
  id: number;
  author: {
    name: string;
    avatar: string;
    handle: string;
    aiHint: string;
  };
  items: StoryItem[];
  viewers?: StoryViewer[];
};


export type SuccessStory = {
    id: string;
    name: string;
    class: string;
    role: string;
    image: string;
    aiHint: string;
    story: string;
    tags: string[];
    insights: {
        summary: string;
        keyTakeaways: string[];
        careerAdvice: string;
    }
};

export type Comment = {
  id: number;
  author: {
    name: string;
    avatar: string;
    handle: string;
  };
  text: string;
};

export type FeedItem = {
    id: string;
    author: {
      name: string;
      avatar: string;
      handle: string;
      aiHint: string;
    };
    content: string;
    image: string | null;
    location?: string;
    aiHint: string;
    likes: number;
    likedBy: string[];
    comments: Comment[];
    groupId?: string;
    createdAt: any;
}

export type EducationEntry = {
  degree: string;
  college: string;
  yearRange: string;
  graduationYear?: number;
  graduationMonth?: number;
};

export type CommunityMember = {
    name: string;
    avatar: string;
    fallback: string;
    graduationYear: number;
    graduationMonth: number;
    field: string;
    industry: string;
    company: string;
    location: string;
    followers: string[];
    following: string[];
    aiHint: string;
    handle: string;
    banner: string;
    bannerAiHint: string;
    headline: string;
    about: string;
    experience: {
        role: string;
        company: string;
        duration: string;
    }[];
    education: EducationEntry[];
    socials: {
        linkedin: string;
        github: string;
    };
    contact: {
        email: string;
        website?: string;
    };
    groups?: string[];
};

export type ProfileData = CommunityMember;

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
    sharedPostId?: string;
    sharedJobId?: string;
    sharedEventId?: string;
    sharedStoryId?: string;
    sharedProfileId?: string;
    sharedGroupId?: string;
};

export type MessagesData = {
    [key: string]: Message[];
};

export type Notification = {
    id: string;
    type: 'connection' | 'message' | 'event' | 'job' | 'like' | 'comment';
    userName?: string; 
    commentText?: string;
    eventTitle?: string;
    jobTitle?: string;
    companyName?: string;
    rawText?: string;
    time: string;
    actions?: { label: string; href: string }[];
    avatar: string;
    aiHint: string;
    contentPreview?: string;
};

const initialFeedItems: FeedItem[] = initialFeedItemsData.map((item, index) => ({
  ...item,
  id: `post-${index + 1}`,
  createdAt: new Date(Date.now() - index * 1000 * 60 * 60 * 24).toISOString(), // Simulate posts over last few days
}));

const initialStories: Story[] = initialStoriesData;
const initialEvents: Event[] = initialEventsData;
const initialGroups: Group[] = initialGroupsData;

export {
  initialCommunityMembers,
  initialFeedItems,
  initialConversations,
  initialMessages,
  initialEvents,
  initialGroups,
  initialStories,
  initialSuccessStories,
  initialNotifications,
};
