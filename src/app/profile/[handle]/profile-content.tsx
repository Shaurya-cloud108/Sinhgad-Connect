
"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, GraduationCap, MapPin, Edit, Heart, MessageCircle, Send, LogOut, MoreHorizontal, Trash2, Upload, Users, ArrowLeft, Share2, PlusCircle, Linkedin, Github, Mail, Link as LinkIcon, Camera, Video, UserPlus, ImageIcon, Award, X } from "lucide-react";
import { ProfileData, FeedItem, EducationEntry, feedItems as initialFeedItems, stories as initialStories, Story, StoryItem, JobListing } from "@/lib/data.tsx";
import { useState, useContext, useEffect, useMemo, useRef } from "react";
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
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileContext } from "@/context/ProfileContext";
import { AppContext } from "@/context/AppContext";
import { getStatusEmoji, cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ShareDialog } from "@/components/share-dialog";
import Link from 'next/link';
import { Separator } from "@/components/ui/separator";
import { PostJobDialog } from "@/components/post-job-dialog";


const profileFormSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  handle: z.string()
    .min(3, "Handle must be at least 3 characters")
    .regex(/^[a-z0-9-._]+$/, "Handle can only contain lowercase letters, numbers, hyphens, dots and underscores."),
  headline: z.string().min(5, "Headline is too short"),
  location: z.string().min(2, "Location is too short"),
  about: z.string().min(10, "About section is too short"),
  contact: z.object({
    email: z.string().email("Please enter a valid email.").optional().or(z.literal('')),
    website: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  }),
  socials: z.object({
    linkedin: z.string().url("Please enter a valid LinkedIn URL.").optional().or(z.literal('')),
    github: z.string().url("Please enter a valid GitHub URL.").optional().or(z.literal('')),
  }),
  experience: z.array(
    z.object({
      role: z.string().min(1, "Role is required"),
      company: z.string().min(1, "Company is required"),
      duration: z.string().min(1, "Duration is required"),
    })
  ),
  education: z.array(
    z.object({
      degree: z.string().min(1, "Degree is required"),
      college: z.string().min(1, "College is required"),
      yearRange: z.string().min(1, "Year range is required"),
    })
  ),
});


