
"use client";

import { useState, useContext, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Lock, Search, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AppContext } from "@/context/AppContext";
import type { Group } from "@/lib/data";
import { CreateGroupDialog, GroupFormData } from "@/components/create-group-dialog";

function GroupsPageContent() {
  const { groups, addGroup } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGroups, setFilteredGroups] = useState<Group[]>(groups);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    if (!lowercasedQuery) {
      setFilteredGroups(groups);
      return;
    }
    const results = groups.filter(group =>
      group.name.toLowerCase().includes(lowercasedQuery) ||
      group.description.toLowerCase().includes(lowercasedQuery) ||
      group.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
    );
    setFilteredGroups(results);
  }, [searchQuery, groups]);

  const handleGroupSubmit = (data: GroupFormData) => {
    const newGroup: Group = {
      id: data.name.toLowerCase().replace(/\s+/g, '-'),
      name: data.name,
      description: data.description,
      type: data.type,
      banner: "https://placehold.co/600x400.png",
      aiHint: "community gathering",
      memberCount: 1, // Starts with the creator
      tags: [], // Tags can be added later
    };
    addGroup(newGroup);
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div className="text-left mb-4 md:mb-0">
          <h1 className="text-4xl font-headline font-bold">Campus Groups</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Connect with alumni and students who share your interests.
          </p>
        </div>
        <Button className="mt-4 md:mt-0" onClick={() => setIsCreateGroupOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create a Group
        </Button>
      </div>

      <CreateGroupDialog 
        open={isCreateGroupOpen} 
        onOpenChange={setIsCreateGroupOpen} 
        onGroupSubmit={handleGroupSubmit} 
      />

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search for groups by name, topic, or description..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredGroups.map(group => (
          <Card key={group.id} className="flex flex-col hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-40 w-full">
              <Image
                src={group.banner}
                alt={`${group.name} banner`}
                fill
                className="object-cover"
                data-ai-hint={group.aiHint}
              />
              {group.type === 'private' && (
                <div className="absolute top-2 right-2 bg-background/80 p-1.5 rounded-full">
                  <Lock className="h-4 w-4" />
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="font-headline text-xl">{group.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                {group.memberCount} Members
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {group.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                {group.type === 'private' ? 'Request to Join' : 'Join Group'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {filteredGroups.length === 0 && (
        <p className="text-center text-muted-foreground md:col-span-3 py-12">
          No groups found matching your search. Try creating one!
        </p>
      )}
    </div>
  );
}

export default function GroupsPage() {
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
                    <Skeleton className="h-10 w-40 mt-4 md:mt-0" />
                </div>
                <Skeleton className="h-12 w-full mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Skeleton className="h-80 w-full" />
                    <Skeleton className="h-80 w-full" />
                    <Skeleton className="h-80 w-full" />
                </div>
            </div>
        )
    }

    return <GroupsPageContent />;
}
