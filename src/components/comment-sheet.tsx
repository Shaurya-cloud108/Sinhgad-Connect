
"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useState } from "react";
import { FeedItem, Comment } from "@/lib/data";

type CommentSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: FeedItem | undefined;
  onCommentSubmit: (postId: number, commentText: string) => void;
  currentUserAvatar: string;
};

export function CommentSheet({
  open,
  onOpenChange,
  post,
  onCommentSubmit,
  currentUserAvatar,
}: CommentSheetProps) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = () => {
    if (newComment.trim() && post) {
      onCommentSubmit(post.id, newComment);
      setNewComment("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  if (!post) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Comments ({post.comments.length})</SheetTitle>
          <SheetDescription>
            Replying to a post by @{post.author.handle}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-grow my-4 pr-6 -mr-6">
          <div className="space-y-6">
            {post.comments.map((comment, index) => (
              <div key={index} className="flex items-start gap-3">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={comment.author.avatar} />
                  <AvatarFallback>{comment.author.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow bg-muted/50 rounded-lg p-3">
                  <p className="font-semibold text-sm">{comment.author.name}</p>
                  <p className="text-xs text-muted-foreground">@{comment.author.handle}</p>
                  <p className="mt-1 text-sm">{comment.text}</p>
                </div>
              </div>
            ))}
            {post.comments.length === 0 && (
                <div className="text-center text-muted-foreground pt-12">
                    <p>No comments yet.</p>
                    <p className="text-xs">Be the first to reply!</p>
                </div>
            )}
          </div>
        </ScrollArea>
        <SheetFooter>
          <div className="flex items-center gap-3 w-full">
            <Avatar className="w-9 h-9">
              <AvatarImage src={currentUserAvatar} />
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <div className="relative w-full">
              <Input
                placeholder="Add a comment..."
                className="pr-12"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-10"
                onClick={handleSubmit}
                disabled={!newComment.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

    