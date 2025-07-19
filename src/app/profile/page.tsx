
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Calendar, GraduationCap, MapPin, Edit, Heart, MessageCircle, Send } from "lucide-react";

const profileData = {
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

const feedItems = [
    {
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

export default function ProfilePage() {
  return (
    <div className="bg-secondary/40">
      <div className="max-w-4xl mx-auto">
        <Card className="rounded-none md:rounded-lg overflow-hidden">
          <CardHeader className="p-0">
            <div className="relative h-40 md:h-48 w-full">
              <Image
                src={profileData.banner}
                alt="Profile banner"
                layout="fill"
                objectFit="cover"
                data-ai-hint={profileData.bannerAiHint}
              />
            </div>
            <div className="relative p-6 pt-0">
                <div className="absolute -top-12 left-6">
                    <Avatar className="w-24 h-24 border-4 border-background">
                        <AvatarImage src={profileData.avatar} data-ai-hint={profileData.aiHint} />
                        <AvatarFallback>{profileData.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                </div>
                 <div className="flex justify-end pt-4">
                    <Button variant="outline"><Edit className="mr-2" /> Edit Profile</Button>
                </div>
                <div className="pt-10">
                    <CardTitle className="text-2xl font-bold font-headline">{profileData.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">@{profileData.handle}</p>
                    <p className="mt-1 text-md">{profileData.headline}</p>
                    <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> {profileData.location}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="font-semibold">{profileData.connections}</span><span className="text-muted-foreground">Connections</span>
                        <span className="font-semibold">{profileData.posts}</span><span className="text-muted-foreground">Posts</span>
                    </div>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="mt-6 space-y-6">
                 {feedItems.map((item, index) => (
                  <Card key={index}>
                    <CardHeader className="p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={item.author.avatar} data-ai-hint={item.author.aiHint} />
                          <AvatarFallback>{item.author.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{item.author.name}</p>
                          <p className="text-xs text-muted-foreground">@{item.author.handle}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="px-4 pb-3 text-sm">{item.content}</p>
                      {item.image && (
                        <div className="w-full aspect-video bg-card">
                           <img src={item.image} alt="Feed item" className="w-full h-full object-cover" data-ai-hint={item.aiHint} />
                        </div>
                      )}
                    </CardContent>
                    <CardContent className="p-4 flex flex-col items-start space-y-3">
                       <div className="flex items-center space-x-4 text-muted-foreground">
                          <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <Heart className="w-5 h-5" />
                            <span className="text-sm font-medium">{item.likes}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                             <span className="text-sm font-medium">{item.comments}</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Send className="w-5 h-5" />
                          </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{profileData.about}</p>
                  </CardContent>
                </Card>
                 <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">Experience</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profileData.experience.map(exp => (
                        <div key={exp.company} className="flex gap-4">
                            <Briefcase className="h-8 w-8 text-muted-foreground mt-1"/>
                            <div>
                                <p className="font-semibold">{exp.role}</p>
                                <p className="text-sm text-muted-foreground">{exp.company}</p>
                                <p className="text-xs text-muted-foreground">{exp.duration}</p>
                            </div>
                        </div>
                    ))}
                  </CardContent>
                </Card>
                 <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">Education</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex gap-4">
                        <GraduationCap className="h-8 w-8 text-muted-foreground mt-1"/>
                        <div>
                            <p className="font-semibold">{profileData.education.college}</p>
                            <p className="text-sm text-muted-foreground">{profileData.education.degree}</p>
                            <p className="text-xs text-muted-foreground">{profileData.education.duration}</p>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
