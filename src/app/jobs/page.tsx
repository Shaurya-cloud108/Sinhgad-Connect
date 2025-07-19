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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, MapPin, PlusCircle } from "lucide-react";

const jobListings = [
  {
    title: "Senior Frontend Engineer",
    company: "Innovate Inc.",
    location: "Remote",
    type: "Full-time",
    tags: ["React", "TypeScript", "Next.js"],
    postedBy: "Sunita Narayan '09",
  },
  {
    title: "Data Scientist",
    company: "DataDriven Co.",
    location: "Pune, India",
    type: "Full-time",
    tags: ["Python", "Machine Learning", "SQL"],
    postedBy: "Rajesh Kumar '11",
  },
  {
    title: "Product Manager",
    company: "Connectify",
    location: "Bangalore, India",
    type: "Full-time",
    tags: ["Agile", "Roadmap", "UX"],
    postedBy: "Ananya Deshpande '14",
  },
  {
    title: "UX/UI Designer",
    company: "Creative Solutions",
    location: "Remote",
    type: "Contract",
    tags: ["Figma", "User Research", "Prototyping"],
    postedBy: "Alumni Network",
  },
  {
    title: "DevOps Engineer",
    company: "CloudLeap",
    location: "Hyderabad, India",
    type: "Full-time",
    tags: ["AWS", "Kubernetes", "CI/CD"],
    postedBy: "Amit Singh '15",
  },
  {
    title: "Marketing Intern",
    company: "GrowthX",
    location: "Mumbai, India",
    type: "Internship",
    tags: ["Social Media", "SEO"],
    postedBy: "Alumni Network",
  },
];

export default function JobsPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div className="text-left">
          <h1 className="text-4xl font-headline font-bold">Job Portal</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Exclusive career opportunities from the Sinhgad alumni community.
          </p>
        </div>
        <Button className="mt-4 md:mt-0">
          <PlusCircle className="mr-2 h-4 w-4" /> Post a Job
        </Button>
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
                <Button>View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
