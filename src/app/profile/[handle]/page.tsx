
"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, GraduationCap, MapPin, Edit, Heart, MessageCircle, Send, LogOut, MoreHorizontal, Trash2, Upload, Users, ArrowLeft, Share2 } from "lucide-react";
import { feedItems as initialFeedItems, ProfileData, FeedItem, communityMembers } from "@/lib/data.tsx";
import { useState, useContext, useEffect } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Form,
  FormControl,
  FormDescription as FormDescriptionComponent,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileContext } from "@/context/ProfileContext";
import { AppContext } from "@/context/AppContext";
import { getStatusEmoji, cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ShareDialog } from "@/components/share-dialog";


const profileFormSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  handle: z.string()
    .min(3, "Handle must be at least 3 characters")
    .regex(/^[a-z0-9-._]+$/, "Handle can only contain lowercase letters, numbers, hyphens, dots and underscores."),
  headline: z.string().min(5, "Headline is too short"),
  location: z.string().min(2, "Location is too short"),
  about: z.string().min(10, "About section is too short"),
});


function EditProfileDialog({ open, onOpenChange, profile, onProfileUpdate }: { open: boolean, onOpenChange: (open: boolean) => void, profile: ProfileData, onProfileUpdate: (data: Partial<ProfileData>) => void }) {
  const { toast } = useToast();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar);
  const [bannerPreview, setBannerPreview] = useState<string | null>(profile.banner);
  
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile.name,
      handle: profile.handle,
      headline: profile.headline,
      location: profile.location,
      about: profile.about,
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, setImagePreview: (url: string) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readDataURL(file);
    }
  };

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    const updatedProfile: Partial<ProfileData> = { 
      ...values,
      avatar: avatarPreview || profile.avatar,
      banner: bannerPreview || profile.banner,
    };
    onProfileUpdate(updatedProfile);
    toast({
      title: "Profile Updated",
      description: "Your information has been saved successfully.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg grid-rows-[auto_1fr_auto] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="pr-6 -mr-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              
               <div className="space-y-2">
                <FormLabel>Profile Picture</FormLabel>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarPreview || undefined} />
                    <AvatarFallback>{profile.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <Button asChild variant="outline">
                     <label htmlFor="avatar-upload" className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4"/>
                      Upload Image
                      <Input id="avatar-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleImageUpload(e, setAvatarPreview)} />
                    </label>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <FormLabel>Banner Image</FormLabel>
                <div className="aspect-[16/6] w-full relative bg-muted rounded-md overflow-hidden flex items-center justify-center">
                  {bannerPreview && <Image src={bannerPreview} layout="fill" objectFit="cover" alt="Banner preview" />}
                   <Button asChild variant="outline" className="z-10">
                     <label htmlFor="banner-upload" className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4"/>
                      Upload Banner
                      <Input id="banner-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleImageUpload(e, setBannerPreview)} />
                    </label>
                  </Button>
                </div>
              </div>

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
                name="handle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Handle</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. priya-sharma" {...field} />
                    </FormControl>
                     <FormDescriptionComponent>
                      This is your unique username on the platform.
                    </FormDescriptionComponent>
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
               <DialogFooter className="pt-4 pr-6">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}


export default function ProfilePage({ params }: { params: { handle: string } }) {
    const { handle } = params;
    const { profileData: ownProfileData, setProfileData } = useContext(ProfileContext);
    const { networkingGroups, setSelectedConversationByName } = useContext(AppContext);
    
    const router = useRouter();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [userPosts, setUserPosts] = useState<FeedItem[]>([]);
    
    // Determine which profile to show
    const isOwnProfile = !handle || handle === ownProfileData?.handle;
    const [profileData, setProfileDataState] = useState<ProfileData | null | undefined>(undefined);

    useEffect(() => {
        let targetProfile: ProfileData | undefined;
        if (isOwnProfile) {
            targetProfile = ownProfileData || undefined;
        } else {
            // Find the community member and construct a ProfileData object
            const member = communityMembers.find(m => m.handle === handle);
            if (member) {
                 targetProfile = {
                    name: member.name,
                    avatar: member.avatar,
                    aiHint: member.aiHint,
                    banner: "https://placehold.co/1200x400.png",
                    bannerAiHint: "university campus",
                    handle: member.handle,
                    headline: `${member.field} at ${member.company}`,
                    location: member.location,
                    connections: Math.floor(Math.random() * 500) + 1, // Placeholder
                    posts: initialFeedItems.filter(item => item.author.handle === member.handle).length,
                    about: `A passionate ${member.field} professional working in the ${member.industry} industry. Graduate of the class of ${member.graduationYear}.`,
                    experience: [{ role: member.field, company: member.company, duration: "2020 - Present" }], // Placeholder
                    education: {
                        degree: member.field,
                        college: "Sinhgad College of Engineering",
                        yearRange: `${member.graduationYear - 4} - ${member.graduationYear}`,
                        graduationYear: member.graduationYear,
                        graduationMonth: member.graduationMonth,
                    },
                };
            }
        }
        setProfileDataState(targetProfile);
        
        if (targetProfile) {
            setUserPosts(initialFeedItems.filter(item => item.author.handle === targetProfile!.handle));
        } else {
             setUserPosts([]);
        }

    }, [handle, ownProfileData, isOwnProfile]);


    const adminGroups = profileData ? networkingGroups.filter(group => 
        group.members.some(member => member.id === profileData!.handle && member.role === 'admin')
    ) : [];

    const handleProfileUpdate = (updatedData: Partial<ProfileData>) => {
        if (isOwnProfile) {
            setProfileData(prev => prev ? {...prev, ...updatedData} : null);
        }
    };

    const handleLogout = () => {
        router.push("/register?tab=login");
    }

    const handleDeletePost = (postId: number) => {
        setUserPosts(prev => prev.filter(item => item.id !== postId));
    };

    const handleGroupClick = (groupName: string) => {
        setSelectedConversationByName(groupName);
        router.push("/messages");
    }
    
    if (profileData === undefined) { // Loading state
        return (
            <div className="bg-secondary/40">
                <div className="max-w-4xl mx-auto">
                    <Card className="rounded-none md:rounded-lg overflow-hidden">
                        <CardHeader className="p-0">
                            <Skeleton className="h-40 md:h-48 w-full" />
                        </CardHeader>
                        <CardContent className="p-6">
                            <Skeleton className="h-24 w-24 rounded-full" />
                            <Skeleton className="h-8 w-1/2 mt-4 mb-2" />
                            <Skeleton className="h-4 w-1/4 mb-4" />
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/3 mb-4" />
                            <div className="flex gap-4">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-5 w-24" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
    
    if (profileData === null) { // User not found
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold">User not found</h1>
                <p className="text-muted-foreground">The profile you are looking for does not exist.</p>
                <Button onClick={() => router.back()} className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
            </div>
        );
    }

  return (
    <div className="bg-secondary/40">
      <div className="max-w-4xl mx-auto">
        <Card className="rounded-none md:rounded-b-lg overflow-hidden">
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
            <div className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-end sm:justify-between">
                    <div className="flex items-start gap-4">
                        <Avatar className="w-24 h-24 border-4 border-background -mt-16">
                            <AvatarImage src={profileData.avatar} data-ai-hint={profileData.aiHint} />
                            <AvatarFallback>{profileData.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <div className="pt-2">
                           <CardTitle className="text-2xl font-bold font-headline">{profileData.name} {getStatusEmoji(profileData.education.graduationYear, profileData.education.graduationMonth)}</CardTitle>
                           <p className="text-sm text-muted-foreground">@{profileData.handle}</p>
                        </div>
                    </div>
                     <div className="flex gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                        {isOwnProfile ? (
                            <>
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(true)} className="flex-1 sm:flex-none"><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                                <Button variant="outline" onClick={handleLogout} className="flex-1 sm:flex-none"><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
                            </>
                        ) : (
                          <>
                            <Button onClick={() => handleGroupClick(profileData.name)} className="w-full">
                               <MessageCircle className="mr-2 h-4 w-4" /> Message
                            </Button>
                             <ShareDialog contentType="profile" contentId={profileData.handle}>
                                <Button variant="outline" size="icon">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </ShareDialog>
                          </>
                        )}
                    </div>
                </div>
                 <div>
                    <p className="mt-1 text-md">{profileData.headline}</p>
                    <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> {profileData.location}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="font-semibold">{profileData.connections}</span><span className="text-muted-foreground">Connections</span>
                        <span className="font-semibold">{userPosts.length}</span><span className="text-muted-foreground">Posts</span>
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
                 {userPosts.length > 0 ? userPosts.map((item) => (
                  <Card key={item.id}>
                    <CardHeader className="p-4 flex flex-row items-center justify-between">
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
                      {isOwnProfile && (
                        <AlertDialog>
                          <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                              </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                              <AlertDialogTrigger asChild>
                                  <DropdownMenuItem className="text-destructive cursor-pointer">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                  </DropdownMenuItem>
                              </AlertDialogTrigger>
                              </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your post.
                              </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeletePost(item.id)}>
                                  Delete
                              </AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="px-4 pb-3 text-sm">{item.content}</p>
                      {item.image && (
                        <div className="w-full aspect-video bg-card">
                           <Image src={item.image} alt="Feed item" className="w-full h-full object-cover" data-ai-hint={item.aiHint} width={600} height={400} />
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
                             <span className="text-sm font-medium">{item.comments.length}</span>
                          </Button>
                          <ShareDialog contentType="post" contentId={item.id}>
                            <Button variant="ghost" size="sm">
                                <Send className="w-5 h-5" />
                            </Button>
                          </ShareDialog>
                      </div>
                    </CardContent>
                  </Card>
                )) : <p className="text-center text-muted-foreground py-8">This user hasn't posted anything yet.</p>}
              </TabsContent>
              <TabsContent value="about" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{profileData.about}</p>
                  </CardContent>
                </Card>
                 <Card>
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
                 <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">Education</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex gap-4">
                        <GraduationCap className="h-8 w-8 text-muted-foreground mt-1"/>
                        <div>
                            <p className="font-semibold">{profileData.education.college}</p>
                            <p className="text-sm text-muted-foreground">{profileData.education.degree}</p>
                            <p className="text-xs text-muted-foreground">{profileData.education.yearRange}</p>
                        </div>
                    </div>
                  </CardContent>
                </Card>
                 {isOwnProfile && adminGroups.length > 0 && (
                    <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">Groups Administered</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {adminGroups.map(group => (
                            <div key={group.title} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-muted rounded-md">
                                        <Users className="h-5 w-5 text-muted-foreground"/>
                                    </div>
                                    <p className="font-semibold text-sm">{group.title}</p>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleGroupClick(group.title)}
                                >
                                    Go to Chat
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                    </Card>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      {isOwnProfile && <EditProfileDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} profile={profileData} onProfileUpdate={handleProfileUpdate} />}
    </div>
  );
}
