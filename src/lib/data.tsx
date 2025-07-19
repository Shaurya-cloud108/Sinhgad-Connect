
"use client";

import React from 'react';
import { Member, NetworkingGroup, Conversation, MessagesData } from "@/context/AppContext";

export type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  aiHint: string;
};

export const eventsData: Event[] = [
  {
    id: "annual-meet-2024",
    title: "Annual Alumni Grand Meet 2024",
    date: "October 25, 2024",
    location: "College Auditorium, Pune",
    description: "The flagship event of the year! Reconnect with old friends, network with peers, and relive your college days.",
    image: "https://placehold.co/600x400.png",
    aiHint: "people networking"
  },
  {
    id: "tech-talk-ai",
    title: "Tech Talk: AI & The Future",
    date: "November 12, 2024",
    location: "Virtual Event (Zoom)",
    description: "Join us for an insightful session with industry experts on the future of Artificial Intelligence.",
    image: "https://placehold.co/600x400.png",
    aiHint: "technology conference"
  },
  {
    id: "reunion-2014",
    title: "Batch of 2014: 10-Year Reunion",
    date: "December 7, 2024",
    location: "The Westin, Pune",
    description: "A special evening for the class of 2014 to celebrate a decade of memories and achievements.",
    image: "https://placehold.co/600x400.png",
    aiHint: "formal dinner"
  },
  {
    id: "sports-day-2025",
    title: "Alumni Sports Day",
    date: "January 18, 2025",
    location: "College Sports Complex",
    description: "Get ready for some friendly competition in cricket, football, and more. Fun for the whole family!",
    image: "https://placehold.co/600x400.png",
    aiHint: "outdoor sports"
  },
];

