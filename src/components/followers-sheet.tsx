
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { Button } from "./ui/button";

type FollowersSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: 'Followers' | 'Following';
  userHandles: string[];
};

export function FollowersSheet({ open, onOpenChange, title, userHandles }: FollowersSheetProps) {
  const { communityMembers } = useContext(AppContext);

  const usersToShow = communityMembers.filter(member => userHandles.includes(member.handle));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{usersToShow.length} {usersToShow.length === 1 ? 'person' : 'people'}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100%-80px)] my-4 pr-6 -mr-6">
          <div className="space-y-4">
            {usersToShow.map((user) => (
              <div key={user.handle} className="flex items-center justify-between">
                <Link href={`/profile/${user.handle}`} className="flex items-center gap-3 group" onClick={() => onOpenChange(false)}>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} data-ai-hint={user.aiHint} />
                    <AvatarFallback>{user.fallback}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm group-hover:underline">{user.name}</p>
                    <p className="text-xs text-muted-foreground">@{user.handle}</p>
                  </div>
                </Link>
                {/* Optional: Add follow/unfollow button here if needed in the future */}
              </div>
            ))}
             {usersToShow.length === 0 && (
                <div className="text-center text-muted-foreground pt-12">
                    <p>No one to see here.</p>
                </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

    