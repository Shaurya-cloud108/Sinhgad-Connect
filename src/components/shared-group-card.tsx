
"use client";

// This component has been removed as the networking page was removed.
// The component is kept for now to avoid breaking existing message shares.

import { Card, CardContent } from "./ui/card";
import { Users } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

type SharedGroupCardProps = {
  groupId: string; // This will be the group title
};

export function SharedGroupCard({ groupId }: SharedGroupCardProps) {
  const { setSelectedConversationByName } = useContext(AppContext);
  const router = useRouter();

  const handleGoToChat = () => {
    setSelectedConversationByName(groupId);
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
                    <p className="font-semibold text-sm line-clamp-1">{groupId}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">Shared group chat.</p>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
