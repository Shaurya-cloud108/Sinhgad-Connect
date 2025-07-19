import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Linkedin } from "lucide-react";

const alumniData = [
  {
    name: "Priya Sharma",
    avatar: "https://placehold.co/100x100.png",
    fallback: "PS",
    graduationYear: 2010,
    field: "Computer Engineering",
    industry: "Technology",
    company: "Google",
    location: "San Francisco, CA",
    aiHint: "professional woman"
  },
  {
    name: "Rohan Verma",
    avatar: "https://placehold.co/100x100.png",
    fallback: "RV",
    graduationYear: 2012,
    field: "Mechanical Engineering",
    industry: "Automotive",
    company: "Tesla",
    location: "Austin, TX",
    aiHint: "professional man"
  },
  {
    name: "Anjali Mehta",
    avatar: "https://placehold.co/100x100.png",
    fallback: "AM",
    graduationYear: 2015,
    field: "Electronics & Telecommunication",
    industry: "Telecommunications",
    company: "Verizon",
    location: "New York, NY",
    aiHint: "corporate woman"
  },
  {
    name: "Vikram Singh",
    avatar: "https://placehold.co/100x100.png",
    fallback: "VS",
    graduationYear: 2008,
    field: "Information Technology",
    industry: "Finance",
    company: "Goldman Sachs",
    location: "London, UK",
    aiHint: "corporate man"
  },
  {
    name: "Sneha Reddy",
    avatar: "https://placehold.co/100x100.png",
    fallback: "SR",
    graduationYear: 2018,
    field: "Computer Engineering",
    industry: "E-commerce",
    company: "Amazon",
    location: "Seattle, WA",
    aiHint: "young professional"
  },
  {
    name: "Amit Patel",
    avatar: "https://placehold.co/100x100.png",
    fallback: "AP",
    graduationYear: 2013,
    field: "Civil Engineering",
    industry: "Construction",
    company: "L&T Construction",
    location: "Mumbai, India",
    aiHint: "engineer man"
  },
];

export default function DirectoryPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold">Alumni Directory</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find and connect with fellow graduates from around the world.
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            <Input placeholder="Search by name, company..." />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="automotive">Automotive</SelectItem>
                <SelectItem value="telecommunications">Telecommunications</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="e-commerce">E-commerce</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2010">2010</SelectItem>
                <SelectItem value="2012">2012</SelectItem>
                <SelectItem value="2015">2015</SelectItem>
                <SelectItem value="2008">2008</SelectItem>
                <SelectItem value="2018">2018</SelectItem>
                <SelectItem value="2013">2013</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full">Search</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {alumniData.map((alumni) => (
          <Card key={alumni.name} className="flex flex-col">
            <CardHeader className="items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={alumni.avatar} data-ai-hint={alumni.aiHint} />
                <AvatarFallback>{alumni.fallback}</AvatarFallback>
              </Avatar>
              <CardTitle className="font-headline">{alumni.name}</CardTitle>
              <CardDescription>
                {alumni.field}, Class of {alumni.graduationYear}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow text-center">
              <p className="font-semibold">{alumni.company}</p>
              <p className="text-sm text-muted-foreground">{alumni.location}</p>
              <div className="mt-4">
                <Badge>{alumni.industry}</Badge>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="outline">
                <Linkedin className="mr-2 h-4 w-4" /> Connect
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
