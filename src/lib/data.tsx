
"use client";

import React from 'react';
import { Member, NetworkingGroup, Conversation } from "@/context/AppContext";

export type JobListing = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Contract" | "Internship";
  tags: string[];
  postedBy: string;
  description: string;
};

export const jobListings: JobListing[] = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    company: "Innovate Inc.",
    location: "Remote",
    type: "Full-time",
    tags: ["React", "TypeScript", "Next.js"],
    postedBy: "Sunita Narayan '09",
    description: "Innovate Inc. is seeking a passionate Senior Frontend Engineer to build and scale our next-generation sustainable tech products. You will work with a modern tech stack and a talented team to create beautiful, responsive, and high-performance web applications."
  },
  {
    id: 2,
    title: "Data Scientist",
    company: "DataDriven Co.",
    location: "Pune, India",
    type: "Full-time",
    tags: ["Python", "Machine Learning", "SQL"],
    postedBy: "Rajesh Kumar '11",
    description: "Join DataDriven Co. and help us solve complex problems with data. As a Data Scientist, you will be responsible for designing and implementing machine learning models, performing statistical analysis, and communicating insights to stakeholders."
  },
  {
    id: 3,
    title: "Product Manager",
    company: "Connectify",
    location: "Bangalore, India",
    type: "Full-time",
    tags: ["Agile", "Roadmap", "UX"],
    postedBy: "Ananya Deshpande '14",
    description: "Connectify is looking for a user-centric Product Manager to lead our product strategy and roadmap. You will work closely with engineering, design, and marketing to deliver products that our users love."
  },
  {
    id: 4,
    title: "UX/UI Designer",
    company: "Creative Solutions",
    location: "Remote",
    type: "Contract",
    tags: ["Figma", "User Research", "Prototyping"],
    postedBy: "Alumni Network",
    description: "We are looking for a talented UX/UI Designer to create amazing user experiences. The ideal candidate will have a strong portfolio of design projects and be proficient in Figma, user research, and prototyping."
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudLeap",
    location: "Hyderabad, India",
    type: "Full-time",
    tags: ["AWS", "Kubernetes", "CI/CD"],
    postedBy: "Amit Singh '15",
    description: "CloudLeap is hiring a DevOps Engineer to manage and improve our cloud infrastructure. You will be responsible for our CI/CD pipelines, automation, and ensuring the reliability and scalability of our systems."
  },
  {
    id: 6,
    title: "Marketing Intern",
    company: "GrowthX",
    location: "Mumbai, India",
    type: "Internship",
    tags: ["Social Media", "SEO"],
    postedBy: "Alumni Network",
    description: "Gain hands-on experience in digital marketing with GrowthX! This internship will give you exposure to social media marketing, SEO, content creation, and campaign analysis. A great opportunity for aspiring marketers."
  },
];

export type StoryViewer = {
  name: string;
  avatar: string;
};

export type Story = {
  id: number;
  name: string;
  avatar: string;
  images: string[];
  isOwn?: boolean;
  aiHint: string;
  viewers?: StoryViewer[];
};


export const stories: Story[] = [
    { id: 1, name: "Your Story", avatar: "https://placehold.co/100x100.png", images: [], isOwn: true, aiHint: "add icon", viewers: [
        { name: "Sunita Narayan", avatar: "https://placehold.co/100x100.png" },
        { name: "Kavya Iyer", avatar: "https://placehold.co/100x100.png" },
    ] },
    { 
      id: 2, 
      name: "Rohan V.", 
      avatar: "https://placehold.co/100x100.png", 
      images: ["https://placehold.co/400x700.png"], 
      aiHint: "professional man",
      viewers: [
        { name: "Priya Sharma", avatar: "https://placehold.co/100x100.png" },
        { name: "Anjali Mehta", avatar: "https://placehold.co/100x100.png" },
      ]
    },
    { id: 3, name: "Anjali M.", avatar: "https://placehold.co/100x100.png", images: ["https://placehold.co/400x700.png"], aiHint: "corporate woman", viewers: [] },
    { id: 4, name: "Vikram S.", avatar: "https://placehold.co/100x100.png", images: ["https://placehold.co/400x700.png"], aiHint: "corporate man", viewers: [] },
    { id: 5, name: "Sneha R.", avatar: "https://placehold.co/100x100.png", images: ["https://placehold.co/400x700.png"], aiHint: "young professional", viewers: [] },
];


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
    id: number;
    author: {
      name: string;
      avatar: string;
      handle: string;
      aiHint: string;
    };
    content: string;
    image: string | null;
    aiHint: string;
    likes: number;
    liked?: boolean;
    comments: Comment[];
}

