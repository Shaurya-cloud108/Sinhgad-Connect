"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, MapPin, PlusCircle, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const jobListings = [
  {
    title: "Senior Frontend Engineer",
    company: "Innovate Inc.",
    location: "Remote",
    type: "Full-time",
    tags: ["React", "TypeScript", "Next.js"],
    postedBy: "Sunita Narayan '09",
    description: "Innovate Inc. is seeking a passionate Senior Frontend Engineer to build and scale our next-generation sustainable tech products. You will work with a modern tech stack and a talented team to create beautiful, responsive, and high-performance web applications."
  },
  {
    title: "Data Scientist",
    company: "DataDriven Co.",
    location: "Pune, India",
    type: "Full-time",
    tags: ["Python", "Machine Learning", "SQL"],
    postedBy: "Rajesh Kumar '11",
    description: "Join DataDriven Co. and help us solve complex problems with data. As a Data Scientist, you will be responsible for designing and implementing machine learning models, performing statistical analysis, and communicating insights to stakeholders."
  },
  {
    title: "Product Manager",
    company: "Connectify",
    location: "Bangalore, India",
    type: "Full-time",
    tags: ["Agile", "Roadmap", "UX"],
    postedBy: "Ananya Deshpande '14",
    description: "Connectify is looking for a user-centric Product Manager to lead our product strategy and roadmap. You will work closely with engineering, design, and marketing to deliver products that our users love."
  },
  {
    title: "UX/UI Designer",
    company: "Creative Solutions",
    location: "Remote",
    type: "Contract",
    tags: ["Figma", "User Research", "Prototyping"],
    postedBy: "Alumni Network",
    description: "We are looking for a talented UX/UI Designer to create amazing user experiences. The ideal candidate will have a strong portfolio of design projects and be proficient in Figma, user research, and prototyping."
  },
  {
    title: "DevOps Engineer",
    company: "CloudLeap",
    location: "Hyderabad, India",
    type: "Full-time",
    tags: ["AWS", "Kubernetes", "CI/CD"],
    postedBy: "Amit Singh '15",
    description: "CloudLeap is hiring a DevOps Engineer to manage and improve our cloud infrastructure. You will be responsible for our CI/CD pipelines, automation, and ensuring the reliability and scalability of our systems."
  },
  {
    title: "Marketing Intern",
    company: "GrowthX",
    location: "Mumbai, India",
    type: "Internship",
    tags: ["Social Media", "SEO"],
    postedBy: "Alumni Network",
    description: "Gain hands-on experience in digital marketing with GrowthX! This internship will give you exposure to social media marketing, SEO, content creation, and campaign analysis. A great opportunity for aspiring marketers."
  },
];

type JobListing = typeof jobListings[0];

const postJobSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters."),
  company: z.string().min(2, "Company name must be at least 2 characters."),
  location: z.string().min(2, "Location must be at least 2 characters."),
  type: z.enum(["Full-time", "Contract", "Internship"]),
  description: z.string().min(20, "Description must be at least 20 characters."),
});

export default function JobsPage() {
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof postJobSchema>>({
    resolver: zodResolver(postJobSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      type: "Full-time",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof postJobSchema>) {
    console.log(values);
    toast({
      title: "Job Posted!",
      description: "Your job listing has been submitted successfully.",
    });
    form.reset();
    setIsPostJobOpen(false);
  }

  function handleViewDetails(job: JobListing) {
    setSelectedJob(job);
    setIsViewDetailsOpen(true);
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div className="text-left">
          <h1 className="text-4xl font-headline font-bold">Job Portal</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Exclusive career opportunities from the Sinhgad alumni community.
          </p>
        </div>
        <Dialog open={isPostJobOpen} onOpenChange={setIsPostJobOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0">
              <PlusCircle className="mr-2 h-4 w-4" /> Post a Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
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
                 <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Post Job</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Search jobs or companies..." />
               <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
               <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                   <SelectItem value="mumbai">Mumbai</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full">Apply Filters</Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3 space-y-6">
          {jobListings.map((job) => (
            <Card key={job.title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-headline text-xl">{job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {job.company}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                    </CardDescription>
                  </div>
                  <Badge variant={job.type === 'Full-time' ? 'default' : 'secondary'}>{job.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                <p>Posted by: <span className="text-primary font-medium">{job.postedBy}</span></p>
                <Button onClick={() => handleViewDetails(job)}>View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {/* View Job Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
            {selectedJob && (
                <>
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">{selectedJob.title}</DialogTitle>
                        <DialogDescription className="flex items-center gap-4 pt-2">
                            <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {selectedJob.company}</span>
                            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {selectedJob.location}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4 text-sm text-muted-foreground">
                       <div className="flex flex-wrap gap-2">
                          {selectedJob.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                        <p>{selectedJob.description}</p>
                        <p className="text-xs">Posted by: <span className="text-primary font-medium">{selectedJob.postedBy}</span></p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
                         <Button>
                            Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                    </DialogFooter>
                </>
            )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
