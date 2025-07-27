
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useContext } from "react";
import Image from "next/image";
import { X, ImageIcon } from "lucide-react";
import { AppContext } from "@/context/AppContext";
import { ProfileContext } from "@/context/ProfileContext";
import type { FeedItem } from "@/lib/data";

type CreatePostDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId?: string;
};

export function CreatePostDialog({ open, onOpenChange, groupId }: CreatePostDialogProps) {
  const { toast } = useToast();
  const [postContent, setPostContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { profileData } = useContext(ProfileContext);
  const { addFeedItem } = useContext(AppContext);
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
        id: Date.now(),
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
        comments: [],
        groupId: groupId
    };

    addFeedItem(newPost);
    
    toast({
      title: "Post Successful!",
      description: "Your update has been shared.",
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
              <label htmlFor="image-upload-reusable">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                <Input id="image-upload-reusable" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} ref={imageInputRef} />
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
