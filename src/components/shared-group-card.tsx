
"use client";

import { networkingGroups } from "@/lib/data.tsx";
import { Card, CardContent } from "./ui/card";
import { Users } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

type SharedGroupCardProps = {
  groupId: string; // This will be the group title
};

export function SharedGroupCard({ groupId }: SharedGroupCardProps) {
  const group = networkingGroups.find((item) => item.title === groupId);
  const { setSelectedConversationByName } = useContext(AppContext);
  const router = useRouter();

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

  const handleGoToChat = () => {
    setSelectedConversationByName(group.title);
    router.push('/messages');
  }

  return (
    <Card className="bg-background/50 border shadow-none hover:shadow-md transition-shadow cursor-pointer" onClick={handleGoToChat}>
        <CardContent className="p-3">
            <div className="flex gap-3">
                <div className="p-2 bg-muted rounded-md flex-shrink-0">
                    <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-1 overflow-hidden">
                    <p className="font-semibold text-sm line-clamp-1">{group.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{group.description}</p>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
