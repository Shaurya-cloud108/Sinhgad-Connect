
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
import { Heart, MessageCircle, Send, Plus, Image as ImageIcon, Award, Briefcase, X, MoreHorizontal, Trash2 } from "lucide-react";
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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { stories as initialStories, feedItems as initialFeedItems, FeedItem, Story, profileData as initialProfileData, ProfileData } from "@/lib/data";
import Image from "next/image";

function CreatePostDialog({ open, onOpenChange, onPostSubmit }: { open: boolean, onOpenChange: (open: boolean) => void, onPostSubmit: (post: FeedItem) => void }) {
  const { toast } = useToast();
  const [postContent, setPostContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    
    const newPost: FeedItem = {
        id: Date.now(), // Simple unique ID
        author: {
            name: "Priya Sharma",
            avatar: "https://placehold.co/100x100.png",
            handle: "priya-sharma-09",
            aiHint: "professional woman"
        },
        content: postContent,
        image: imagePreview,
        aiHint: "user uploaded",
        likes: 0,
        comments: 0
    };

    onPostSubmit(newPost);
    
    toast({
      title: "Post Successful!",
      description: "Your update has been shared with the network.",
    });

    setPostContent("");
    setImagePreview(null);
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
              <img src={imagePreview} alt="Image preview" className="rounded-lg w-full" />
               <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => setImagePreview(null)}>
                 <Plus className="h-4 w-4 rotate-45" />
               </Button>
            </div>
          )}
        </div>
        <DialogFooter className="justify-between sm:justify-between">
           <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
              <label htmlFor="image-upload">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                <Input id="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
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

function StoryViewerDialog({ story, open, onOpenChange }: { story: Story | null; open: boolean; onOpenChange: (open: boolean) => void; }) {
  if (!story) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 border-0 max-w-md w-full h-[80vh] bg-black">
        <div className="relative w-full h-full rounded-lg overflow-hidden">
          <Image src={story.image} alt={`Story from ${story.name}`} layout="fill" objectFit="cover" data-ai-hint={story.aiHint} />
          <div className="absolute top-0 left-0 p-4 flex items-center gap-3 bg-gradient-to-b from-black/50 to-transparent w-full">
            <Avatar>
              <AvatarImage src={story.avatar} />
              <AvatarFallback>{story.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="font-semibold text-white">{story.name}</span>
          </div>
          <DialogClose className="absolute right-2 top-2 text-white">
            <X />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}


export default function Home() {
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [feedItems, setFeedItems] = useState<FeedItem[]>(initialFeedItems);
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);

  const handlePostSubmit = (newPost: FeedItem) => {
    setFeedItems(prev => [newPost, ...prev]);
  };
  
  const handleStoryClick = (story: Story) => {
    if (story.isOwn) {
      // This is a placeholder for creating a story, we'll open the post dialog for now
      setIsPostDialogOpen(true);
    } else {
      setSelectedStory(story);
      setIsStoryViewerOpen(true);
    }
  };

  const handleDeletePost = (postId: number) => {
    setFeedItems(prev => prev.filter(item => item.id !== postId));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Stories */}
      <div className="py-4 border-b">
        <div className="px-4 flex items-center space-x-4 overflow-x-auto">
          {stories.map((story) => (
            <div key={story.name} className="flex-shrink-0 text-center cursor-pointer" onClick={() => handleStoryClick(story)}>
              <div className={`relative rounded-full p-0.5 border-2 ${story.isOwn ? 'border-dashed' : 'border-primary'}`}>
                <Avatar className="w-16 h-16">
                  <AvatarImage src={story.avatar} data-ai-hint={story.aiHint} />
                  <AvatarFallback>{story.name.substring(0,2)}</AvatarFallback>
                  {story.isOwn && (
                    <div className="absolute bottom-0 right-0 bg-primary rounded-full p-0.5 border-2 border-background">
                      <Plus className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </Avatar>
              </div>
              <p className="text-xs mt-1.5">{story.name}</p>
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
                <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="user avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <button
                className="w-full text-left bg-muted/50 hover:bg-muted/80 transition-colors py-2 px-4 rounded-full text-sm text-muted-foreground"
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
               <Button variant="ghost" className="w-full" onClick={() => setIsPostDialogOpen(true)}>
                <Briefcase className="text-blue-500" />
                Job
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreatePostDialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen} onPostSubmit={handlePostSubmit} />
      <StoryViewerDialog story={selectedStory} open={isStoryViewerOpen} onOpenChange={setIsStoryViewerOpen} />

      {/* Feed */}
      <div className="space-y-4 py-4">
        {feedItems.map((item) => (
          <Card key={item.id} className="rounded-none md:rounded-lg shadow-none md:shadow-sm border-l-0 border-r-0 md:border">
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
                          <DropdownMenuItem className="text-destructive">
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
                   <img src={item.image} alt="Feed item" className="w-full h-full object-cover" data-ai-hint={item.aiHint} />
                </div>
              )}
            </CardContent>
            <CardFooter className="p-4 flex flex-col items-start space-y-3">
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
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
