

export type JobListing = {
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
    title: "Senior Frontend Engineer",
    company: "Innovate Inc.",
    location: "Remote",
    type: "Full-time",
    tags: ["React", "TypeScript", "Next.js"],
    postedBy: "Sunita Narayan '09",
    description: "Innovate Inc. is seeking a passionate Senior Frontend Engineer to build and scale our next-generation sustainable tech products. You will work with a modern tech stack and a talented team to create beautiful, responsive, and high-performance web applications."
  },
  {
    title: "Data Scientist",
    company: "DataDriven Co.",
    location: "Pune, India",
    type: "Full-time",
    tags: ["Python", "Machine Learning", "SQL"],
    postedBy: "Rajesh Kumar '11",
    description: "Join DataDriven Co. and help us solve complex problems with data. As a Data Scientist, you will be responsible for designing and implementing machine learning models, performing statistical analysis, and communicating insights to stakeholders."
  },
  {
    title: "Product Manager",
    company: "Connectify",
    location: "Bangalore, India",
    type: "Full-time",
    tags: ["Agile", "Roadmap", "UX"],
    postedBy: "Ananya Deshpande '14",
    description: "Connectify is looking for a user-centric Product Manager to lead our product strategy and roadmap. You will work closely with engineering, design, and marketing to deliver products that our users love."
  },
  {
    title: "UX/UI Designer",
    company: "Creative Solutions",
    location: "Remote",
    type: "Contract",
    tags: ["Figma", "User Research", "Prototyping"],
    postedBy: "Alumni Network",
    description: "We are looking for a talented UX/UI Designer to create amazing user experiences. The ideal candidate will have a strong portfolio of design projects and be proficient in Figma, user research, and prototyping."
  },
  {
    title: "DevOps Engineer",
    company: "CloudLeap",
    location: "Hyderabad, India",
    type: "Full-time",
    tags: ["AWS", "Kubernetes", "CI/CD"],
    postedBy: "Amit Singh '15",
    description: "CloudLeap is hiring a DevOps Engineer to manage and improve our cloud infrastructure. You will be responsible for our CI/CD pipelines, automation, and ensuring the reliability and scalability of our systems."
  },
  {
    title: "Marketing Intern",
    company: "GrowthX",
    location: "Mumbai, India",
    type: "Internship",
    tags: ["Social Media", "SEO"],
    postedBy: "Alumni Network",
    description: "Gain hands-on experience in digital marketing with GrowthX! This internship will give you exposure to social media marketing, SEO, content creation, and campaign analysis. A great opportunity for aspiring marketers."
  },
];

export type Story = {
  name: string;
  avatar: string;
  image: string;
  isOwn?: boolean;
  aiHint: string;
}

export const stories: Story[] = [
  { name: "Your Story", avatar: "https://placehold.co/100x100.png", image: "", isOwn: true, aiHint: "plus icon" },
  { name: "Priya S.", avatar: "https://placehold.co/100x100.png", image: "https://placehold.co/400x700.png", aiHint: "professional woman" },
  { name: "Rohan V.", avatar: "https://placehold.co/100x100.png", image: "https://placehold.co/400x700.png", aiHint: "professional man" },
  { name: "Anjali M.", avatar: "https://placehold.co/100x100.png", image: "https://placehold.co/400x700.png", aiHint: "corporate woman" },
  { name: "Vikram S.", avatar: "https://placehold.co/100x100.png", image: "https://placehold.co/400x700.png", aiHint: "corporate man" },
  { name: "Sneha R.", avatar: "https://placehold.co/100x100.png", image: "https://placehold.co/400x700.png", aiHint: "young professional" },
];

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
    comments: number;
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
    comments: 32,
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
    comments: 15,
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
    comments: 7,
  },
  {
    id: 4,
    author: {
      name: "Priya Sharma",
      avatar: "https://placehold.co/100x100.png",
      handle: "priya-sharma-09",
      aiHint: "professional woman"
    },
    content: "Just hit my 5-year anniversary at Google! So grateful for the journey and the amazing people I've worked with. The lessons I learned at Sinhgad continue to be my foundation.",
    image: null,
    aiHint: "",
    likes: 152,
    comments: 18,
  },
  {
    id: 5,
    author: {
      name: "Priya Sharma",
      avatar: "https://placehold.co/100x100.png",
      handle: "priya-sharma-09",
      aiHint: "professional woman"
    },
    content: "Mentoring a final year student on their capstone project has been such a rewarding experience. It's amazing to see the talent coming out of our college!",
    image: "https://placehold.co/600x400.png",
    aiHint: "mentoring session",
    likes: 98,
    comments: 7,
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
    duration: string;
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
    duration: "2005 - 2009",
  },
};

export const alumniData = [
  {
    name: "Priya Sharma",
    avatar: "https://placehold.co/100x100.png",
    fallback: "PS",
    graduationYear: 2010,
    field: "Computer Engineering",
    industry: "Technology",
    company: "Google",
    location: "San Francisco, CA",
    aiHint: "professional woman"
  },
  {
    name: "Rohan Verma",
    avatar: "https://placehold.co/100x100.png",
    fallback: "RV",
    graduationYear: 2012,
    field: "Mechanical Engineering",
    industry: "Automotive",
    company: "Tesla",
    location: "Austin, TX",
    aiHint: "professional man"
  },
  {
    name: "Anjali Mehta",
    avatar: "https://placehold.co/100x100.png",
    fallback: "AM",
    graduationYear: 2015,
    field: "Electronics & Telecommunication",
    industry: "Telecommunications",
    company: "Verizon",
    location: "New York, NY",
    aiHint: "corporate woman"
  },
  {
    name: "Vikram Singh",
    avatar: "https://placehold.co/100x100.png",
    fallback: "VS",
    graduationYear: 2008,
    field: "Information Technology",
    industry: "Finance",
    company: "Goldman Sachs",
    location: "London, UK",
    aiHint: "corporate man"
  },
  {
    name: "Sneha Reddy",
    avatar: "https://placehold.co/100x100.png",
    fallback: "SR",
    graduationYear: 2018,
    field: "Computer Engineering",
    industry: "E-commerce",
    company: "Amazon",
    location: "Seattle, WA",
    aiHint: "young professional"
  },
  {
    name: "Amit Patel",
    avatar: "https://placehold.co/100x100.png",
    fallback: "AP",
    graduationYear: 2013,
    field: "Civil Engineering",
    industry: "Construction",
    company: "L&T Construction",
    location: "Mumbai, India",
    aiHint: "engineer man"
  },
];
