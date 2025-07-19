
"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { alumniData } from "@/lib/data";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAlumni, setFilteredAlumni] = useState(alumniData);

  const handleSearch = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    if (!lowercasedQuery) {
      setFilteredAlumni(alumniData);
      return;
    }
    const results = alumniData.filter((alumni) =>
      alumni.name.toLowerCase().includes(lowercasedQuery) ||
      alumni.field.toLowerCase().includes(lowercasedQuery) ||
      alumni.industry.toLowerCase().includes(lowercasedQuery) ||
      alumni.company.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredAlumni(results);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold">Search Alumni & Students</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find and connect with fellow students and graduates.
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Input
              placeholder="Search by name, company, industry..."
              className="flex-grow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleSearch} className="w-full md:w-auto">Search</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAlumni.map((alumni) => (
          <Card key={alumni.name} className="flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
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
                <Button variant="outline" onClick={(e) => { e.preventDefault(); /* Logic to connect or view profile */ }}>
                  <Linkedin className="mr-2 h-4 w-4" /> Connect
                </Button>
              </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}
