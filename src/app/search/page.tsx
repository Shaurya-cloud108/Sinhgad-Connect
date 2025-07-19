
"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { communityMembers, CommunityMember } from "@/lib/data.tsx";
import { getStatusEmoji } from "@/lib/utils";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<CommunityMember[]>(communityMembers);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    if (!lowercasedQuery) {
      setFilteredMembers(communityMembers);
      return;
    }
    const results = communityMembers.filter((member) =>
      member.name.toLowerCase().includes(lowercasedQuery) ||
      member.field.toLowerCase().includes(lowercasedQuery) ||
      member.industry.toLowerCase().includes(lowercasedQuery) ||
      member.company.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredMembers(results);
  }, [searchQuery]);


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
          <Input
            placeholder="Search by name, company, industry..."
            className="flex-grow"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMembers.map((member) => (
          <Card key={member.handle} className="flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={member.avatar} data-ai-hint={member.aiHint} />
                  <AvatarFallback>{member.fallback}</AvatarFallback>
                </Avatar>
                <CardTitle className="font-headline">{member.name} {getStatusEmoji(member.graduationYear, member.graduationMonth)}</CardTitle>
                <CardDescription>
                  {member.field}, Class of {member.graduationYear}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow text-center">
                <p className="font-semibold">{member.company}</p>
                <p className="text-sm text-muted-foreground">{member.location}</p>
                <div className="mt-4">
                  <Badge>{member.industry}</Badge>
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Button variant="outline" asChild>
                  <Link href={`/profile/${member.handle}`}>View Profile</Link>
                </Button>
              </CardFooter>
            </Card>
        ))}
         {filteredMembers.length === 0 && (
          <p className="text-center text-muted-foreground md:col-span-3">No members found matching your search.</p>
        )}
      </div>
    </div>
  );
}