export const feedItems: FeedItem[] = [
  {
    id: 1,
    author: {
      name: "Annual Alumni Meet",
      avatar: "https://placehold.co/100x100.png",
      handle: "Official Event",
      aiHint: "university logo"
    },
    content: "The flagship event of the year is just around the corner! Reconnect with old friends, network with peers, and relive your college days. Don't miss out on the Annual Alumni Grand Meet 2024. Register now!",
    image: "https://placehold.co/600x400.png",
    aiHint: "people networking",
    likes: 256,
    comments: [],
    liked: false,
  },
  {
    id: 2,
    author: {
      name: "Sunita Narayan '09",
      avatar: "https://placehold.co/100x100.png",
      handle: "CEO at Innovate Inc.",
      aiHint: "professional woman portrait"
    },
    content: "Thrilled to share that Innovate Inc. just launched a new line of sustainable tech products! A huge thanks to the team and the foundation I got from Sinhgad. Looking to hire fellow alumni for a Senior Frontend role - check the jobs board!",
    image: null,
    aiHint: "",
    likes: 189,
    comments: [
        {
            id: 101,
            author: { name: "Rohan Verma", avatar: "https://placehold.co/100x100.png", handle: "rohan-verma" },
            text: "Congratulations, Sunita! This is huge."
        }
    ],
    liked: true,
  },
  {
    id: 3,
    author: {
      name: "Alumni Network Job Board",
      avatar: "https://placehold.co/100x100.png",
      handle: "Career Center",
      aiHint: "briefcase icon"
    },
    content: "New Opportunity! DataDriven Co. is hiring a Data Scientist in Pune. This role was posted by Rajesh Kumar '11. Apply now and take the next step in your career.",
    image: "https://placehold.co/600x400.png",
    aiHint: "modern office",
    likes: 98,
    comments: [],
    liked: false,
  },
  {
    id: 4,
    author: {
      name: "Priya Sharma",
      avatar: "https://placehold.co/150x150.png",
      handle: "priya-sharma-09",
      aiHint: "professional woman"
    },
    content: "Just hit my 5-year anniversary at Google! So grateful for the journey and the amazing people I've worked with. The lessons I learned at Sinhgad continue to be my foundation.",
    image: null,
    aiHint: "",
    likes: 152,
    comments: [],
    liked: true,
  },
  {
    id: 5,
    author: {
      name: "Priya Sharma",
      avatar: "https://placehold.co/150x150.png",
      handle: "priya-sharma-09",
      aiHint: "professional woman"
    },
    content: "Mentoring a final year student on their capstone project has been such a rewarding experience. It's amazing to see the talent coming out of our college!",
    image: "https://placehold.co/600x400.png",
    aiHint: "mentoring session",
    likes: 98,
    comments: [],
    liked: false,
  }
];

export type ProfileData = {
  name: string;
  avatar: string;
  aiHint: string;
  banner: string;
  bannerAiHint: string;
  handle: string;
  headline: string;
  location: string;
  connections: number;
  posts: number;
  about: string;
  experience: {
    role: string;
    company: string;
    duration: string;
  }[];
  education: {
    degree: string;
    college: string;
    yearRange: string;
    graduationYear: number;
    graduationMonth: number;
  };
};