function CreatePostDialog({ open, onOpenChange, onPostSubmit }: { open: boolean, onOpenChange: (open: boolean) => void, onPostSubmit: (post: FeedItem) => void }) {
  const { toast } = useToast();
  const [postContent, setPostContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { profileData } = useContext(ProfileContext);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = () => {
     if (!postContent.trim()) {
      toast({
        variant: "destructive",
        title: "Empty Post",
        description: "Please write something before posting.",
      });
      return;
    }
    
    if (!profileData) return;

    const newPost: FeedItem = {
        id: Date.now(), // Simple unique ID
        author: {
            name: profileData.name,
            avatar: profileData.avatar,
            handle: profileData.handle,
            aiHint: "professional woman"
        },
        content: postContent,
        image: imagePreview,
        aiHint: "user uploaded",
        likes: 0,
        liked: false,
        comments: []
    };

    onPostSubmit(newPost);
    
    toast({
      title: "Post Successful!",
      description: "Your update has been shared with the network.",
    });

    setPostContent("");
    setImagePreview(null);
    if(imageInputRef.current) {
        imageInputRef.current.value = "";
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Share an achievement or ask a question..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            rows={5}
          />
          {imagePreview && (
            <div className="mt-4 relative">
              <Image src={imagePreview} alt="Image preview" className="rounded-lg w-full" width={400} height={225} />
               <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => setImagePreview(null)}>
                 <X className="h-4 w-4" />
               </Button>
            </div>
          )}
        </div>
        <DialogFooter className="justify-between sm:justify-between">
           <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
              <label htmlFor="image-upload-profile">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                <Input id="image-upload-profile" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} ref={imageInputRef} />
              </label>
            </Button>
           </div>
           <div className="flex items-center gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleSubmit}>Post</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


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
      contact: {
        email: profile.contact.email,
        website: profile.contact.website,
      },
      socials: {
        linkedin: profile.socials.linkedin,
        github: profile.socials.github,
      },
      experience: profile.experience,
      education: profile.education.map(edu => ({
        degree: edu.degree,
        college: edu.college,
        yearRange: edu.yearRange
      })),
    },
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, setImagePreview: (url: string) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    // We need to merge back the non-editable fields like graduation year/month for the primary education
    const updatedEducation: EducationEntry[] = values.education.map((edu, index) => {
      // Find the corresponding original education entry, if it exists
      const originalEdu = profile.education[index];
      if (originalEdu && originalEdu.graduationYear) { // Check if it's the primary one with metadata
        return {
          ...originalEdu,
          ...edu,
        };
      }
      return {
        ...edu,
        // Ensure new entries have undefined for the optional fields if not set
        graduationYear: undefined,
        graduationMonth: undefined,
      };
    });

    const updatedProfile: Partial<ProfileData> = { 
      ...values,
      education: updatedEducation,
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
      <DialogContent className="sm:max-w-2xl grid-rows-[auto_1fr_auto] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <ScrollArea className="pr-6 -mr-6 h-[calc(80vh-150px)]">
              <div className="space-y-4">
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
                      <FormControl><Input {...field} /></FormControl>
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
                      <FormControl><Input placeholder="e.g. priya-sharma" {...field} /></FormControl>
                      <FormDescriptionComponent>This is your unique username on the platform.</FormDescriptionComponent>
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
                      <FormControl><Input {...field} /></FormControl>
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
                      <FormControl><Input {...field} /></FormControl>
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
                      <FormControl><Textarea rows={4} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />
                
                <div>
                    <h3 className="text-lg font-semibold mb-2">Contact & Socials</h3>
                    <div className="space-y-4 p-4 border rounded-md">
                        <FormField control={form.control} name="contact.email" render={({ field }) => (<FormItem><FormLabel>Contact Email</FormLabel><FormControl><Input type="email" placeholder="your.email@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="contact.website" render={({ field }) => (<FormItem><FormLabel>Portfolio/Website URL</FormLabel><FormControl><Input placeholder="https://your-portfolio.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="socials.linkedin" render={({ field }) => (<FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input placeholder="https://linkedin.com/in/your-profile" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="socials.github" render={({ field }) => (<FormItem><FormLabel>GitHub URL</FormLabel><FormControl><Input placeholder="https://github.com/your-username" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                </div>

                <Separator />
                
                <div>
                    <h3 className="text-lg font-semibold mb-2">Experience</h3>
                    <div className="space-y-4">
                        {expFields.map((field, index) => (
                          <div key={field.id} className="p-4 border rounded-md relative space-y-2">
                              <FormField control={form.control} name={`experience.${index}.role`} render={({ field }) => (<FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                              <FormField control={form.control} name={`experience.${index}.company`} render={({ field }) => (<FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                              <FormField control={form.control} name={`experience.${index}.duration`} render={({ field }) => (<FormItem><FormLabel>Duration</FormLabel><FormControl><Input placeholder="e.g. 2020 - Present" {...field} /></FormControl><FormMessage /></FormItem>)} />
                              <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeExp(index)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        ))}
                         <Button type="button" variant="outline" size="sm" onClick={() => appendExp({ role: '', company: '', duration: '' })}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
                        </Button>
                    </div>
                </div>

                <Separator />

                 <div>
                    <h3 className="text-lg font-semibold mb-2">Education</h3>
                     <div className="space-y-4">
                        {eduFields.map((field, index) => (
                          <div key={field.id} className="p-4 border rounded-md relative space-y-2">
                              <FormField control={form.control} name={`education.${index}.college`} render={({ field }) => (<FormItem><FormLabel>School / College</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                              <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => (<FormItem><FormLabel>Degree / Certificate</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                              <FormField control={form.control} name={`education.${index}.yearRange`} render={({ field }) => (<FormItem><FormLabel>Years Attended</FormLabel><FormControl><Input placeholder="e.g. 2005 - 2009" {...field} /></FormControl><FormMessage /></FormItem>)} />
                              {eduFields.length > 1 && <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeEdu(index)}><Trash2 className="h-4 w-4" /></Button>}
                          </div>
                        ))}
                         <Button type="button" variant="outline" size="sm" onClick={() => appendEdu({ college: '', degree: '', yearRange: '' })}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Education
                        </Button>
                    </div>
                </div>
              </div>
            </ScrollArea>
             <DialogFooter className="pt-4 pr-6">
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


export default function ProfilePageContent({ handle }: { handle: string }) {
    const { profileData: ownProfileData, setProfileData } = useContext(ProfileContext);
    const { setSelectedConversationByName, addJobListing, communityMembers, setCommunityMembers } = useContext(AppContext);
    
    const router = useRouter();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
    const [isPostJobDialogOpen, setIsPostJobDialogOpen] = useState(false);

    const [feedItems, setFeedItems] = useState<FeedItem[]>(initialFeedItems);
    const [stories, setStories] = useState<Story[]>(initialStories);
    
    const isOwnProfile = !handle || handle === ownProfileData?.handle;

    const profileToDisplay = useMemo(() => {
        if (isOwnProfile) {
            return ownProfileData;
        }
        return communityMembers.find(m => m.handle === handle);
    }, [handle, ownProfileData, isOwnProfile, communityMembers]);

    const profileData: ProfileData | null = useMemo(() => {
        if (!profileToDisplay) return null;
        if (isOwnProfile) return profileToDisplay as ProfileData;

        // Create a full profile object for other users
        const member = profileToDisplay as typeof communityMembers[0];
        return {
            name: member.name,
            avatar: member.avatar,
            aiHint: member.aiHint,
            banner: "https://placehold.co/1200x400.png",
            bannerAiHint: "university campus",
            handle: member.handle,
            headline: `${member.field} at ${member.company}`,
            location: member.location,
            followers: member.followers,
            following: member.following,
            posts: feedItems.filter(item => item.author.handle === member.handle).length,
            about: `A passionate ${member.field} professional working in the ${member.industry} industry. Graduate of the class of ${member.graduationYear}.`,
            experience: [{ role: member.field, company: member.company, duration: "2020 - Present" }], // Placeholder
            education: [{
                degree: member.field,
                college: "Sinhgad College of Engineering",
                yearRange: `${member.graduationYear - 4} - ${member.graduationYear}`,
                graduationYear: member.graduationYear,
                graduationMonth: member.graduationMonth,
            }],
            socials: { // Placeholder socials
                linkedin: "https://www.linkedin.com/",
                github: "https://github.com/",
              },
              contact: { // Placeholder contact
                email: `${member.handle}@example.com`,
                website: "https://example.com"
              },
        };
    }, [profileToDisplay, isOwnProfile, feedItems]);

    const userPosts = useMemo(() => {
        if (!profileData) return [];
        return feedItems.filter(item => item.author.handle === profileData.handle);
    }, [profileData, feedItems]);

    const isFollowing = useMemo(() => {
        if (!ownProfileData || !profileData || isOwnProfile) return false;
        return ownProfileData.following.includes(profileData.handle);
    }, [ownProfileData, profileData, isOwnProfile]);


    const handleProfileUpdate = (updatedData: Partial<ProfileData>) => {
        if (isOwnProfile) {
            setProfileData(prev => prev ? {...prev, ...updatedData} as ProfileData : null);
        }
    };
    
    const handleFollowToggle = () => {
        if (!ownProfileData || !profileData || isOwnProfile) return;

        // Update the logged-in user's following list
        setProfileData(prev => {
            if (!prev) return null;
            const newFollowingList = isFollowing
                ? prev.following.filter(h => h !== profileData.handle)
                : [...prev.following, profileData.handle];
            return { ...prev, following: newFollowingList };
        });
        
        // Update the viewed user's follower count in the global context
        setCommunityMembers(prev => 
            prev.map(member => 
                member.handle === profileData.handle
                ? { ...member, followers: member.followers + (isFollowing ? -1 : 1) }
                : member
            )
        );
    };

    const handleLogout = () => {
        router.push("/register?tab=login");
    }

    const handleDeletePost = (postId: number) => {
        // In a real app, this would also update the main feed state, probably via context
        setFeedItems(prev => prev.filter(item => item.id !== postId));
    };

    const handleMessageClick = () => {
      if (!profileData) return;
      setSelectedConversationByName(profileData.name);
      router.push("/messages");
    }
    
    const handlePostSubmit = (newPost: FeedItem) => {
        setFeedItems(prev => [newPost, ...prev]);
    };

    const handleJobSubmit = (newJob: Omit<JobListing, 'id' | 'postedBy' | 'postedByHandle'>) => {
        if(!profileData) return;
        const primaryEducation = profileData.education.find(e => e.graduationYear);
        const gradYearSuffix = primaryEducation?.graduationYear ? `'${primaryEducation.graduationYear.toString().slice(-2)}` : '';

        addJobListing({
        ...newJob,
        id: Date.now(),
        postedBy: `${profileData.name} ${gradYearSuffix}`.trim(),
        postedByHandle: profileData.handle,
        });
    }

    if (profileData === undefined) { // Loading state for context
        return (
            <div className="bg-secondary/40">
                <div className="max-w-4xl mx-auto">
                    <Card className="rounded-none md:rounded-lg overflow-hidden">
                        <CardHeader className="p-0">
                            <Skeleton className="h-40 md:h-48 w-full" />
                        </CardHeader>
                        <CardContent className="p-6">
                            <Skeleton className="h-24 w-24 rounded-full -mt-16" />
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
    
    if (profileData === null) { // User not found or not logged in
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

    const primaryEducation = profileData.education.find(e => e.graduationYear);

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
                           <CardTitle className="text-2xl font-bold font-headline flex items-center gap-2">{profileData.name} {primaryEducation?.graduationYear && primaryEducation?.graduationMonth ? getStatusEmoji(primaryEducation.graduationYear, primaryEducation.graduationMonth) : ''}</CardTitle>
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
                            <Button variant={isFollowing ? 'secondary' : 'default'} onClick={handleFollowToggle} className="w-full">
                               {isFollowing ? <Users className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                               {isFollowing ? 'Following' : 'Follow'}
                            </Button>
                            <Button onClick={handleMessageClick} className="w-full" variant="outline">
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
                    <div className="flex items-center gap-6 mt-2 text-sm">
                        <div className="flex items-center gap-1.5">
                            <span className="font-semibold">{profileData.followers}</span><span className="text-muted-foreground">Followers</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-semibold">{profileData.following.length}</span><span className="text-muted-foreground">Following</span>
                        </div>
                    </div>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="posts">Posts ({userPosts.length})</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="mt-6 space-y-6">
                 {isOwnProfile && (
                    <Card>
                        <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={profileData.avatar} data-ai-hint="user avatar" />
                                <AvatarFallback>{profileData.name.substring(0,2)}</AvatarFallback>
                            </Avatar>
                            <button
                                className="w-full text-left bg-secondary/50 hover:bg-muted/80 transition-colors py-2 px-4 rounded-full text-sm text-muted-foreground"
                                onClick={() => setIsPostDialogOpen(true)}
                            >
                                Share an update...
                            </button>
                            </div>
                            <div className="flex justify-around mt-3 pt-3 border-t">
                            <Button variant="ghost" className="w-full" onClick={() => setIsPostDialogOpen(true)}>
                                <ImageIcon className="text-green-500" />
                                Photo
                            </Button>
                            <Button variant="ghost" className="w-full" onClick={() => setIsPostDialogOpen(true)}>
                                <Award className="text-yellow-500" />
                                Achievement
                            </Button>
                            <Button variant="ghost" className="w-full" onClick={() => setIsPostJobDialogOpen(true)}>
                                <Briefcase className="text-blue-500" />
                                Job
                            </Button>
                            </div>
                        </CardContent>
                    </Card>
                 )}
                 {userPosts.length > 0 ? userPosts.map((item) => (
                  <Card key={item.id}>
                    <CardHeader className="p-4 flex flex-row items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Link href={`/profile/${item.author.handle}`}>
                            <Avatar className="w-10 h-10">
                            <AvatarImage src={item.author.avatar} data-ai-hint={item.author.aiHint} />
                            <AvatarFallback>{item.author.name.substring(0,2)}</AvatarFallback>
                            </Avatar>
                        </Link>
                        <div>
                          <Link href={`/profile/${item.author.handle}`} className="hover:underline">
                            <p className="font-semibold text-sm">{item.author.name}</p>
                          </Link>
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
                    <CardTitle className="font-headline text-xl">Contact & Socials</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {profileData.contact.email && (
                      <div className="flex items-center gap-4">
                          <Mail className="h-5 w-5 text-muted-foreground"/>
                          <a href={`mailto:${profileData.contact.email}`} className="text-sm text-primary hover:underline">
                              {profileData.contact.email}
                          </a>
                      </div>
                    )}
                    {profileData.contact.website && (
                         <div className="flex items-center gap-4">
                            <LinkIcon className="h-5 w-5 text-muted-foreground"/>
                            <a href={profileData.contact.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                Personal Website
                            </a>
                        </div>
                    )}
                    {profileData.socials.linkedin && (
                         <div className="flex items-center gap-4">
                            <Linkedin className="h-5 w-5 text-muted-foreground"/>
                            <a href={profileData.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                LinkedIn
                            </a>
                        </div>
                    )}
                    {profileData.socials.github && (
                         <div className="flex items-center gap-4">
                            <Github className="h-5 w-5 text-muted-foreground"/>
                            <a href={profileData.socials.github} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                GitHub
                            </a>
                        </div>
                    )}
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">Experience</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profileData.experience.map((exp, index) => (
                        <div key={index} className="flex gap-4">
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
                     {profileData.education.map((edu, index) => (
                       <div key={index} className="flex gap-4">
                          <GraduationCap className="h-8 w-8 text-muted-foreground mt-1"/>
                          <div>
                              <p className="font-semibold">{edu.college}</p>
                              <p className="text-sm text-muted-foreground">{edu.degree}</p>
                              <p className="text-xs text-muted-foreground">{edu.yearRange}</p>
                          </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      {isOwnProfile && profileData && (
        <>
            <EditProfileDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} profile={profileData} onProfileUpdate={handleProfileUpdate} />
            <CreatePostDialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen} onPostSubmit={handlePostSubmit} />
            <PostJobDialog open={isPostJobDialogOpen} onOpenChange={setIsPostJobDialogOpen} onJobSubmit={handleJobSubmit}/>
        </>
      )}
    </div>
  );
}
