
"use client";

// This file now only contains type definitions. 
// The initial data has been moved to `data-seed.ts` for database seeding.

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
  id: string; // Changed to string for Firestore
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
    createdAt: any; // For Firestore timestamp
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
    followers: string[]; // Array of user handles
    following: string[]; // Array of user handles
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
    groups?: string[]; // Array of group IDs
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

export type Notification = {
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
