
"use client";

import { eventsData } from "@/lib/data.tsx";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type SharedEventCardProps = {
  eventId: string;
};

export function SharedEventCard({ eventId }: SharedEventCardProps) {
  const event = eventsData.find((item) => item.id === eventId);

  if (!event) {
    return (
      <Card className="my-2 bg-background/50">
        <CardContent className="p-3">
          <p className="text-sm text-muted-foreground italic">
            This event is no longer available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Link href={`/events`} className="block my-2">
        <Card className="bg-background/50 border shadow-none hover:shadow-md transition-shadow">
            <CardContent className="p-3">
                <div className="flex gap-3">
                    <Image
                        src={event.image}
                        alt={event.title}
                        width={80}
                        height={80}
                        className="rounded-md object-cover w-20 h-20"
                        data-ai-hint={event.aiHint}
                    />
                    <div className="space-y-1">
                        <p className="font-semibold text-sm line-clamp-2">{event.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3 w-3" />{event.date}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3 w-3" />{event.location}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    </Link>
  );
}