export type JobListing = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Contract" | "Internship";
  tags: string[];
  postedBy: string;
  postedByHandle: string;
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
    postedByHandle: "sunita-narayan",
    description: "Innovate Inc. is seeking a passionate Senior Frontend Engineer to build and scale our next-generation sustainable tech products. You will work with a modern tech stack and a talented team to create beautiful, responsive, and high-performance web applications."
  },
  {
    id: 2,
    title: "Data Scientist",
    company: "DataDriven Co.",
    location: "Pune, India",
    type: "Full-time",
    tags: ["Python", "Machine Learning", "SQL"],
    postedBy: "Rohan Verma '12",
    postedByHandle: "rohan-verma",
    description: "Join DataDriven Co. and help us solve complex problems with data. As a Data Scientist, you will be responsible for designing and implementing machine learning models, performing statistical analysis, and communicating insights to stakeholders."
  },
  {
    id: 3,
    title: "Product Manager",
    company: "Connectify",
    location: "Bangalore, India",
    type: "Full-time",
    tags: ["Agile", "Roadmap", "UX"],
    postedBy: "Anjali Mehta '15",
    postedByHandle: "anjali-mehta",
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
    postedByHandle: "alumni-network",
    description: "We are looking for a talented UX/UI Designer to create amazing user experiences. The ideal candidate will have a strong portfolio of design projects and be proficient in Figma, user research, and prototyping."
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudLeap",
    location: "Hyderabad, India",
    type: "Full-time",
    tags: ["AWS", "Kubernetes", "CI/CD"],
    postedBy: "Vikram Singh '08",
    postedByHandle: "vikram-singh",
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
    postedByHandle: "alumni-network",
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

export type SuccessStory = {
    id: string;
    name: string;
    class: string;
    role: string;
    image: string;
    aiHint: string;
    story: string;
    tags: string[];
};

export const successStories: SuccessStory[] = [
  {
    id: "sunita-narayan",
    name: "Sunita Narayan",
    class: "2009",
    role: "CEO, Innovate Inc.",
    image: "https://placehold.co/400x400.png",
    aiHint: "professional woman portrait",
    story: "Sunita Narayan, a 2009 Computer Engineering graduate, is the trailblazing CEO of Innovate Inc. After starting her career at a major tech firm, she identified a gap in the market for sustainable technology solutions. She founded Innovate Inc. with a small team, focusing on creating eco-friendly consumer electronics. Under her leadership, the company developed a breakthrough biodegradable material for device casings. Her vision and relentless drive led Innovate Inc. through multiple funding rounds and ultimately to a successful IPO, establishing her as a leading voice in green technology and an inspiration for aspiring entrepreneurs.",
    tags: ["Leadership", "Technology", "Entrepreneurship"],
  },
  {
    id: "rohan-gupta",
    name: "Dr. Rohan Gupta",
    class: "2005",
    role: "Lead Researcher, CureAI",
    image: "https://placehold.co/400x400.png",
    aiHint: "male doctor",
    story: "Dr. Rohan Gupta, a 2005 Electronics & Telecommunication alumnus, has made monumental contributions to medical science. After completing his PhD in biomedical engineering, he joined CureAI, a research lab focused on artificial intelligence in healthcare. He spearheaded a project to develop an AI-driven diagnostic tool that analyzes medical images with unprecedented accuracy. His team's algorithm can detect early-stage cancer markers far more effectively than traditional methods, significantly improving patient outcomes. His work has been published in numerous prestigious journals and is now being adopted by hospitals worldwide.",
    tags: ["Healthcare", "AI/ML", "Research"],
  },
  {
    id: "meera-desai",
    name: "Meera Desai",
    class: "2012",
    role: "Award-Winning Architect",
    image: "https://placehold.co/400x400.png",
    aiHint: "female architect",
    story: "Meera Desai, a 2012 Civil Engineering graduate, is transforming urban landscapes with her focus on sustainable architecture. After working at several top firms, she started her own practice, 'Desai Designs.' Her firm won the bid to design a major high-rise in Mumbai, resulting in the iconic 'Green Tower.' The building incorporates vertical gardens, solar power, and a revolutionary rainwater harvesting system, setting a new standard for eco-friendly construction in India. Meera has received multiple international awards for her work and is a passionate advocate for sustainable urban development.",
    tags: ["Architecture", "Sustainability", "Design"],
  },
  {
    id: "karan-malhotra",
    name: "Karan Malhotra",
    class: "2016",
    role: "Forbes 30 Under 30, FinTech",
    image: "https://placehold.co/400x400.png",
    aiHint: "young businessman",
    story: "Karan Malhotra, from the 2016 Information Technology batch, was recognized by Forbes for his work in financial inclusion. Noticing the lack of accessible financial services in rural India, Karan co-founded 'BharatFinance,' a mobile-first platform that offers micro-loans, insurance, and investment opportunities through a simple, user-friendly interface. His startup leverages technology to reach underserved communities, empowering thousands of small business owners and farmers. His innovative approach and social impact earned him a coveted spot on the Forbes 30 Under 30 list for Asia.",
    tags: ["Finance", "Startup", "Social Impact"],
  },
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
  handle: "priya-sharma",
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
    graduationYear: 2009,
    graduationMonth: 6,
    field: "Computer Engineering",
    industry: "Technology",
    company: "Google",
    location: "San Francisco, CA",
    aiHint: "professional woman",
    handle: "priya-sharma",
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
  },
  {
    name: "Alumni Events Committee",
    avatar: "https://placehold.co/100x100.png",
    fallback: "A",
    graduationYear: 0,
    graduationMonth: 0,
    field: "Organization",
    industry: "Alumni Relations",
    company: "Sinhgad Connect",
    location: "Pune, India",
    aiHint: "university logo",
    handle: "alumni-events",
  },
  {
    name: "Alumni Network Job Board",
    avatar: "https://placehold.co/100x100.png",
    fallback: "J",
    graduationYear: 0,
    graduationMonth: 0,
    field: "Organization",
    industry: "Alumni Relations",
    company: "Sinhgad Connect",
    location: "Pune, India",
    aiHint: "briefcase icon",
    handle: "alumni-network",
  },
];

