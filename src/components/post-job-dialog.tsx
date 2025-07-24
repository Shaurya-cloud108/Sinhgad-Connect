
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { JobListing } from "@/lib/data.tsx";

const postJobSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters."),
  company: z.string().min(2, "Company name must be at least 2 characters."),
  location: z.string().min(2, "Location must be at least 2 characters."),
  type: z.enum(["Full-time", "Contract", "Internship"]),
  applicationUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  description: z.string().min(10, "Description must be at least 10 characters."),
  tags: z.array(z.string()).optional(),
});

type PostJobDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobSubmit: (job: Omit<JobListing, 'id' | 'postedBy' | 'postedByHandle'>) => void;
};

export function PostJobDialog({ open, onOpenChange, onJobSubmit }: PostJobDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof postJobSchema>>({
    resolver: zodResolver(postJobSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      type: "Full-time",
      applicationUrl: "",
      description: "",
      tags: [],
    },
  });

  function onSubmit(values: z.infer<typeof postJobSchema>) {
    onJobSubmit(values);
    toast({
      title: "Job Posted!",
      description: "Your job listing has been submitted successfully.",
    });
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">Post a New Job</DialogTitle>
          <DialogDescription>
            Fill out the details below to share an opportunity with the community.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Senior Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Innovate Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Pune, India or Remote" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="applicationUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Posting URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/careers/job-id" {...field} />
                  </FormControl>
                   <FormDescription>
                    Provide the direct link to the job posting page.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the role and responsibilities..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit">Post Job</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
