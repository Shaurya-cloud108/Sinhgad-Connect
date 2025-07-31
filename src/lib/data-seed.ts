
// This file contains the initial seed data for the application.
// It is used by the `seed-db.ts` script and should not be imported
// directly into the application code after the initial seeding.

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
  
  export const initialGroupsData: Group[] = [
    {
      id: "comp-eng-alumni",
      name: "Computer Engineering Alumni",
      summary: "Connect and share opportunities with past and present Computer Engineering students.",
      about: "This is the official space for all past and present students of the Computer Engineering department. Our goal is to foster a strong community where members can connect, share professional opportunities, ask for advice, and organize tech-related events. All members are encouraged to participate actively and respectfully.",
      banner: "https://placehold.co/600x400.png",
      aiHint: "circuit board",
      members: [
          { handle: "priya-sharma", role: 'admin' },
          { handle: "sunita-narayan", role: 'moderator' },
          { handle: "sneha-reddy", role: 'member' },
          { handle: "arjun-desai", role: 'member' },
      ],
      type: 'public',
      tags: ["#hiring", "#mentorship", "#tech-talks"],
      links: [
          { label: "Department Page", url: "#" },
          { label: "Join our Slack", url: "#" }
      ]
    },
    {
      id: "batch-of-2015",
      name: "Batch of 2015 Reunion",
      summary: "Planning and discussions for the 10-year reunion for the class of 2015.",
      about: "Welcome, class of 2015! This group is dedicated to planning our 10-year reunion. We'll post updates on dates, venues, and ticketing here. Please share your ideas and old photos to get the nostalgia flowing! All departments are welcome.",
      banner: "https://placehold.co/600x400.png",
      aiHint: "graduation celebration",
      members: [
          { handle: "anjali-mehta", role: 'admin' },
      ],
      type: 'private',
      tags: ["#reunion", "#events", "#nostalgia"],
    },
    {
      id: "bay-area-alumni",
      name: "Bay Area Alumni Chapter",
      summary: "Connect with fellow Sinhgad alumni living and working in the San Francisco Bay Area.",
      about: "A hub for Sinhgad alumni in the SF Bay Area to network, organize professional and social meetups, and support each other in our careers. Whether you're new to the area or a long-time resident, you're welcome here.",
      banner: "https://placehold.co/600x400.png",
      aiHint: "golden gate bridge",
      members: [
          { handle: "priya-sharma", role: 'admin' },
      ],
      type: 'public',
      tags: ["#networking", "#bay-area", "#meetups"],
    },
    {
      id: "entrepreneur-club",
      name: "Sinhgad Entrepreneur's Club",
      summary: "A group for aspiring and established entrepreneurs to share ideas and find co-founders.",
      about: "This is a community for the entrepreneurs of Sinhgad. Share your startup ideas, seek advice on funding and strategy, find potential co-founders, and discuss the challenges and triumphs of building a business. Let's innovate together!",
      banner: "https://placehold.co/600x400.png",
      aiHint: "lightbulb idea",
      members: [
          { handle: "sunita-narayan", role: 'admin' },
          { handle: "priya-sharma", role: 'member' },
          { handle: "rohan-verma", role: 'member' },
      ],
      type: 'public',
      tags: ["#startup", "#funding", "#innovation"],
    },
     {
      id: "photography-enthusiasts",
      name: "Photography Enthusiasts",
      summary: "A casual group for alumni and students who love photography.",
      about: "If you have a passion for photography, this is the place for you! Share your work, discuss techniques and gear, and help organize casual photo walks around the city. Amateurs and professionals are all welcome.",
      banner: "https://placehold.co/600x400.png",
      aiHint: "camera lens",
      members: [
          { handle: "kavya-iyer", role: 'admin' },
      ],
      type: 'public',
      tags: ["#hobby", "#photography", "#art"],
    },
    {
      id: "job-seekers-2024",
      name: "Job Seekers - Class of 2024",
      summary: "Support group for the graduating class of 2024 to share job leads and interview tips.",
      about: "This is a private support group for the graduating class of 2024. Let's help each other land our first jobs by sharing job postings, interview experiences, resume tips, and referral requests. Let's get hired!",
      banner: "https://placehold.co/600x400.png",
      aiHint: "job interview",
      members: [
          { handle: "alumni-network", role: 'admin' },
          { handle: "kavya-iyer", role: 'member' },
      ],
      type: 'private',
      tags: ["#jobs", "#career-advice", "#referrals"],
    },
  ];
  
  
  export type Event = {
    id: string;
    title: string;
    date: string;
    location: string;
    description: string;
    image: string;
    aiHint: string;
  };
  
  export const initialEventsData: Event[] = [
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
  
  export const initialJobListings: JobListing[] = [
    {
      id: "1",
      title: "Senior Frontend Engineer",
      company: "Innovate Inc.",
      location: "Remote",
      type: "Full-time",
      tags: ["React", "TypeScript", "Next.js"],
      postedBy: "Sunita Narayan '09",
      postedByHandle: "sunita-narayan",
      description: "Innovate Inc. is seeking a passionate Senior Frontend Engineer to build and scale our next-generation sustainable tech products. You will work with a modern tech stack and a talented team to create beautiful, responsive, and high-performance web applications.",
      applicationUrl: "https://careers.example.com/job/123",
    },
    {
      id: "2",
      title: "Data Scientist",
      company: "DataDriven Co.",
      location: "Pune",
      type: "Full-time",
      tags: ["Python", "Machine Learning", "SQL"],
      postedBy: "Rohan Verma '12",
      postedByHandle: "rohan-verma",
      description: "Join DataDriven Co. and help us solve complex problems with data. As a Data Scientist, you will be responsible for designing and implementing machine learning models, performing statistical analysis, and communicating insights to stakeholders.",
      applicationUrl: "https://careers.example.com/job/124",
    },
    {
      id: "3",
      title: "Product Manager",
      company: "Connectify",
      location: "Bangalore",
      type: "Full-time",
      tags: ["Agile", "Roadmap", "UX"],
      postedBy: "Anjali Mehta '15",
      postedByHandle: "anjali-mehta",
      description: "Connectify is looking for a user-centric Product Manager to lead our product strategy and roadmap. You will work closely with engineering, design, and marketing to deliver products that our users love."
    },
    {
      id: "4",
      title: "UX/UI Designer",
      company: "Creative Solutions",
      location: "Remote",
      type: "Contract",
      tags: ["Figma", "User Research", "Prototyping"],
      postedBy: "Alumni Network",
      postedByHandle: "alumni-network",
      description: "We are looking for a talented UX/UI Designer to create amazing user experiences. The ideal candidate will have a strong portfolio of design projects and be proficient in Figma, user research, and prototyping.",
      applicationUrl: "https://careers.example.com/job/125",
    },
    {
      id: "5",
      title: "DevOps Engineer",
      company: "CloudLeap",
      location: "Hyderabad",
      type: "Full-time",
      tags: ["AWS", "Kubernetes", "CI/CD"],
      postedBy: "Vikram Singh '08",
      postedByHandle: "vikram-singh",
      description: "CloudLeap is hiring a DevOps Engineer to manage and improve our cloud infrastructure. You will be responsible for our CI/CD pipelines, automation, and ensuring the reliability and scalability of our systems."
    },
    {
      id: "6",
      title: "Marketing Intern",
      company: "GrowthX",
      location: "Mumbai",
      type: "Internship",
      tags: ["Social Media", "SEO"],
      postedBy: "Alumni Network",
      postedByHandle: "alumni-network",
      description: "Gain hands-on experience in digital marketing with GrowthX! This internship will give you exposure to social media marketing, SEO, content creation, and campaign analysis. A great opportunity for aspiring marketers.",
      applicationUrl: "https://careers.example.com/job/126",
    },
  ];
  
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
  
  export const initialSuccessStories: SuccessStory[] = [
    {
      id: "sunita-narayan",
      name: "Sunita Narayan",
      class: "2009",
      role: "CEO, Innovate Inc.",
      image: "https://placehold.co/400x400.png",
      aiHint: "professional woman portrait",
      story: "Sunita Narayan, a 2009 Computer Engineering graduate, is the trailblazing CEO of Innovate Inc. After starting her career at a major tech firm, she identified a gap in the market for sustainable technology solutions. She founded Innovate Inc. with a small team, focusing on creating eco-friendly consumer electronics. Under her leadership, the company developed a breakthrough biodegradable material for device casings. Her vision and relentless drive led Innovate Inc. through multiple funding rounds and ultimately to a successful IPO, establishing her as a leading voice in green technology and an inspiration for aspiring entrepreneurs.",
      tags: ["Leadership", "Technology", "Entrepreneurship"],
      insights: {
          summary: "Sunita Narayan's journey is a testament to the power of combining technical expertise with a strong vision. From her beginnings as a software engineer, she identified a niche market for sustainable technology and courageously built a company from the ground up. Her success with Innovate Inc., marked by a successful IPO, showcases her exceptional leadership and entrepreneurial spirit, proving that purpose-driven innovation can lead to both commercial success and a positive global impact.",
          keyTakeaways: [
              "Identify and pursue niche market gaps.",
              "Combine technical skills with a larger, purpose-driven vision.",
              "Strong leadership is crucial for navigating funding and growth.",
              "Perseverance in the face of challenges leads to breakthroughs."
          ],
          careerAdvice: "For alumni inspired by Sunita's path, focus on developing not just your technical skills but also your business acumen. Look for problems in the world that you are passionate about solving. Don't be afraid to start small and build a strong, dedicated team around your vision. Leverage the alumni community to find mentors and potential partners. Cultivate resilience; the entrepreneurial journey is filled with ups and downs, but a clear purpose will guide you through."
      }
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
      insights: {
          summary: "Dr. Rohan Gupta's career is a powerful example of applying engineering principles to solve critical healthcare challenges. By specializing in biomedical engineering and AI, he positioned himself at the forefront of medical innovation. His work at CureAI resulted in a life-saving AI diagnostic tool, demonstrating a profound impact on patient care. His success underscores the importance of interdisciplinary knowledge and a commitment to research and development.",
          keyTakeaways: [
              "Specialized, interdisciplinary knowledge can lead to groundbreaking innovations.",
              "Long-term dedication to research can yield world-changing results.",
              "Technology has the potential to dramatically improve healthcare outcomes.",
              "Publishing and sharing research is vital for global impact."
          ],
          careerAdvice: "Alumni interested in a similar path should consider pursuing advanced degrees (Master's or PhD) in a specialized, high-impact field. Focus on building a strong foundation in both your core engineering discipline and a complementary area like AI, biology, or data science. Seek opportunities in research-oriented organizations, whether in academia or the private sector. Patience and persistence are your greatest assets in a research career."
      }
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
      insights: {
          summary: "Meera Desai's career demonstrates a beautiful blend of civil engineering and a passion for sustainable design. After gaining valuable experience in established firms, she took the entrepreneurial leap to start her own practice. Her 'Green Tower' project is a landmark achievement that showcases her ability to integrate eco-friendly solutions into large-scale urban architecture, earning her international acclaim and establishing her as a leader in her field.",
          keyTakeaways: [
              "Gain industry experience before starting your own venture.",
              "Develop a strong, unique design philosophy (e.g., sustainability).",
              "Winning a high-profile project can define a career.",
              "Passion for a cause can drive innovation and recognition."
          ],
          careerAdvice: "For those in civil engineering and architecture, build a strong portfolio that showcases your unique style and values. Don't be afraid to champion a cause, like sustainability, in your work. Seek mentors who have successfully run their own firms. The first few years may be challenging, but establishing a strong reputation through smaller projects can lead to larger, more impactful opportunities. Continuous learning about new materials and technologies is essential."
      }
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
      insights: {
          summary: "Karan Malhotra's story is a prime example of using technology for social good. As a recent IT graduate, he identified a critical societal problem and applied his skills to create a solution. His startup, 'BharatFinance,' demonstrates a keen understanding of user needs in underserved markets. Being named to the Forbes 30 Under 30 list highlights the immense value of creating a business that is not only profitable but also has a deep, positive social impact.",
          keyTakeaways: [
              "Use your technical skills to solve real-world social problems.",
              "Focus on user-centric design, especially for non-traditional users.",
              "A strong social mission can attract recognition and investment.",
              "You don't need decades of experience to make a significant impact."
          ],
          careerAdvice: "If you're a recent graduate with a big idea, don't wait! Identify a problem you care about and start building a solution. Focus on creating a Minimum Viable Product (MVP) to test your assumptions. Leverage your college network and startup incubators for support and funding. A business with a strong social mission can be incredibly fulfilling and successful. Develop empathy for your target users to build products that truly serve their needs."
      }
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
      id: string; // Changed to string for Firestore
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
      likedBy: string[]; // Changed from liked and likes
      comments: Comment[];
      groupId?: string;
      createdAt: any; // For Firestore timestamp
  }

  export const initialFeedItemsData: Omit<FeedItem, 'id' | 'createdAt'>[] = [
    {
        author: {
            name: "Sunita Narayan",
            avatar: "https://placehold.co/100x100.png",
            handle: "sunita-narayan",
            aiHint: "professional woman portrait"
        },
        content: "Thrilled to announce that Innovate Inc. has secured Series B funding! A huge thank you to our amazing team and investors. We're excited to accelerate our mission of creating sustainable technology for everyone. #innovation #greentech",
        image: "https://placehold.co/600x400.png",
        aiHint: "team celebration",
        location: "Remote",
        likes: 152,
        likedBy: ["priya-sharma", "rohan-verma", "anjali-mehta"],
        comments: [
            { id: 1, author: { name: "Priya Sharma", avatar: "https://placehold.co/100x100.png", handle: "priya-sharma" }, text: "This is fantastic news, Sunita! Congratulations!" },
            { id: 2, author: { name: "Rohan Verma", avatar: "https://placehold.co/100x100.png", handle: "rohan-verma" }, text: "So well deserved. Inspiring work!" }
        ]
    },
    {
        author: {
            name: "Anjali Mehta",
            avatar: "https://placehold.co/100x100.png",
            handle: "anjali-mehta",
            aiHint: "corporate woman"
        },
        content: "Just hit my 5-year anniversary at Verizon! So grateful for the journey and the incredible people I get to work with. Time flies when you're building the future of communication.",
        image: null,
        likes: 78,
        likedBy: [],
        comments: [],
        groupId: "batch-of-2015"
    },
    {
        author: {
            name: "Rohan Verma",
            avatar: "https://placehold.co/100x100.png",
            handle: "rohan-verma",
            aiHint: "professional man"
        },
        content: "Had a great time speaking to the final year Mechanical Engineering students at Sinhgad last week. The future is bright! Thanks to the college for inviting me.",
        image: "https://placehold.co/600x400.png",
        aiHint: "lecture hall",
        location: "Pune, India",
        likes: 95,
        likedBy: ["priya-sharma"],
        comments: [
             { id: 1, author: { name: "Kavya Iyer", avatar: "https://placehold.co/100x100.png", handle: "kavya-iyer" }, text: "It was a great session, sir! Very informative." }
        ]
    },
    {
        author: {
            name: "Priya Sharma",
            avatar: "https://placehold.co/150x150.png",
            handle: "priya-sharma",
            aiHint: "professional woman"
        },
        content: "Mentoring a final year student on their capstone project has been such a rewarding experience. It's amazing to see the innovative ideas coming from the next generation of engineers. #mentorship #givingback",
        image: null,
        likes: 120,
        likedBy: [],
        comments: []
    },
    {
        author: {
            name: "Kavya Iyer",
            avatar: "https://placehold.co/100x100.png",
            handle: "kavya-iyer",
            aiHint: "female student"
        },
        content: "I'm looking for an internship in AI/ML for the upcoming summer. If anyone has any leads or advice, please let me know! My resume is on my profile. #internship #ai #machinelearning",
        image: null,
        likes: 45,
        likedBy: [],
        comments: [
            { id: 1, author: { name: "Priya Sharma", avatar: "https://placehold.co/150x150.png", handle: "priya-sharma" }, text: "Sent you a DM, Kavya!" }
        ],
        groupId: "job-seekers-2024"
    },
    {
        author: {
            name: "Sunita Narayan",
            avatar: "https://placehold.co/100x100.png",
            handle: "sunita-narayan",
            aiHint: "professional woman portrait"
        },
        content: "We're hiring for multiple roles at Innovate Inc.! Looking for passionate engineers and designers who want to make a difference. Check out the job portal for more details. #hiring #techjobs",
        image: null,
        likes: 88,
        likedBy: ["priya-sharma"],
        comments: [],
        groupId: "comp-eng-alumni",
    }
  ];
  
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
  
  export const initialCommunityMembers: CommunityMember[] = [
    {
      name: "Priya Sharma",
      avatar: "https://placehold.co/150x150.png",
      fallback: "PS",
      handle: "priya-sharma",
      headline: "Senior Software Engineer at Google | Mentor",
      location: "San Francisco Bay Area",
      followers: ["rohan-verma", "anjali-mehta", "vikram-singh", "sneha-reddy"],
      following: ["rohan-verma", "anjali-mehta", "kavya-iyer", "sunita-narayan"],
      aiHint: "professional woman",
      banner: "https://placehold.co/1000x300.png",
      bannerAiHint: "university campus",
      about: "Passionate about building scalable systems and helping the next generation of engineers. Graduated in 2009 with a degree in Computer Engineering. Feel free to reach out for advice on careers in tech, interview prep, or anything else!",
      experience: [
          { role: "Senior Software Engineer", company: "Google", duration: "2015 - Present" },
          { role: "Software Engineer", company: "Innovate Inc.", duration: "2012 - 2015" },
      ],
      education: [
          { degree: "B.E. Computer Engineering", college: "Sinhgad College of Engineering", yearRange: "2005 - 2009", graduationYear: 2009, graduationMonth: 6 },
          { degree: "M.S. Computer Science", college: "Stanford University", yearRange: "2010 - 2012" },
      ],
      socials: { linkedin: "https://www.linkedin.com/in/priya-sharma-example/", github: "https://github.com/priyasharma-example" },
      contact: { email: "priya.sharma@example.com", website: "https://priya-sharma.dev" },
      graduationYear: 2009,
      graduationMonth: 6,
      field: "Computer Engineering",
      industry: "Technology",
      company: "Google",
      groups: ["comp-eng-alumni", "bay-area-alumni", "entrepreneur-club"],
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
      followers: ["priya-sharma", "anjali-mehta"],
      following: ["priya-sharma", "kavya-iyer", "sunita-narayan"],
      aiHint: "professional man",
      handle: "rohan-verma",
      banner: "https://placehold.co/1000x300.png",
      bannerAiHint: "modern factory",
      headline: "Mechanical Engineer at Tesla",
      about: "Working on the future of transportation. Sinhgad Mechanical Engg. '12. Fascinated by robotics and sustainable energy.",
      experience: [{ role: "Mechanical Engineer", company: "Tesla", duration: "2018 - Present" }],
      education: [{ degree: "B.E. Mechanical Engineering", college: "Sinhgad College of Engineering", yearRange: "2008 - 2012", graduationYear: 2012, graduationMonth: 6 }],
      socials: { linkedin: "https://www.linkedin.com/", github: "https://github.com/"},
      contact: { email: "rohan.verma@example.com" },
      groups: ["entrepreneur-club"],
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
      followers: ["priya-sharma", "rohan-verma", "sunita-narayan"],
      following: ["priya-sharma"],
      aiHint: "corporate woman",
      handle: "anjali-mehta",
      banner: "https://placehold.co/1000x300.png",
      bannerAiHint: "city skyline",
      headline: "Network Architect at Verizon",
      about: "Designing the communication networks of tomorrow. Proud alumna of Sinhgad E&TC batch of 2015.",
      experience: [{ role: "Network Architect", company: "Verizon", duration: "2019 - Present" }],
      education: [{ degree: "B.E. Electronics & Telecommunication", college: "Sinhgad College of Engineering", yearRange: "2011 - 2015", graduationYear: 2015, graduationMonth: 6 }],
      socials: { linkedin: "https://www.linkedin.com/", github: "https://github.com/"},
      contact: { email: "anjali.mehta@example.com" },
      groups: ["batch-of-2015"],
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
      followers: ["priya-sharma", "rohan-verma"],
      following: ["priya-sharma"],
      aiHint: "female student",
      handle: "kavya-iyer",
      banner: "https://placehold.co/1000x300.png",
      bannerAiHint: "library books",
      headline: "IT Student | Aspiring AI Engineer",
      about: "Currently in my third year of IT engineering. Passionate about machine learning and looking for internship opportunities!",
      experience: [],
      education: [{ degree: "B.E. Information Technology", college: "Sinhgad College of Engineering", yearRange: "2021 - 2025", graduationYear: 2025, graduationMonth: 6 }],
      socials: { linkedin: "https://www.linkedin.com/", github: "https://github.com/"},
      contact: { email: "kavya.iyer@example.com" },
      groups: ["job-seekers-2024", "photography-enthusiasts"],
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
      followers: ["sunita-narayan"],
      following: ["priya-sharma", "sunita-narayan"],
      aiHint: "corporate man",
      handle: "vikram-singh",
      banner: "https://placehold.co/1000x300.png",
      bannerAiHint: "stock market graph",
      headline: "VP of Technology at Goldman Sachs",
      about: "Leading technology initiatives in the financial sector. Sinhgad IT '08.",
      experience: [{ role: "VP of Technology", company: "Goldman Sachs", duration: "2016 - Present" }],
      education: [{ degree: "B.E. Information Technology", college: "Sinhgad College of Engineering", yearRange: "2004 - 2008", graduationYear: 2008, graduationMonth: 6 }],
      socials: { linkedin: "https://www.linkedin.com/", github: "https://github.com/"},
      contact: { email: "vikram.singh@example.com" },
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
      followers: [],
      following: ["priya-sharma"],
      aiHint: "young professional",
      handle: "sneha-reddy",
      banner: "https://placehold.co/1000x300.png",
      bannerAiHint: "server room",
      headline: "Cloud Support Engineer at AWS",
      about: "Helping customers succeed on the cloud. Comp Engg '18.",
      experience: [{ role: "Cloud Support Engineer", company: "Amazon", duration: "2019 - Present" }],
      education: [{ degree: "B.E. Computer Engineering", college: "Sinhgad College of Engineering", yearRange: "2014 - 2018", graduationYear: 2018, graduationMonth: 6 }],
      socials: { linkedin: "https://www.linkedin.com/", github: "https://github.com/"},
      contact: { email: "sneha.reddy@example.com" },
      groups: ["comp-eng-alumni"],
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
      followers: [],
      following: [],
      aiHint: "male student",
      handle: "arjun-desai",
      banner: "https://placehold.co/1000x300.png",
      bannerAiHint: "code on screen",
      headline: "Computer Engineering Student",
      about: "Second year student exploring the world of software development.",
      experience: [],
      education: [{ degree: "B.E. Computer Engineering", college: "Sinhgad College of Engineering", yearRange: "2022 - 2026", graduationYear: 2026, graduationMonth: 6 }],
      socials: { linkedin: "https://www.linkedin.com/", github: "https://github.com/"},
      contact: { email: "arjun.desai@example.com" },
      groups: ["comp-eng-alumni"],
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
      followers: [],
      following: [],
      aiHint: "engineer man",
      handle: "amit-patel",
      banner: "https://placehold.co/1000x300.png",
      bannerAiHint: "construction site",
      headline: "Project Manager at L&T Construction",
      about: "Building the infrastructure of India. Civil '13.",
      experience: [{ role: "Project Manager", company: "L&T Construction", duration: "2015 - Present" }],
      education: [{ degree: "B.E. Civil Engineering", college: "Sinhgad College of Engineering", yearRange: "2009 - 2013", graduationYear: 2013, graduationMonth: 6 }],
      socials: { linkedin: "https://www.linkedin.com/", github: "https://github.com/"},
      contact: { email: "amit.patel@example.com" },
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
      followers: ["priya-sharma", "rohan-verma", "anjali-mehta", "vikram-singh"],
      following: ["vikram-singh"],
      aiHint: "professional woman portrait",
      handle: "sunita-narayan",
      banner: "https://placehold.co/1000x300.png",
      bannerAiHint: "modern office building",
      headline: "CEO at Innovate Inc.",
      about: "Founder of Innovate Inc., focused on sustainable technology. Comp Engg '09.",
      experience: [{ role: "CEO", company: "Innovate Inc.", duration: "2014 - Present" }],
      education: [{ degree: "B.E. Computer Engineering", college: "Sinhgad College of Engineering", yearRange: "2005 - 2009", graduationYear: 2009, graduationMonth: 6 }],
      socials: { linkedin: "https://www.linkedin.com/", github: "https://github.com/"},
      contact: { email: "sunita.narayan@example.com" },
      groups: ["comp-eng-alumni", "entrepreneur-club"],
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
      followers: [],
      following: [],
      aiHint: "university logo",
      handle: "alumni-events",
      banner: "https://placehold.co/1000x300.png",
      bannerAiHint: "event stage",
      headline: "Official Events Organizer",
      about: "We organize events to keep our alumni connected.",
      experience: [],
      education: [],
      socials: { linkedin: "", github: ""},
      contact: { email: "" },
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
      followers: [],
      following: [],
      aiHint: "briefcase icon",
      handle: "alumni-network",
      banner: "https://placehold.co/1000x300.png",
      bannerAiHint: "office lobby",
      headline: "Curated Job Opportunities",
      about: "Connecting talented alumni with great career opportunities.",
      experience: [],
      education: [],
      socials: { linkedin: "", github: ""},
      contact: { email: "" },
    },
  ];
  
  export const initialStoriesData: Story[] = initialCommunityMembers.map((member, index) => ({
      id: index + 1,
      author: {
          name: member.name,
          avatar: member.avatar,
          handle: member.handle,
          aiHint: member.aiHint,
      },
      items: [],
      viewers: [],
  }));
  
  // Add a demo story item for Rohan Verma
  const rohanVermaStory = initialStoriesData.find(s => s.author.handle === 'rohan-verma');
  if (rohanVermaStory) {
      rohanVermaStory.items.push({
          id: Date.now(),
          url: 'https://placehold.co/400x700.png',
          type: 'image',
          timestamp: Date.now() - 12 * 60 * 60 * 1000, // 12 hours ago
      });
      rohanVermaStory.viewers = [
          { name: "Priya Sharma", avatar: "https://placehold.co/100x100.png" },
          { name: "Anjali Mehta", avatar: "https://placehold.co/100x100.png" },
      ];
  }
  
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
  
  export const initialConversations: Conversation[] = [
      { name: 'Rohan Verma', avatar: 'https://placehold.co/100x100.png', aiHint: 'professional man', lastMessage: 'You\'re welcome! Let me know if you need more help.', time: '2h', unread: 0, isGroup: false },
      { name: 'Kavya Iyer', avatar: 'https://placehold.co/100x100.png', aiHint: 'female student', lastMessage: 'Thank you for the mentorship!', time: '1d', unread: 2, isGroup: false },
  ];
  
  export const initialMessages: MessagesData = {
    "Rohan Verma": [
      { senderId: "rohan-verma", senderName: "Rohan Verma", text: "Thanks for the resume tips!" },
      { senderId: "priya-sharma", senderName: "Priya Sharma", text: "You're welcome! Let me know if you need more help." },
    ],
    "Kavya Iyer": [
        { senderId: 'kavya-iyer', senderName: 'Kavya Iyer', text: "Hi Priya! I had a question about my project." },
        { senderId: "priya-sharma", senderName: "Priya Sharma", text: "Of course, ask away!" },
        { senderId: 'kavya-iyer', senderName: 'Kavya Iyer', text: "Thank you for the mentorship!" },
    ],
  };
  
  export type Notification = {
      id: string;
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
  
  export const initialNotificationsData: Notification[] = [
      {
          id: '1',
          type: 'like',
          userName: 'Rohan Verma',
          contentPreview: "Mentoring a final year student on their capstone project...",
          time: "15 minutes ago",
          avatar: "https://placehold.co/100x100.png",
          aiHint: "professional man",
          actions: [{ label: 'View Post', href: '/?postId=5' }]
      },
      {
          id: '2',
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
          id: '3',
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
          id: '4',
          type: "message",
          userName: 'Kavya Iyer',
          time: "5 hours ago",
          actions: [{ label: 'Reply', href: '/messages' }],
          avatar: "https://placehold.co/100x100.png",
          aiHint: "female student"
      },
      {
          id: '5',
          type: "event",
          eventTitle: 'Annual Alumni Grand Meet 2024',
          time: "1 day ago",
          actions: [{ label: 'View Event', href: '/events' }],
          avatar: "https://placehold.co/100x100.png",
          aiHint: "university logo"
      },
      {
          id: '6',
          type: "job",
          jobTitle: "Senior Frontend Engineer",
          companyName: "Innovate Inc.",
          time: "2 days ago",
          actions: [{ label: 'View Job', href: '/jobs' }],
          avatar: "https://placehold.co/100x100.png",
          aiHint: "briefcase icon"
      },
  ];
