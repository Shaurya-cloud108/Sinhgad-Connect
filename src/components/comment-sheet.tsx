
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
import { MoreHorizontal, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { FeedItem, Comment, ProfileData } from "@/lib/data.tsx";
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

type CommentSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: FeedItem | undefined;
  onCommentSubmit: (postId: number, commentText: string) => void;
  onCommentDelete: (postId: number, commentId: number) => void;
  currentProfile: ProfileData;
};

export function CommentSheet({
  open,
  onOpenChange,
  post,
  onCommentSubmit,
  onCommentDelete,
  currentProfile,
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
            {post.comments.map((comment) => {
              const canDelete = currentProfile.handle === comment.author.handle || currentProfile.handle === post.author.handle;
              return (
              <div key={comment.id} className="flex items-start gap-3 group">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={comment.author.avatar} />
                  <AvatarFallback>{comment.author.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow bg-muted/50 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{comment.author.name}</p>
                      <p className="text-xs text-muted-foreground">@{comment.author.handle}</p>
                    </div>
                    {canDelete && (
                       <AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
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
                              <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the comment.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onCommentDelete(post.id, comment.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    )}
                  </div>
                  <p className="mt-1 text-sm">{comment.text}</p>
                </div>
              </div>
            )})}
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
              <AvatarImage src={currentProfile.avatar} />
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