export const profileData: ProfileData = {
  name: "Priya Sharma",
  avatar: "https://placehold.co/150x150.png",
  aiHint: "professional woman",
  banner: "https://placehold.co/1000x300.png",
  bannerAiHint: "university campus",
  handle: "priya-sharma-09",
  headline: "Senior Software Engineer at Google | Mentor",
  location: "San Francisco Bay Area",
  connections: 500,
  posts: 42,
  about: "Passionate about building scalable systems and helping the next generation of engineers. Graduated in 2009 with a degree in Computer Engineering. Feel free to reach out for advice on careers in tech, interview prep, or anything else!",
  experience: [
    {
      role: "Senior Software Engineer",
      company: "Google",
      duration: "2015 - Present",
    },
    {
      role: "Software Engineer",
      company: "Innovate Inc.",
      duration: "2012 - 2015",
    },
  ],
  education: {
    degree: "B.E. Computer Engineering",
    college: "Sinhgad College of Engineering",
    yearRange: "2005 - 2009",
    graduationYear: 2009,
    graduationMonth: 6,
  },
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
    aiHint: string;
    handle: string;
};

export const communityMembers: CommunityMember[] = [
  {
    name: "Priya Sharma",
    avatar: "https://placehold.co/100x100.png",
    fallback: "PS",
    graduationYear: 2010,
    graduationMonth: 6,
    field: "Computer Engineering",
    industry: "Technology",
    company: "Google",
    location: "San Francisco, CA",
    aiHint: "professional woman",
    handle: "priya-sharma-09",
  },
  {
    name: "Rohan Verma",
    avatar: "https://placehold.co/100x100.png",
    fallback: "RV",
    graduationYear: 2012,
    graduationMonth: 6,
    field: "Mechanical Engineering",
    industry: "Automotive",
    company: "Tesla",
    location: "Austin, TX",
    aiHint: "professional man",
    handle: "rohan-verma",
  },
  {
    name: "Anjali Mehta",
    avatar: "https://placehold.co/100x100.png",
    fallback: "AM",
    graduationYear: 2015,
    graduationMonth: 6,
    field: "Electronics & Telecommunication",
    industry: "Telecommunications",
    company: "Verizon",
    location: "New York, NY",
    aiHint: "corporate woman",
    handle: "anjali-mehta",
  },
  {
    name: "Kavya Iyer",
    avatar: "https://placehold.co/100x100.png",
    fallback: "KI",
    graduationYear: 2025,
    graduationMonth: 6,
    field: "Information Technology",
    industry: "Student",
    company: "Sinhgad College of Engineering",
    location: "Pune, India",
    aiHint: "female student",
    handle: "kavya-iyer",
  },
  {
    name: "Vikram Singh",
    avatar: "https://placehold.co/100x100.png",
    fallback: "VS",
    graduationYear: 2008,
    graduationMonth: 6,
    field: "Information Technology",
    industry: "Finance",
    company: "Goldman Sachs",
    location: "London, UK",
    aiHint: "corporate man",
    handle: "vikram-singh",
  },
  {
    name: "Sneha Reddy",
    avatar: "https://placehold.co/100x100.png",
    fallback: "SR",
    graduationYear: 2018,
    graduationMonth: 6,
    field: "Computer Engineering",
    industry: "E-commerce",
    company: "Amazon",
    location: "Seattle, WA",
    aiHint: "young professional",
    handle: "sneha-reddy",
  },
  {
    name: "Arjun Desai",
    avatar: "https://placehold.co/100x100.png",
    fallback: "AD",
    graduationYear: 2026,
    graduationMonth: 6,
    field: "Computer Engineering",
    industry: "Student",
    company: "Sinhgad College of Engineering",
    location: "Pune, India",
    aiHint: "male student",
    handle: "arjun-desai",
  },
  {
    name: "Amit Patel",
    avatar: "https://placehold.co/100x100.png",
    fallback: "AP",
    graduationYear: 2013,
    graduationMonth: 6,
    field: "Civil Engineering",
    industry: "Construction",
    company: "L&T Construction",
    location: "Mumbai, India",
    aiHint: "engineer man",
    handle: "amit-patel",
  },
  {
    name: "Sunita Narayan",
    avatar: "https://placehold.co/100x100.png",
    fallback: "SN",
    graduationYear: 2009,
    graduationMonth: 6,
    field: "Computer Engineering",
    industry: "Technology",
    company: "Innovate Inc.",
    location: "Remote",
    aiHint: "professional woman portrait",
    handle: "sunita-narayan",
  }
];


