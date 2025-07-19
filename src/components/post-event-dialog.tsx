
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";
import Image from "next/image";
import { X, Calendar as CalendarIcon, Upload } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const postEventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  location: z.string().min(3, "Location must be at least 3 characters long."),
  date: z.date({
    required_error: "A date for the event is required.",
  }),
  description: z.string().min(20, "Description must be at least 20 characters long."),
  image: z.string().optional(),
});

export type EventFormData = z.infer<typeof postEventSchema>;

type PostEventDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventSubmit: (data: EventFormData) => void;
};

export function PostEventDialog({ open, onOpenChange, onEventSubmit }: PostEventDialogProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EventFormData>({
    resolver: zodResolver(postEventSchema),
    defaultValues: {
      title: "",
      location: "",
      description: "",
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue("image", result);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(values: EventFormData) {
    onEventSubmit(values);
    toast({
      title: "Event Posted!",
      description: "Your event has been shared with the community.",
    });
    form.reset();
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">Host a New Event</DialogTitle>
          <DialogDescription>
            Fill out the details below to create an event for the community.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Annual Tech Conference" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Pune or Virtual" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the event, agenda, speakers, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div>
                <FormLabel>Event Image (Optional)</FormLabel>
                {imagePreview ? (
                    <div className="mt-2 relative">
                    <Image src={imagePreview} alt="Image preview" className="rounded-lg w-full aspect-video object-cover" width={400} height={225} />
                    <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => {
                        setImagePreview(null);
                        form.setValue("image", undefined);
                         if (imageInputRef.current) imageInputRef.current.value = "";
                    }}>
                        <X className="h-4 w-4" />
                    </Button>
                    </div>
                ) : (
                    <div className="mt-2 flex items-center justify-center w-full">
                        <label htmlFor="event-image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground">Click to upload an event banner</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG (MAX. 800x400px)</p>
                            </div>
                            <Input id="event-image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} ref={imageInputRef} />
                        </label>
                    </div> 
                )}
             </div>
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit">Post Event</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
