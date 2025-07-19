
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
import { Heart, MessageCircle, Send, Plus, Image as ImageIcon, Video, Briefcase, Award } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const stories = [
  { name: "Your Story", avatar: "https://placehold.co/100x100.png", isOwn: true, aiHint: "plus icon" },
  { name: "Priya S.", avatar: "https://placehold.co/100x100.png", aiHint: "professional woman" },
  { name: "Rohan V.", avatar: "https://placehold.co/100x100.png", aiHint: "professional man" },
  { name: "Anjali M.", avatar: "https://placehold.co/100x100.png", aiHint: "corporate woman" },
  { name: "Vikram S.", avatar: "https://placehold.co/100x100.png", aiHint: "corporate man" },
  { name: "Sneha R.", avatar: "https://placehold.co/100x100.png", aiHint: "young professional" },
];

const feedItems = [
  {
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
  }
];

function CreatePostDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
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
    console.log("Posting content:", postContent);
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


export default function Home() {
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Stories */}
      <div className="py-4 border-b">
        <div className="px-4 flex items-center space-x-4 overflow-x-auto">
          {stories.map((story) => (
            <div key={story.name} className="flex-shrink-0 text-center">
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

      <CreatePostDialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen} />

      {/* Feed */}
      <div className="space-y-4 py-4">
        {feedItems.map((item, index) => (
          <Card key={index} className="rounded-none md:rounded-lg shadow-none md:shadow-sm border-l-0 border-r-0 md:border">
            <CardHeader className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={item.author.avatar} data-ai-hint={item.author.aiHint} />
                  <AvatarFallback>{item.author.name.substring(0,2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{item.author.name}</p>
                  <p className="text-xs text-muted-foreground">{item.author.handle}</p>
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

    