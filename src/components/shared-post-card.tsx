
"use client";

import { initialFeedItems } from "@/lib/data.tsx";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";
import Link from "next/link";

type SharedPostCardProps = {
  postId: number;
};

export function SharedPostCard({ postId }: SharedPostCardProps) {
  // NOTE: This uses static data. In a real app, you'd fetch this from a context or API.
  const post = initialFeedItems.find((item) => item.id === postId);

  if (!post) {
    return (
      <Card className="my-2 bg-background/50">
        <CardContent className="p-3">
          <p className="text-sm text-muted-foreground italic">
            This post is no longer available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Link href={`/?postId=${postId}`} className="block my-2">
        <Card className="bg-background/50 border shadow-none hover:shadow-md transition-shadow">
        <CardHeader className="p-3 flex-row items-center space-x-3 space-y-0">
            <Avatar className="w-8 h-8">
            <AvatarImage src={post.author.avatar} data-ai-hint={post.author.aiHint} />
            <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
            <p className="font-semibold text-sm">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">@{post.author.handle}</p>
            </div>
        </CardHeader>
        <CardContent className="p-3 pt-0">
            <p className="text-sm mb-2 line-clamp-3">{post.content}</p>
            {post.image && (
            <div className="w-full aspect-video bg-card rounded-md overflow-hidden">
                <Image
                src={post.image}
                alt="Feed item"
                className="w-full h-full object-cover"
                data-ai-hint={post.aiHint}
                width={300}
                height={169}
                />
            </div>
            )}
        </CardContent>
        </Card>
    </Link>
  );
}
