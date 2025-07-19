
"use client";

import { communityMembers } from "@/lib/data.tsx";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { Badge } from "./ui/badge";

type SharedProfileCardProps = {
  profileId: string; // This will be the user's handle
};

export function SharedProfileCard({ profileId }: SharedProfileCardProps) {
  const profile = communityMembers.find((member) => member.handle === profileId);

  if (!profile) {
    return (
      <Card className="my-2 bg-background/50">
        <CardContent className="p-3">
          <p className="text-sm text-muted-foreground italic">
            This profile could not be found.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Link href={`/profile/${profile.handle}`} className="block my-2">
      <Card className="bg-background/50 border shadow-none hover:shadow-md transition-shadow">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile.avatar} data-ai-hint={profile.aiHint} />
              <AvatarFallback>{profile.fallback}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-sm">{profile.name}</p>
              <p className="text-xs text-muted-foreground truncate">{profile.field} at {profile.company}</p>
              <div className="mt-1">
                <Badge variant="outline">{profile.industry}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
