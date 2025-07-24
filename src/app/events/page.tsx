
"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Send, PlusCircle } from "lucide-react";
import { ShareDialog } from "@/components/share-dialog";
import { useState, useContext } from "react";
import { PostEventDialog, EventFormData } from "@/components/post-event-dialog";
import type { Event } from "@/lib/data.tsx";
import { format } from "date-fns";
import { AppContext } from "@/context/AppContext";

export default function EventsPage() {
  const { events, addEvent } = useContext(AppContext);
  const [isPostEventOpen, setIsPostEventOpen] = useState(false);

  const handleEventSubmit = (data: EventFormData) => {
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      title: data.title,
      date: format(data.date, "MMMM d, yyyy"),
      location: data.location,
      description: data.description,
      image: data.image || "https://placehold.co/600x400.png",
      aiHint: "community event"
    };
    addEvent(newEvent);
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div className="text-left mb-4 md:mb-0">
          <h1 className="text-4xl font-headline font-bold">Events & Reunions</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Join us for exciting events, workshops, and get-togethers.
          </p>
        </div>
        <Button className="mt-4 md:mt-0" onClick={() => setIsPostEventOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Host an Event
        </Button>
      </div>

      <PostEventDialog open={isPostEventOpen} onOpenChange={setIsPostEventOpen} onEventSubmit={handleEventSubmit} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-60 w-full">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
                data-ai-hint={event.aiHint}
              />
            </div>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">{event.title}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground gap-4 pt-2">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{event.date}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{event.location}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{event.description}</CardDescription>
            </CardContent>
            <CardFooter className="gap-2">
              <Button className="w-full">
                <Users className="mr-2 h-4 w-4" /> Register Now
              </Button>
              <ShareDialog contentType="event" contentId={event.id}>
                <Button variant="outline" size="icon">
                    <Send className="h-4 w-4"/>
                </Button>
              </ShareDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
