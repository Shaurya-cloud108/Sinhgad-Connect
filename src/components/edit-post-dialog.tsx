
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState, useContext, useEffect } from "react";
import { MapPin } from "lucide-react";
import { AppContext } from "@/context/AppContext";
import { ProfileContext } from "@/context/ProfileContext";
import type { FeedItem } from "@/lib/data";

export type PostEditFormData = {
  content: string;
  location: string;
};

type EditPostDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostUpdate: (data: PostEditFormData) => void;
  post: FeedItem;
};

export function EditPostDialog({ open, onOpenChange, onPostUpdate, post }: EditPostDialogProps) {
  const { toast } = useToast();
  const [postContent, setPostContent] = useState(post.content);
  const [location, setLocation] = useState(post.location || "");

  useEffect(() => {
    setPostContent(post.content);
    setLocation(post.location || "");
  }, [post]);
  
  const handleSubmit = () => {
    if (!postContent.trim()) {
      toast({
        variant: "destructive",
        title: "Empty Post",
        description: "Post content cannot be empty.",
      });
      return;
    }
    
    onPostUpdate({ content: postContent, location });
    
    toast({
      title: "Post Updated!",
      description: "Your changes have been saved.",
    });

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Make changes to your post below. You cannot change the image after posting.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Textarea
            placeholder="Share an achievement or ask a question..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            rows={5}
          />
           <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Add a location..."
                className="pl-10"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
        </div>
        <DialogFooter>
           <div className="flex items-center gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleSubmit}>Save Changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    