
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
import { Calendar, MapPin, Users, Send } from "lucide-react";
import { ShareDialog } from "@/components/share-dialog";

const eventsData = [
  {
    id: "annual-meet-2024",
    title: "Annual Alumni Grand Meet 2024",
    date: "October 25, 2024",
    location: "College Auditorium, Pune",
    description: "The flagship event of the year! Reconnect with old friends, network with peers, and relive your college days.",
    image: "https://placehold.co/600x400.png",
    aiHint: "people networking"
  },
  {
    id: "tech-talk-ai",
    title: "Tech Talk: AI & The Future",
    date: "November 12, 2024",
    location: "Virtual Event (Zoom)",
    description: "Join us for an insightful session with industry experts on the future of Artificial Intelligence.",
    image: "https://placehold.co/600x400.png",
    aiHint: "technology conference"
  },
  {
    id: "reunion-2014",
    title: "Batch of 2014: 10-Year Reunion",
    date: "December 7, 2024",
    location: "The Westin, Pune",
    description: "A special evening for the class of 2014 to celebrate a decade of memories and achievements.",
    image: "https://placehold.co/600x400.png",
    aiHint: "formal dinner"
  },
  {
    id: "sports-day-2025",
    title: "Alumni Sports Day",
    date: "January 18, 2025",
    location: "College Sports Complex",
    description: "Get ready for some friendly competition in cricket, football, and more. Fun for the whole family!",
    image: "https://placehold.co/600x400.png",
    aiHint: "outdoor sports"
  },
];

export default function EventsPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold">Events & Reunions</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Join us for exciting events, workshops, and get-togethers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {eventsData.map((event) => (
          <Card key={event.title} className="overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-60 w-full">
              <Image
                src={event.image}
                alt={event.title}
                layout="fill"
                objectFit="cover"
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
