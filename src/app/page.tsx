
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
import { Heart, MessageCircle, Send, Plus, Image as ImageIcon, Award, Briefcase, X, MoreHorizontal, Trash2, Eye, Video, Film } from "lucide-react";
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
import { useState, useContext, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from 'next/navigation'
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { initialFeedItems, FeedItem, Story, Comment, StoryViewer, JobListing, StoryItem } from "@/lib/data.tsx";
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

function CreateStoryDialog({ open, onOpenChange, onStorySubmit }: { open: boolean, onOpenChange: (open: boolean) => void, onStorySubmit: (fileUrl: string, fileType: 'image' | 'video') => void }) {
    const { toast } = useToast();
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result as string);
                setFileType(file.type.startsWith('video/') ? 'video' : 'image');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (!filePreview || !fileType) {
            toast({
                variant: "destructive",
                title: "No File Selected",
                description: "Please select an image or video for your story.",
            });
            return;
        }

        onStorySubmit(filePreview, fileType);

        toast({
            title: "Story Posted!",
            description: "Your story is now visible to your network.",
        });

        setFilePreview(null);
        setFileType(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onOpenChange(false);
    };
    
    const handleReset = () => {
      setFilePreview(null);
      setFileType(null);
      if(fileInputRef.current) {
          fileInputRef.current.value = "";
      }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a Story</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <div className="flex flex-col items-center justify-center gap-4">
                        {filePreview ? (
                            <div className="relative aspect-[9/16] w-64 bg-black rounded-lg">
                                {fileType === 'image' && <Image src={filePreview} alt="Story preview" layout="fill" objectFit="cover" className="rounded-lg" />}
                                {fileType === 'video' && <video src={filePreview} controls autoPlay loop className="w-full h-full rounded-lg object-cover" />}
                                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={handleReset}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-lg">
                                <Film className="h-16 w-16 text-muted-foreground mb-4" />
                                <Button asChild>
                                    <label htmlFor="story-file-upload">
                                        Upload Image or Video
                                        <Input id="story-file-upload" type="file" className="sr-only" accept="image/*,video/*" onChange={handleFileUpload} ref={fileInputRef} />
                                    </label>
                                </Button>
                                <p className="text-xs text-muted-foreground mt-2">Share a moment with your network.</p>
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
                    <Button onClick={handleSubmit} disabled={!filePreview}>Post Story</Button>
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

function StoryViewerDialog({ story, open, onOpenChange, onDeleteStoryItem, currentUserId }: { story: Story | null; open: boolean; onOpenChange: (open: boolean) => void; onDeleteStoryItem: (storyId: number, itemId: number) => void; currentUserId: string | undefined }) {
  const [isViewersSheetOpen, setIsViewersSheetOpen] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeItems = story?.items.filter(item => Date.now() - item.timestamp < 24 * 60 * 60 * 1000) || [];

  useEffect(() => {
    if (story) {
        setCurrentItemIndex(0);
    }
  }, [story]);
  
  const handleNext = () => {
    setCurrentItemIndex(prev => {
        if (prev < activeItems.length - 1) {
            return prev + 1;
        }
        onOpenChange(false); // Close when the last story finishes
        return prev;
    });
  };

  const handlePrevious = () => {
    setCurrentItemIndex(prev => Math.max(0, prev - 1));
  }
  
  useEffect(() => {
    setProgress(0); // Reset progress when item changes
    const currentItem = activeItems[currentItemIndex];

    if (!currentItem || !open) return;

    let timer: NodeJS.Timeout;
    let interval: NodeJS.Timer;

    if (currentItem.type === 'image') {
        timer = setTimeout(handleNext, 15000); // 15-second timer for images
        interval = setInterval(() => {
            setProgress(p => p + 100 / (15000 / 50));
        }, 50);

    } else if (currentItem.type === 'video' && videoRef.current) {
        const videoElement = videoRef.current;
        
        const updateProgress = () => {
            if (videoElement.duration > 0) {
                setProgress((videoElement.currentTime / videoElement.duration) * 100);
            }
        };

        const onVideoEnd = () => handleNext();
        
        const onLoadedData = () => {
          videoElement.play().catch(e => console.error("Video autoplay failed:", e));
        };
        
        videoElement.addEventListener('timeupdate', updateProgress);
        videoElement.addEventListener('ended', onVideoEnd);
        videoElement.addEventListener('loadeddata', onLoadedData);


        return () => {
            videoElement.removeEventListener('timeupdate', updateProgress);
            videoElement.removeEventListener('ended', onVideoEnd);
            videoElement.removeEventListener('loadeddata', onLoadedData);
        };
    }
    
    return () => {
        clearTimeout(timer);
        clearInterval(interval);
    };

}, [currentItemIndex, activeItems, open]);


  if (!story || activeItems.length === 0) return null;
  
  const currentItem = activeItems[currentItemIndex];
  
  const handleDelete = () => {
    onDeleteStoryItem(story.id, currentItem.id);
    onOpenChange(false);
  };

  const isOwnStory = story.author.handle === currentUserId;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-0 border-0 max-w-md w-full h-[90vh] sm:h-[80vh] bg-black" onInteractOutside={(e) => onOpenChange(false)}>
          <DialogHeader className="sr-only">
             <DialogTitle>Story by {story.author.name}</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-full rounded-lg overflow-hidden flex flex-col justify-center">
            {/* Click handlers for next/prev */}
            <div className="absolute left-0 top-0 h-full w-1/2 z-10" onClick={handlePrevious} />
            <div className="absolute right-0 top-0 h-full w-1/2 z-10" onClick={handleNext} />
            
            {/* Story Content */}
            <div className="w-full h-full relative">
                {currentItem.type === 'image' && <Image src={currentItem.url} alt={`Story from ${story.author.name}`} layout="fill" objectFit="contain" data-ai-hint={story.author.aiHint} />}
                {currentItem.type === 'video' && <video ref={videoRef} src={currentItem.url} controls={false} muted autoPlay className="w-full h-full object-contain" />}
            </div>

            {/* Progress bars */}
             <div className="absolute top-2 left-2 right-2 flex gap-1 z-20">
                {activeItems.map((_, index) => (
                    <div key={index} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-white transition-transform duration-[50ms] ease-linear" 
                            style={{ 
                                transform: `scaleX(${(index < currentItemIndex ? 1 : (index === currentItemIndex ? progress / 100 : 0))})`,
                                transformOrigin: 'left'
                            }}
                        />
                    </div>
                ))}
            </div>

            <div className="absolute top-4 left-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent w-full z-20">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={story.author.avatar} />
                  <AvatarFallback>{story.author.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-white">{story.author.name}</span>
              </div>
              <div className="flex items-center">
                {isOwnStory && (
                   <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-black/50 hover:text-white">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-destructive cursor-pointer">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Story
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                     <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this story item?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone and will permanently delete this part of your story.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <Button variant="ghost" size="icon" className="text-white hover:bg-black/50 hover:text-white" onClick={() => onOpenChange(false)}>
                  <X />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </div>
            {isOwnStory && story.viewers && (
              <div 
                className="absolute bottom-4 left-4 flex items-center gap-2 cursor-pointer bg-black/50 text-white p-2 rounded-lg z-20"
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
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const { profileData } = useContext(ProfileContext);
  const { addJobListing, communityMembers } = useContext(AppContext);
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
  const router = useRouter();
  
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize stories from community members
    const allUsersAsStories: Story[] = communityMembers.map((member, index) => ({
        id: index + 1,
        author: {
            name: member.name,
            avatar: member.avatar,
            handle: member.handle,
            aiHint: member.aiHint,
        },
        items: [], // Start with no items
        viewers: [],
    }));

     // Find Rohan Verma's story and add a demo item if it exists
    const rohanVermaStory = allUsersAsStories.find(s => s.author.handle === 'rohan-verma');
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
    setStories(allUsersAsStories);
  }, [communityMembers]);


  const storiesForFeed = useMemo(() => {
    if (!profileData) return [];
    
    // Filter stories to only include the user's own story and stories from people they follow
    const followedHandles = new Set(profileData.following);
    const filteredStories = stories.filter(story => {
      const handle = story.author.handle;
      const hasActiveStory = story.items.some(item => Date.now() - item.timestamp < 24 * 60 * 60 * 1000);
      return (handle === profileData.handle) || (followedHandles.has(handle) && hasActiveStory);
    });

    // Ensure the user's story is always first
    const myStoryIndex = filteredStories.findIndex(story => story.author.handle === profileData.handle);
    if (myStoryIndex > 0) {
      const [myStory] = filteredStories.splice(myStoryIndex, 1);
      filteredStories.unshift(myStory);
    } else if (myStoryIndex === -1) {
        // If the user has no story, create a placeholder for them
        const myStoryPlaceholder = stories.find(s => s.author.handle === profileData.handle);
        if (myStoryPlaceholder) {
            filteredStories.unshift(myStoryPlaceholder);
        }
    }
    
    return filteredStories;
  }, [stories, profileData]);

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
    const primaryEducation = profileData.education.find(e => e.graduationYear);
    const gradYearSuffix = primaryEducation?.graduationYear ? `'${primaryEducation.graduationYear.toString().slice(-2)}` : '';

    addJobListing({
      ...newJob,
      id: Date.now(),
      postedBy: `${profileData.name} ${gradYearSuffix}`.trim(),
      postedByHandle: profileData.handle,
    });
  }
  
  const handleStorySubmit = (fileUrl: string, fileType: 'image' | 'video') => {
    if (!profileData) return;
    setStories(prevStories => {
        const newStories = [...prevStories];
        const userStoryIndex = newStories.findIndex(story => story.author.handle === profileData.handle);
        
        const newStoryItem: StoryItem = {
            id: Date.now(),
            url: fileUrl,
            type: fileType,
            timestamp: Date.now(),
        };

        if (userStoryIndex !== -1) {
            const updatedStory = {
                ...newStories[userStoryIndex],
                items: [...newStories[userStoryIndex].items, newStoryItem]
            };
            newStories[userStoryIndex] = updatedStory;
        } else {
            // This case should ideally not happen if stories are initialized for all members
            const newStory: Story = {
                id: Date.now(),
                author: { name: profileData.name, avatar: profileData.avatar, handle: profileData.handle, aiHint: profileData.aiHint },
                items: [newStoryItem],
                viewers: [],
            };
            newStories.unshift(newStory);
        }
        return newStories;
    });
  };

  const handleStoryClick = (story: Story) => {
    const activeItems = story.items.filter(item => Date.now() - item.timestamp < 24 * 60 * 60 * 1000);
    const isOwnStory = story.author.handle === profileData?.handle;

    if (activeItems.length > 0) {
      setSelectedStory(story);
      setIsStoryViewerOpen(true);
    } else if (isOwnStory) {
      setIsCreateStoryDialogOpen(true);
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

  const handleDeleteStoryItem = (storyId: number, itemId: number) => {
    setStories(prev => prev.map(story => {
        if (story.id === storyId) {
            return {
                ...story,
                items: story.items.filter(item => item.id !== itemId)
            };
        }
        return story;
    }));
  };

  const activePostForComments = feedItems.find(item => item.id === activeCommentPostId);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Stories */}
      <div className="py-4 border-b">
        <div className="px-4 flex items-center space-x-4 overflow-x-auto">
          {storiesForFeed.map((story) => {
            const isOwn = story.author.handle === profileData.handle;
            const activeItems = story.items.filter(item => Date.now() - item.timestamp < 24 * 60 * 60 * 1000);
            const hasActiveStory = activeItems.length > 0;
            
            return (
                <div key={story.id} className="flex-shrink-0 text-center cursor-pointer flex flex-col items-center">
                    <div
                        className={cn(
                            "relative rounded-full p-0.5 border-2 w-20 h-20 flex items-center justify-center",
                            isOwn && !hasActiveStory ? "border-dashed" : (hasActiveStory ? "border-primary" : "border-transparent")
                        )}
                        onClick={() => handleStoryClick(story)}
                    >
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={story.author.avatar} data-ai-hint={story.author.aiHint} />
                            <AvatarFallback>{story.author.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        {isOwn && (
                          <button 
                              className="absolute -bottom-2 -right-1 w-7 h-7 flex items-center justify-center bg-primary rounded-full p-0.5 border-2 border-background" 
                              onClick={(e) => { e.stopPropagation(); setIsCreateStoryDialogOpen(true); }}>
                              <Plus className="w-4 h-4 text-primary-foreground" />
                          </button>
                        )}
                    </div>
                    <p className="text-xs mt-1.5 w-20 truncate" onClick={() => handleStoryClick(story)}>{isOwn ? "Your Story" : story.author.name}</p>
                </div>
            )
          })}
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
      <StoryViewerDialog story={selectedStory} open={isStoryViewerOpen} onOpenChange={setIsStoryViewerOpen} onDeleteStoryItem={handleDeleteStoryItem} currentUserId={profileData?.handle}/>
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
