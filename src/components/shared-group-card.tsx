
"use client";

import { Card, CardHeader, CardContent } from "./ui/card";
import { Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";

type SharedGroupCardProps = {
  groupId: string;
};

export function SharedGroupCard({ groupId }: SharedGroupCardProps) {
  const { groups } = useContext(AppContext);
  const group = groups.find((item) => item.id === groupId);

  if (!group) {
    return (
      <Card className="my-2 bg-background/50">
        <CardContent className="p-3">
          <p className="text-sm text-muted-foreground italic">
            This group is no longer available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Link href={`/groups/${group.id}`} className="block my-2">
        <Card className="bg-background/50 border shadow-none hover:shadow-md transition-shadow">
            <CardContent className="p-3">
                <div className="flex gap-3">
                    <Image
                        src={group.banner}
                        alt={group.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover w-20 h-20"
                        data-ai-hint={group.aiHint}
                    />
                    <div className="space-y-1">
                        <p className="font-semibold text-sm line-clamp-2">{group.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Users className="h-3 w-3" />{group.members.length} members</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    </Link>
  );
}
