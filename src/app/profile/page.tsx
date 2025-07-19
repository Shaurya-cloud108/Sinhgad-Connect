
"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Calendar, GraduationCap, MapPin, Edit, Heart, MessageCircle, Send, LogOut } from "lucide-react";
import { profileData as initialProfileData, feedItems as initialFeedItems, ProfileData, FeedItem } from "@/lib/data";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";


const profileFormSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  headline: z.string().min(5, "Headline is too short"),
  location: z.string().min(2, "Location is too short"),
  about: z.string().min(10, "About section is too short"),
});


function EditProfileDialog({ open, onOpenChange, profile, onProfileUpdate }: { open: boolean, onOpenChange: (open: boolean) => void, profile: ProfileData, onProfileUpdate: (data: ProfileData) => void }) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile.name,
      headline: profile.headline,
      location: profile.location,
      about: profile.about,
    },
  });

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    const updatedProfile = { ...profile, ...values };
    onProfileUpdate(updatedProfile);
    toast({
      title: "Profile Updated",
      description: "Your information has been saved successfully.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="headline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Headline</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About / Bio</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


export default function ProfilePage() {
    const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const router = useRouter();
    
    const handleProfileUpdate = (updatedData: ProfileData) => {
        setProfileData(updatedData);
    };

    const handleLogout = () => {
        router.push("/register");
    }

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
                 <div className="flex justify-end pt-4 gap-2">
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}><Edit className="mr-2" /> Edit Profile</Button>
                    <Button variant="outline" onClick={handleLogout}><LogOut className="mr-2" /> Logout</Button>
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
                 {initialFeedItems.filter(item => item.author.handle === profileData.handle).map((item, index) => (
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
      <EditProfileDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} profile={profileData} onProfileUpdate={handleProfileUpdate} />
    </div>
  );
}