export const feedItems: FeedItem[] = [
  {
    id: 1,
    author: {
      name: "Alumni Events Committee",
      avatar: "https://placehold.co/100x100.png",
      handle: "alumni-events",
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
      name: "Sunita Narayan",
      avatar: "https://placehold.co/100x100.png",
      handle: "sunita-narayan",
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
      handle: "alumni-network",
      aiHint: "briefcase icon"
    },
    content: "New Opportunity! DataDriven Co. is hiring a Data Scientist in Pune. This role was posted by Rohan Verma '12. Apply now and take the next step in your career.",
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
      handle: "priya-sharma",
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
      handle: "priya-sharma",
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

export const stories: Story[] = [
    { 
      id: 1, 
      name: "Your Story", 
      avatar: "https://placehold.co/100x100.png", 
      images: [], 
      isOwn: true, 
      aiHint: "add icon", 
      viewers: [
        { name: "Sunita Narayan", avatar: "https://placehold.co/100x100.png" },
        { name: "Kavya Iyer", avatar: "https://placehold.co/100x100.png" },
      ] 
    },
    { 
      id: 2, 
      name: "Rohan Verma", 
      avatar: "https://placehold.co/100x100.png", 
      images: ["https://placehold.co/400x700.png"], 
      aiHint: "professional man",
      viewers: [
        { name: "Priya Sharma", avatar: "https://placehold.co/100x100.png" },
        { name: "Anjali Mehta", avatar: "https://placehold.co/100x100.png" },
      ]
    },
    { id: 3, name: "Anjali Mehta", avatar: "https://placehold.co/100x100.png", images: ["https://placehold.co/400x700.png"], aiHint: "corporate woman", viewers: [] },
    { id: 4, name: "Vikram Singh", avatar: "https://placehold.co/100x100.png", images: ["https://placehold.co/400x700.png"], aiHint: "corporate man", viewers: [] },
    { id: 5, name: "Sneha Reddy", avatar: "https://placehold.co/100x100.png", images: ["https://placehold.co/400x700.png"], aiHint: "young professional", viewers: [] },
];

const allMembersForGroups: Member[] = [
    // This list can be populated with members who are not the main user by default
    { id: 'sunita-narayan', name: 'Sunita Narayan', avatar: 'https://placehold.co/100x100.png', role: 'admin' },
    { id: 'rohan-verma', name: 'Rohan Verma', avatar: 'https://placehold.co/100x100.png', role: 'member' },
    { id: 'kavya-iyer', name: 'Kavya Iyer', avatar: 'https://placehold.co/100x100.png', role: 'member' },
    { id: 'vikram-singh', name: 'Vikram Singh', avatar: 'https://placehold.co/100x100.png', role: 'member' },
    { id: 'amit-patel', name: 'Amit Patel', avatar: 'https://placehold.co/100x100.png', role: 'member' },
    { id: 'anjali-mehta', name: 'Anjali Mehta', avatar: 'https://placehold.co/100x100.png', role: 'member' },
];

export const networkingGroups: NetworkingGroup[] = [
  {
    title: "Software & Tech Innovators",
    description: "Connect with alumni and students in the tech industry. Share insights on coding, product development, and emerging technologies.",
    iconName: "code",
    members: allMembersForGroups.filter(m => ['sunita-narayan', 'rohan-verma', 'kavya-iyer', 'sneha-reddy'].includes(m.id)),
  },
  {
    title: "Entrepreneurship Hub",
    description: "A group for founders, aspiring entrepreneurs, and investors. Discuss startup ideas, funding, and growth strategies.",
    iconName: "rocket",
    members: allMembersForGroups.filter(m => ['sunita-narayan', 'karan-malhotra'].includes(m.id)),
  },
  {
    title: "Core Engineering Circle",
    description: "For alumni and students in Mechanical, Civil, and Electrical fields. Collaborate on projects and discuss industry trends.",
    iconName: "building",
    members: allMembersForGroups.filter(m => ['rohan-verma', 'amit-patel'].includes(m.id)),
  },
  {
    title: "Management & Consulting",
    description: "Network with alumni and students interested in business management, finance, and consulting roles.",
    iconName: "briefcase",
    members: allMembersForGroups.filter(m => ['vikram-singh', 'anjali-mehta'].includes(m.id)),
  },
  {
    title: "Bay Area Alumni & Students",
    description: "Connect with fellow graduates and current students in the San Francisco Bay Area for local meetups and networking.",
    iconName: "globe",
    members: [], // Initially empty
  },
   {
    title: "Higher Education & Academia",
    description: "A forum for alumni and students pursuing or working in research, teaching, and higher education.",
    iconName: "globe",
    members: [], // Initially empty
  },
];


export const conversationsData: Conversation[] = [
    { name: 'Rohan Verma', avatar: 'https://placehold.co/100x100.png', aiHint: 'professional man', lastMessage: 'You\'re welcome! Let me know if you need more help.', time: '2h', unread: 0, isGroup: false },
    { name: 'Kavya Iyer', avatar: 'https://placehold.co/100x100.png', aiHint: 'female student', lastMessage: 'Thank you for the mentorship!', time: '1d', unread: 2, isGroup: false },
    // The user will no longer be in these groups by default, so they won't appear in initial conversations.
];

export const messagesData: MessagesData = {
  "Rohan Verma": [
    { senderId: "rohan-verma", senderName: "Rohan Verma", text: "Thanks for the resume tips!" },
    { senderId: profileData.handle, senderName: profileData.name, text: "You're welcome! Let me know if you need more help." },
  ],
  "Kavya Iyer": [
      { senderId: 'kavya-iyer', senderName: 'Kavya Iyer', text: "Hi Priya! I had a question about my project." },
      { senderId: profileData.handle, senderName: profileData.name, text: "Of course, ask away!" },
      { senderId: 'kavya-iyer', senderName: 'Kavya Iyer', text: "Thank you for the mentorship!" },
  ],
  "Software & Tech Innovators": [
      { senderId: 'rohan-verma', senderName: 'Rohan Verma', text: 'Has anyone worked with the new Bun APIs?' },
      { senderId: 'sunita-narayan', senderName: 'Sunita Narayan', text: 'I have! It’s incredibly fast. What are you building?' },
  ],
  "Entrepreneurship Hub": [
      { senderId: 'sunita-narayan', senderName: 'Sunita Narayan', text: 'Seed funding secured! Big things coming soon.' },
  ]
};

export type Notification = {
    type: 'connection' | 'message' | 'event' | 'job' | 'like' | 'comment';
    userName?: string; // e.g., "Rohan Verma"
    commentText?: string;
    eventTitle?: string;
    jobTitle?: string;
    companyName?: string;
    rawText?: string; // For notifications that don't fit other patterns
    time: string;
    actions?: { label: string; href: string }[];
    avatar: string;
    aiHint: string;
    contentPreview?: string;
};

export const notifications: Notification[] = [
    {
        type: 'like',
        userName: 'Rohan Verma',
        contentPreview: "Mentoring a final year student on their capstone project...",
        time: "15 minutes ago",
        avatar: "https://placehold.co/100x100.png",
        aiHint: "professional man",
        actions: [{ label: 'View Post', href: '/?postId=5' }]
    },
    {
        type: 'comment',
        userName: 'Anjali Mehta',
        commentText: "This is so inspiring! Congratulations!",
        contentPreview: "Just hit my 5-year anniversary at Google! So grateful...",
        time: "1 hour ago",
        avatar: "https://placehold.co/100x100.png",
        aiHint: "corporate woman",
        actions: [{ label: 'Reply', href: '/?postId=4' }]
    },
    {
        type: "connection",
        userName: 'Vikram Singh',
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
        userName: 'Kavya Iyer',
        time: "5 hours ago",
        actions: [{ label: 'Reply', href: '/messages' }],
        avatar: "https://placehold.co/100x100.png",
        aiHint: "female student"
    },
    {
        type: "event",
        eventTitle: 'Annual Alumni Grand Meet 2024',
        time: "1 day ago",
        actions: [{ label: 'View Event', href: '/events' }],
        avatar: "https://placehold.co/100x100.png",
        aiHint: "university logo"
    },
    {
        type: "job",
        jobTitle: "Senior Frontend Engineer",
        companyName: "Innovate Inc.",
        time: "2 days ago",
        actions: [{ label: 'View Job', href: '/jobs' }],
        avatar: "https://placehold.co/100x100.png",
        aiHint: "briefcase icon"
    },
];