const groupMembers: { [key: string]: Member[] } = {
  "Software & Tech Innovators": [
    { id: 'priya-sharma-09', name: 'Priya Sharma', avatar: profileData.avatar, role: 'admin' },
    { id: 'rohan-verma', name: 'Rohan Verma', avatar: 'https://placehold.co/100x100.png', role: 'member' },
    { id: 'kavya-iyer', name: 'Kavya Iyer', avatar: 'https://placehold.co/100x100.png', role: 'member' },
  ],
  "Entrepreneurship Hub": [
     { id: 'priya-sharma-09', name: 'Priya Sharma', avatar: profileData.avatar, role: 'admin' },
     { id: 'sunita-narayan', name: "Sunita Narayan", avatar: 'https://placehold.co/100x100.png', role: 'admin' },
  ]
};

export const networkingGroups: NetworkingGroup[] = [
  {
    title: "Software & Tech Innovators",
    description: "Connect with alumni and students in the tech industry. Share insights on coding, product development, and emerging technologies.",
    iconName: "code",
    members: groupMembers["Software & Tech Innovators"],
  },
  {
    title: "Entrepreneurship Hub",
    description: "A group for founders, aspiring entrepreneurs, and investors. Discuss startup ideas, funding, and growth strategies.",
    iconName: "rocket",
    members: groupMembers["Entrepreneurship Hub"],
  },
  {
    title: "Core Engineering Circle",
    description: "For alumni and students in Mechanical, Civil, and Electrical fields. Collaborate on projects and discuss industry trends.",
    iconName: "building",
    members: [],
  },
  {
    title: "Management & Consulting",
    description: "Network with alumni and students interested in business management, finance, and consulting roles.",
    iconName: "briefcase",
    members: [],
  },
  {
    title: "Bay Area Alumni & Students",
    description: "Connect with fellow graduates and current students in the San Francisco Bay Area for local meetups and networking.",
    iconName: "globe",
    members: [],
  },
   {
    title: "Higher Education & Academia",
    description: "A forum for alumni and students pursuing or working in research, teaching, and higher education.",
    iconName: "globe",
    members: [],
  },
];


export const conversationsData: Conversation[] = [
  {
    name: "Rohan Verma",
    avatar: "https://placehold.co/100x100.png",
    aiHint: "professional man",
    lastMessage: "Thanks for the resume tips!",
    time: "9:15 AM",
    unread: 0,
    isGroup: false,
  },
  {
    name: "Kavya Iyer",
    avatar: "https://placehold.co/100x100.png",
    aiHint: "female student",
    lastMessage: "Thank you for the mentorship!",
    time: "Yesterday",
    unread: 1,
    isGroup: false,
  },
];

