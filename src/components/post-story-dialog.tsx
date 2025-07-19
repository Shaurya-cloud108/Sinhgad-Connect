
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
import { X, Upload } from "lucide-react";

const postStorySchema = z.object({
  headline: z.string().min(5, "Headline must be at least 5 characters long."),
  story: z.string().min(20, "Story must be at least 20 characters long."),
  tags: z.string().optional(),
  image: z.string().optional(),
});

export type StoryFormData = z.infer<typeof postStorySchema>;

type PostStoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStorySubmit: (data: StoryFormData) => void;
};

export function PostStoryDialog({ open, onOpenChange, onStorySubmit }: PostStoryDialogProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<StoryFormData>({
    resolver: zodResolver(postStorySchema),
    defaultValues: {
      headline: "",
      story: "",
      tags: "",
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

  function onSubmit(values: StoryFormData) {
    onStorySubmit(values);
    toast({
      title: "Story Posted!",
      description: "Your success story has been shared with the community.",
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
          <DialogTitle className="font-headline">Share Your Success Story</DialogTitle>
          <DialogDescription>
            Inspire others by sharing your journey and achievements.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="headline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Headline / Current Role</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Founder at StartupX, Forbes 30 Under 30" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="story"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Story</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="Share your journey, key achievements, and what you're proud of." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Entrepreneurship, AI/ML, Social Impact" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div>
                <FormLabel>Your Photo (Optional)</FormLabel>
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
                        <label htmlFor="story-image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground">Click to upload a photo</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG (MAX. 800x400px)</p>
                            </div>
                            <Input id="story-image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} ref={imageInputRef} />
                        </label>
                    </div>
                )}
             </div>
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit">Post Story</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
