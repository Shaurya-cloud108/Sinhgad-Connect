
"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Send, Plus, Image as ImageIcon, Award, Briefcase, X, MoreHorizontal, Trash2, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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
} from "@/components/ui/alert-dialog"

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState, useContext, useRef, useEffect } from "react";
import { useSearchParams } from 'next/navigation'
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { stories as initialStories, feedItems as initialFeedItems, FeedItem, Story, Comment, StoryViewer, JobListing } from "@/lib/data.tsx";
import Image from "next/image";
import { ProfileContext } from "@/context/ProfileContext";
import { ShareDialog } from "@/components/share-dialog";
import { cn } from "@/lib/utils";
import { CommentSheet } from "@/components/comment-sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { PostJobDialog } from "@/components/post-job-dialog";
import { AppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";


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
      reader.readDataURL(file);
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
              <label htmlFor="image-upload">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                <Input id="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} ref={imageInputRef} />
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

function CreateStoryDialog({ open, onOpenChange, onStorySubmit }: { open: boolean, onOpenChange: (open: boolean) => void, onStorySubmit: (image: string) => void }) {
    const { toast } = useToast();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
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
        if (!imagePreview) {
            toast({
                variant: "destructive",
                title: "No Image Selected",
                description: "Please select an image for your story.",
            });
            return;
        }

        onStorySubmit(imagePreview);

        toast({
            title: "Story Posted!",
            description: "Your story is now visible to your network.",
        });

        setImagePreview(null);
        if(imageInputRef.current) {
            imageInputRef.current.value = "";
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a Story</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <div className="flex flex-col items-center justify-center gap-4">
                        {imagePreview ? (
                            <div className="relative aspect-[9/16] w-64">
                                <Image src={imagePreview} alt="Story preview" layout="fill" objectFit="cover" className="rounded-lg" />
                                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => setImagePreview(null)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-lg">
                                <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                                <Button asChild>
                                    <label htmlFor="story-image-upload">
                                        Upload Image
                                        <Input id="story-image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} ref={imageInputRef} />
                                    </label>
                                </Button>
                                <p className="text-xs text-muted-foreground mt-2">Stories are visual. Start with a photo.</p>
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={!imagePreview}>Post Story</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function StoryViewersSheet({ viewers, open, onOpenChange }: { viewers: StoryViewer[]; open: boolean; onOpenChange: (open: boolean) => void; }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Viewed by</SheetTitle>
          <SheetDescription>
            {viewers.length} {viewers.length === 1 ? 'person' : 'people'} have seen your story.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100%-120px)] my-4 pr-6 -mr-6">
          <div className="space-y-4">
            {viewers.map((viewer, index) => (
              <div key={index} className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={viewer.avatar} />
                  <AvatarFallback>{viewer.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <p className="font-semibold">{viewer.name}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function StoryViewerDialog({ story, open, onOpenChange }: { story: Story | null; open: boolean; onOpenChange: (open: boolean) => void; }) {
  const [isViewersSheetOpen, setIsViewersSheetOpen] = useState(false);

  if (!story || story.images.length === 0) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-0 border-0 max-w-md w-full h-[80vh] bg-black">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <Image src={story.images[0]} alt={`Story from ${story.name}`} layout="fill" objectFit="cover" data-ai-hint={story.aiHint} />
            <div className="absolute top-0 left-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent w-full">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={story.avatar} />
                  <AvatarFallback>{story.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-white">{story.name}</span>
              </div>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-black/50 hover:text-white">
                  <X />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogClose>
            </div>
            {story.isOwn && story.viewers && (
              <div 
                className="absolute bottom-4 left-4 flex items-center gap-2 cursor-pointer bg-black/50 text-white p-2 rounded-lg"
                onClick={() => setIsViewersSheetOpen(true)}
              >
                <Eye className="w-5 h-5" />
                <span className="font-semibold text-sm">{story.viewers.length}</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <StoryViewersSheet viewers={story.viewers || []} open={isViewersSheetOpen} onOpenChange={setIsViewersSheetOpen} />
    </>
  );
}

function HomePageContent() {
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isPostJobDialogOpen, setIsPostJobDialogOpen] = useState(false);
  const [isCreateStoryDialogOpen, setIsCreateStoryDialogOpen] = useState(false);
  const [feedItems, setFeedItems] = useState<FeedItem[]>(initialFeedItems);
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const { profileData } = useContext(ProfileContext);
  const { addJobListing } = useContext(AppContext);
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
  const router = useRouter();
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const postId = searchParams.get('postId');
    if (postId) {
      const element = document.getElementById(`post-${postId}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('bg-primary/10', 'transition-all', 'duration-1000');
          setTimeout(() => {
            element.classList.remove('bg-primary/10');
          }, 2000);
        }, 100);
      }
    }
  }, [searchParams]);

  if (!profileData) {
      return (
        <div className="w-full max-w-2xl mx-auto py-4 space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
        </div>
      );
  }

  const handlePostSubmit = (newPost: FeedItem) => {
    setFeedItems(prev => [newPost, ...prev]);
  };

  const handleJobSubmit = (newJob: Omit<JobListing, 'id' | 'postedBy' | 'postedByHandle'>) => {
    if(!profileData) return;
    addJobListing({
      ...newJob,
      id: Date.now(),
      postedBy: `${profileData.name} '${profileData.education.graduationYear.toString().slice(-2)}`,
      postedByHandle: profileData.handle,
    });
  }
  
  const handleStorySubmit = (image: string) => {
    setStories(prevStories => {
        const newStories = [...prevStories];
        const myStoryIndex = newStories.findIndex(s => s.isOwn);
        if (myStoryIndex !== -1) {
            newStories[myStoryIndex].images.push(image);
        }
        return newStories;
    });
  }

  const handleStoryClick = (story: Story) => {
    if (story.isOwn) {
      if (story.images.length > 0) {
        setSelectedStory(story);
        setIsStoryViewerOpen(true);
      } else {
        setIsCreateStoryDialogOpen(true);
      }
    } else {
      setSelectedStory(story);
      setIsStoryViewerOpen(true);
    }
  };

  const handleDeletePost = (postId: number) => {
    setFeedItems(prev => prev.filter(item => item.id !== postId));
  };
  
  const handleLike = (postId: number) => {
    setFeedItems(prev => prev.map(item => 
        item.id === postId 
        ? {...item, liked: !item.liked, likes: item.liked ? item.likes - 1 : item.likes + 1}
        : item
    ));
  };

  const handleAddComment = (postId: number, commentText: string) => {
    if (!profileData) return;
    const newComment: Comment = {
      id: Date.now(),
      author: {
        name: profileData.name,
        avatar: profileData.avatar,
        handle: profileData.handle
      },
      text: commentText,
    };
    setFeedItems(prev => prev.map(item =>
      item.id === postId
        ? { ...item, comments: [...item.comments, newComment] }
        : item
    ));
  };

  const handleDeleteComment = (postId: number, commentId: number) => {
    setFeedItems(prev => prev.map(item =>
      item.id === postId
        ? { ...item, comments: item.comments.filter(c => c.id !== commentId) }
        : item
    ));
  };

  const activePostForComments = feedItems.find(item => item.id === activeCommentPostId);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Stories */}
      <div className="py-4 border-b">
        <div className="px-4 flex items-center space-x-4 overflow-x-auto">
          {stories.map((story) => (
            <div key={story.id} className="flex-shrink-0 text-center cursor-pointer" onClick={() => handleStoryClick(story)}>
              <div className={cn(
                "relative rounded-full p-0.5 border-2",
                story.isOwn && story.images.length === 0 && "border-dashed",
                story.isOwn && story.images.length > 0 && "border-primary",
                !story.isOwn && story.images.length > 0 && "border-primary"
              )}>
                <Avatar className="w-16 h-16">
                  <AvatarImage src={story.isOwn ? profileData.avatar : story.avatar} data-ai-hint={story.aiHint} />
                  <AvatarFallback>{story.name.substring(0,2)}</AvatarFallback>
                  {story.isOwn && story.images.length === 0 && (
                    <div className="absolute bottom-0 right-0 bg-primary rounded-full p-0.5 border-2 border-background">
                      <Plus className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </Avatar>
              </div>
              <p className="text-xs mt-1.5">{story.isOwn ? 'Your Story' : story.name}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Create Post */}
      <div className="p-4">
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
                Share an update, achievement, or question...
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
      </div>

      <CreatePostDialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen} onPostSubmit={handlePostSubmit} />
      <PostJobDialog open={isPostJobDialogOpen} onOpenChange={setIsPostJobDialogOpen} onJobSubmit={handleJobSubmit}/>
      <CreateStoryDialog open={isCreateStoryDialogOpen} onOpenChange={setIsCreateStoryDialogOpen} onStorySubmit={handleStorySubmit} />
      <StoryViewerDialog story={selectedStory} open={isStoryViewerOpen} onOpenChange={setIsStoryViewerOpen} />
      <CommentSheet
        open={!!activeCommentPostId}
        onOpenChange={(isOpen) => {
          if (!isOpen) setActiveCommentPostId(null);
        }}
        post={activePostForComments}
        onCommentSubmit={handleAddComment}
        onCommentDelete={handleDeleteComment}
        currentProfile={profileData}
      />

      {/* Feed */}
      <div className="space-y-4 py-4">
        {feedItems.map((item) => (
          <Card key={item.id} id={`post-${item.id}`} className="rounded-none md:rounded-lg shadow-none md:shadow-sm border-l-0 border-r-0 md:border">
            <CardHeader className="p-4 flex flex-row items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link href={`/profile/${item.author.handle}`} className="flex items-center space-x-3 group">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={item.author.avatar} data-ai-hint={item.author.aiHint} />
                    <AvatarFallback>{item.author.name.substring(0,2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm group-hover:underline">{item.author.name}</p>
                    <p className="text-xs text-muted-foreground">@{item.author.handle}</p>
                  </div>
                </Link>
              </div>
              {item.author.handle === profileData.handle && (
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
                   <Image src={item.image} alt="Feed item" className="w-full h-full object-cover" data-ai-hint={item.aiHint} width={600} height={400}/>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-2 flex justify-between items-center">
               <div className="flex items-center text-sm text-muted-foreground">
                  <Button variant="ghost" size="sm" className={cn("flex items-center gap-2", item.liked && "text-destructive")} onClick={() => handleLike(item.id)}>
                    <Heart className={cn("w-5 h-5", item.liked && "fill-current")} />
                    <span>{item.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => setActiveCommentPostId(item.id)}>
                    <MessageCircle className="w-5 h-5" />
                     <span>{item.comments.length}</span>
                  </Button>
                </div>
                <div>
                    <ShareDialog contentType="post" contentId={item.id}>
                      <Button variant="ghost" size="icon">
                          <Send className="w-5 h-5" />
                      </Button>
                    </ShareDialog>
                </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}


export default function Home() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-full max-w-2xl mx-auto py-4 space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }
    
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <HomePageContent />
        </React.Suspense>
    )
}
