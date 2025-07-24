
"use client";

import { useState, useEffect, useContext } from "react";
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
import { Briefcase, MapPin, PlusCircle, ExternalLink, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { JobListing } from "@/lib/data.tsx";
import { ShareDialog } from "@/components/share-dialog";
import { PostJobDialog } from "@/components/post-job-dialog";
import { AppContext } from "@/context/AppContext";
import { ProfileContext } from "@/context/ProfileContext";
import Link from "next/link";
import { communityMembers } from "@/lib/data.tsx";

function JobsPageContent() {
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const { jobListings, addJobListing } = useContext(AppContext);
  const { profileData } = useContext(ProfileContext);

  const [filteredJobListings, setFilteredJobListings] = useState<JobListing[]>(jobListings);

  const [searchQuery, setSearchQuery] = useState('');
  const [jobType, setJobType] = useState<string>('all');
  const [location, setLocation] = useState<string>('all');

  useEffect(() => {
    let results = jobListings;
    const lowercasedQuery = searchQuery.toLowerCase();

    if (searchQuery) {
        results = results.filter(job => 
            job.title.toLowerCase().includes(lowercasedQuery) ||
            job.company.toLowerCase().includes(lowercasedQuery)
        );
    }
    if (jobType && jobType !== 'all') {
        results = results.filter(job => job.type === jobType);
    }
    if (location && location !== 'all') {
        results = results.filter(job => job.location.toLowerCase().includes(location.toLowerCase()));
    }
    setFilteredJobListings(results);
  }, [searchQuery, jobType, location, jobListings]);


  function handleJobSubmit(values: Omit<JobListing, 'id' | 'postedBy' | 'postedByHandle'>) {
    if (!profileData) return;
    const primaryEducation = profileData.education.find(e => e.graduationYear);
    const gradYearSuffix = primaryEducation?.graduationYear ? `'${primaryEducation.graduationYear.toString().slice(-2)}` : '';

    const newJob: JobListing = {
        id: Date.now(),
        ...values,
        postedBy: `${profileData.name} ${gradYearSuffix}`.trim(),
        postedByHandle: profileData.handle
    };
    addJobListing(newJob);
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
        <Button className="mt-4 md:mt-0" onClick={() => setIsPostJobOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Post a Job
        </Button>
        <PostJobDialog open={isPostJobOpen} onOpenChange={setIsPostJobOpen} onJobSubmit={handleJobSubmit} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Search jobs or companies..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
               <Select onValueChange={setJobType} defaultValue={jobType}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
               <Select onValueChange={setLocation} defaultValue={location}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                   <SelectItem value="mumbai">Mumbai</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3 space-y-6">
          {filteredJobListings.length > 0 ? (
            filteredJobListings.map((job, index) => {
              const poster = communityMembers.find(m => m.handle === job.postedByHandle);
              return (
                <Card key={`${job.id}-${index}`} className="hover:shadow-md transition-shadow">
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
                      {job.tags && job.tags.map((tag) => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                    <p>Posted by: 
                      {poster ? (
                        <Link href={`/profile/${poster.handle}`} className="text-primary font-medium hover:underline ml-1">{job.postedBy}</Link>
                      ) : (
                        <span className="text-primary font-medium ml-1">{job.postedBy}</span>
                      )}
                    </p>
                    <div className="flex items-center gap-2">
                        <ShareDialog contentType="job" contentId={job.id}>
                            <Button variant="ghost" size="icon">
                                <Send className="h-4 w-4" />
                            </Button>
                        </ShareDialog>
                        <Button onClick={() => handleViewDetails(job)}>View Details</Button>
                    </div>
                  </CardFooter>
                </Card>
            )})
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">No jobs found matching your criteria.</p>
              </CardContent>
            </Card>
          )}
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
                          {selectedJob.tags && selectedJob.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                        <p>{selectedJob.description}</p>
                        <p className="text-xs">Posted by: 
                          <Link href={`/profile/${selectedJob.postedByHandle}`} className="text-primary font-medium hover:underline ml-1">{selectedJob.postedBy}</Link>
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
                         {selectedJob.applicationUrl && (
                          <Button asChild>
                            <a href={selectedJob.applicationUrl} target="_blank" rel="noopener noreferrer">
                              Explore <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        )}
                    </DialogFooter>
                </>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function JobsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
        <div className="container py-8 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div className="space-y-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-6 w-96" />
            </div>
            <Skeleton className="h-10 w-32 mt-4 md:mt-0" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Skeleton className="col-span-1 h-64" />
            <div className="md:col-span-3 space-y-6">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      );
  }

  return <JobsPageContent />;
}