export const messagesData: { [key: string]: { senderId: string; senderName: string; text: string }[] } = {
  "Rohan Verma": [
    { senderId: "rohan-verma", senderName: "Rohan Verma", text: "Thanks for the resume tips!" },
  ],
  "Kavya Iyer": [
      { senderId: 'kavya-iyer', senderName: 'Kavya Iyer', text: "Hi Priya! I had a question about my project." },
      { senderId: profileData.handle, senderName: profileData.name, text: "Of course, ask away!" },
      { senderId: 'kavya-iyer', senderName: 'Kavya Iyer', text: "Thank you for the mentorship!" },
  ],
  "Software & Tech Innovators": [
      { senderId: 'rohan-verma', senderName: 'Rohan Verma', text: 'Has anyone worked with the new Bun APIs?' },
      { senderId: profileData.handle, senderName: profileData.name, text: 'I have! It’s incredibly fast. What are you building?' },
  ],
  "Entrepreneurship Hub": [
      { senderId: 'sunita-narayan', senderName: 'Sunita Narayan', text: 'Seed funding secured! Big things coming soon.' },
  ]
};

// Helper function to get content details for sharing
export const getContentDetails = (contentType: string, contentId: string | number) => {
    switch (contentType) {
        case 'post':
            const post = feedItems.find(item => item.id === contentId);
            return post ? { title: `A post by ${post.author.name}`, url: `/` } : null;
        case 'job':
            const job = jobListings.find(item => item.id === contentId);
            return job ? { title: `Job: ${job.title} at ${job.company}`, url: `/jobs` } : null;
        case 'event':
            // This is a placeholder as events don't have unique IDs yet
            return { title: `Event: ${contentId}`, url: `/events` };
        case 'story':
             // This is a placeholder as stories don't have unique IDs yet
            return { title: `Success Story: ${contentId}`, url: `/success-stories` };
        default:
            return null;
    }
}

export type Notification = {
    type: 'connection' | 'message' | 'event' | 'job' | 'like' | 'comment';
    text: React.ReactNode;
    time: string;
    actions?: { label: string; href: string }[];
    avatar: string;
    aiHint: string;
    contentPreview?: string;
};

export const notifications: Notification[] = [
    {
        type: 'like',
        text: <p><b>Rohan Verma</b> liked your post.</p>,
        contentPreview: "Mentoring a final year student on their capstone project...",
        time: "15 minutes ago",
        avatar: "https://placehold.co/100x100.png",
        aiHint: "professional man",
        actions: [{ label: 'View Post', href: '/' }]
    },
    {
        type: 'comment',
        text: <p><b>Anjali Mehta</b> commented: "This is so inspiring! Congratulations!"</p>,
        contentPreview: "Just hit my 5-year anniversary at Google! So grateful...",
        time: "1 hour ago",
        avatar: "https://placehold.co/100x100.png",
        aiHint: "corporate woman",
        actions: [{ label: 'Reply', href: '/' }]
    },
    {
        type: "connection",
        text: <p><b>Vikram Singh</b> sent you a connection request.</p>,
        time: "2 hours ago",
        actions: [
            { label: 'Accept', href: '/profile' },
            { label: 'Ignore', href: '#' }
        ],
        avatar: "https://placehold.co/100x100.png",
        aiHint: "corporate man"
    },
    {
        type: "message",
        text: <p><b>Kavya Iyer</b> sent you a new message.</p>,
        time: "5 hours ago",
        actions: [{ label: 'Reply', href: '/messages' }],
        avatar: "https://placehold.co/100x100.png",
        aiHint: "female student"
    },
    {
        type: "event",
        text: <p>Reminder: <b>Annual Alumni Grand Meet 2024</b> is tomorrow.</p>,
        time: "1 day ago",
        actions: [{ label: 'View Event', href: '/events' }],
        avatar: "https://placehold.co/100x100.png",
        aiHint: "university logo"
    },
    {
        type: "job",
        text: <p>A new job matching your profile was posted: <b>Senior Frontend Engineer</b> at Innovate Inc.</p>,
        time: "2 days ago",
        actions: [{ label: 'View Job', href: '/jobs' }],
        avatar: "https://placehold.co/100x100.png",
        aiHint: "briefcase icon"
    },
];
