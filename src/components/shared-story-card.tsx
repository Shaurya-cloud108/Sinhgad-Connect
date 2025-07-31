
"use client";

import { Card, CardHeader, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";

type SharedStoryCardProps = {
  storyId: string;
};

export function SharedStoryCard({ storyId }: SharedStoryCardProps) {
  const { successStories } = useContext(AppContext);
  const story = successStories.find((item) => item.id === storyId);

  if (!story) {
    return (
      <Card className="my-2 bg-background/50">
        <CardContent className="p-3">
          <p className="text-sm text-muted-foreground italic">
            This success story is no longer available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Link href={`/success-stories/${story.id}`} className="block my-2">
        <Card className="bg-background/50 border shadow-none hover:shadow-md transition-shadow">
        <CardHeader className="p-3 flex-row items-center space-x-3 space-y-0">
            <Avatar className="w-8 h-8">
            <AvatarImage src={story.image} data-ai-hint={story.aiHint} />
            <AvatarFallback>{story.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold text-sm">{story.name}</p>
                <p className="text-xs text-muted-foreground">{story.role}</p>
            </div>
        </CardHeader>
        <CardContent className="p-3 pt-0">
            <p className="text-sm line-clamp-3">{story.story}</p>
        </CardContent>
        </Card>
    </Link>
  );
}
