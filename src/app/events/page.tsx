
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
import { Calendar, MapPin, Users, Send, PlusCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { ShareDialog } from "@/components/share-dialog";
import { useState, useContext, useEffect, useMemo } from "react";
import { PostEventDialog, EventFormData } from "@/components/post-event-dialog";
import type { Event } from "@/lib/data.tsx";
import { format, isPast } from "date-fns";
import { AppContext } from "@/context/AppContext";
import { ProfileContext } from "@/context/ProfileContext";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function EventsPage() {
  const { events, addEvent, updateEvent, deleteEvent } = useContext(AppContext);
  const { profileData } = useContext(ProfileContext);
  const { toast } = useToast();

  const [isPostEventOpen, setIsPostEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);

  const searchParams = useSearchParams();

  const upcomingEvents = useMemo(() => {
    // Filter out events that are in the past
    return events.filter(event => !isPast(new Date(event.date)));
  }, [events]);

  useEffect(() => {
    const eventFragment = window.location.hash;
    if (eventFragment) {
        const element = document.getElementById(eventFragment.substring(1));
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('bg-primary/10', 'transition-all', 'duration-1000');
                setTimeout(() => {
                    element.classList.remove('bg-primary/10');
                }, 2000);
            }, 100);
        }
    }
  }, [searchParams]);

  const handleEventSubmit = (data: EventFormData) => {
    if (!profileData) return;
    const newEvent: Omit<Event, 'id'> = {
      title: data.title,
      date: data.date.toISOString(),
      location: data.location,
      description: data.description,
      image: data.image || "https://placehold.co/600x400.png",
      aiHint: "community event",
      registrationUrl: data.registrationUrl,
      postedByHandle: profileData.handle,
    };
    addEvent(newEvent);
    toast({ title: "Event Posted!", description: "Your event has been shared." });
  };
  
  const handleEventUpdate = (data: EventFormData) => {
    if (!eventToEdit) return;
    const updatedEvent: Event = {
        ...eventToEdit,
        ...data,
        date: data.date.toISOString(),
    };
    updateEvent(updatedEvent);
    toast({ title: "Event Updated!", description: "Your event details have been saved." });
  };
  
  const handleEditClick = (event: Event) => {
      setEventToEdit(event);
      setIsEditEventOpen(true);
  }

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
    toast({
        title: "Event Deleted",
        description: "The event has been removed from the portal.",
        variant: "destructive",
    });
  }

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
      {eventToEdit && (
        <PostEventDialog 
            open={isEditEventOpen} 
            onOpenChange={setIsEditEventOpen} 
            onEventSubmit={handleEventUpdate}
            event={eventToEdit}
            isEditMode={true}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {upcomingEvents.map((event) => {
          const isOwnEvent = profileData?.handle === event.postedByHandle;
          return (
            <Card key={event.id} id={`event-${event.id}`} className="overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
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
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-headline text-2xl">{event.title}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground gap-4 pt-2">
                      <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{format(new Date(event.date), 'MMMM d, yyyy')}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{event.location}</span>
                    </div>
                  </div>
                  {isOwnEvent && (
                    <AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(event)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Event
                          </DropdownMenuItem>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive cursor-pointer">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Event
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your event.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteEvent(event.id)}>
                            Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{event.description}</CardDescription>
              </CardContent>
              <CardFooter className="gap-2">
                  <Button className="w-full" asChild={!!event.registrationUrl} disabled={!event.registrationUrl}>
                    {event.registrationUrl ? (
                      <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <Users className="mr-2 h-4 w-4" /> Register Now
                      </a>
                    ) : (
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" /> Register Now
                      </div>
                    )}
                  </Button>
                <ShareDialog contentType="event" contentId={event.id}>
                  <Button variant="outline" size="icon">
                      <Send className="h-4 w-4"/>
                  </Button>
                </ShareDialog>
              </CardFooter>
            </Card>
        )})}
      </div>
      {upcomingEvents.length === 0 && (
        <Card className="text-center p-12 text-muted-foreground">
          <p className="font-semibold">No upcoming events</p>
          <p>Check back later or host your own event!</p>
        </Card>
      )}
    </div>
  );
}
