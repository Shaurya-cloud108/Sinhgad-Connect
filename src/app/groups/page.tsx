
"use client";

import { useState, useContext, useEffect, useMemo, useRef } from "react";
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
import { Users, Lock, Search, PlusCircle, CheckCircle, MoreHorizontal, LogOut, Crown, ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AppContext } from "@/context/AppContext";
import type { Group } from "@/lib/data";
import { CreateGroupDialog, GroupFormData } from "@/components/create-group-dialog";
import { useToast } from "@/hooks/use-toast";
import { ProfileContext } from "@/context/ProfileContext";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


function GroupCard({ group, isMember, onJoinClick, onLeaveClick, currentUserId }: { group: Group, isMember: boolean, onJoinClick: (groupId: string) => void, onLeaveClick: (groupId: string) => void, currentUserId?: string }) {
  const isAdmin = group.members.some(m => m.handle === currentUserId && m.role === 'admin');
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const { setGroups } = useContext(AppContext);

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newBannerUrl = reader.result as string;
        setGroups(prevGroups => prevGroups.map(g => g.id === group.id ? { ...g, banner: newBannerUrl } : g));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerBannerUpload = () => {
    bannerInputRef.current?.click();
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Link href={`/groups/${group.id}`} className="block h-full">
      <Card className="flex flex-col hover:shadow-xl transition-shadow duration-300 h-full">
        <div className="relative h-40 w-full">
          <Image
            src={group.banner}
            alt={`${group.name} banner`}
            fill
            className="object-cover"
            data-ai-hint={group.aiHint}
          />
          <div className="absolute top-2 right-2 flex items-center gap-1" onClick={stopPropagation}>
            {isAdmin && (
              <>
              <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={handleBannerUpload} />
              <DropdownMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-background/80">
                          <Crown className="h-4 w-4 text-yellow-500" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Admin Controls</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={triggerBannerUpload}>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Edit Banner
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </>
            )}
            {group.type === 'private' && (
              <div className="bg-background/80 p-1.5 rounded-full">
                <Lock className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
        <CardHeader>
          <CardTitle className="font-headline text-xl">{group.name}</CardTitle>
          <CardDescription className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            {group.members.length} Members
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
        <CardFooter onClick={stopPropagation}>
          {isMember ? (
             <AlertDialog>
              <div className="w-full flex items-center gap-2">
                <Button className="w-full" disabled>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Joined
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-destructive cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        Leave Group
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Leave "{group.name}"?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will need to request to join again if this is a private group. Are you sure you want to leave?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onLeaveClick(group.id)}>
                    Leave
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button className="w-full" onClick={() => onJoinClick(group.id)}>
              {group.type === 'private' ? 'Request to Join' : 'Join Group'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}

function GroupsPageContent() {
  const { groups, addGroup, joinGroup, leaveGroup } = useContext(AppContext);
  const { profileData } = useContext(ProfileContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const { toast } = useToast();

  const userGroupIds = useMemo(() => {
    if (!profileData) return [];
    return groups
        .filter(g => g.members.some(m => m.handle === profileData.handle))
        .map(g => g.id);
  }, [groups, profileData]);


  const filteredGroups = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    if (!lowercasedQuery) {
      return groups;
    }
    return groups.filter(group =>
      group.name.toLowerCase().includes(lowercasedQuery) ||
      group.description.toLowerCase().includes(lowercasedQuery) ||
      group.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
    );
  }, [searchQuery, groups]);

  const myGroups = useMemo(() => 
    filteredGroups.filter(g => userGroupIds.includes(g.id)), 
    [filteredGroups, userGroupIds]
  );
  
  const discoverGroups = useMemo(() => 
    filteredGroups.filter(g => !userGroupIds.includes(g.id)), 
    [filteredGroups, userGroupIds]
  );

  const handleGroupSubmit = (data: GroupFormData) => {
    if (!profileData) return;

    const newGroup: Omit<Group, 'id' | 'members' | 'tags'> = {
      name: data.name,
      description: data.description,
      type: data.type,
      banner: data.banner || "https://placehold.co/600x400.png",
      aiHint: "community gathering",
    };

    const addedGroup = addGroup(newGroup, profileData.handle);
    
    // Also join the group you created
    handleJoinClick(addedGroup.id);
  };
  
  const handleJoinClick = (groupId: string) => {
    if (!profileData) return;

    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    if (group.type === 'private') {
      toast({
        title: "Request Sent",
        description: `Your request to join "${group.name}" has been sent for approval.`,
      });
    } else {
      joinGroup(groupId, profileData.handle);
      toast({
        title: "Joined Group!",
        description: `You are now a member of "${group.name}".`,
      });
    }
  };

  const handleLeaveClick = (groupId: string) => {
    if (!profileData) return;

    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    leaveGroup(groupId, profileData.handle);

    toast({
      title: "You have left the group",
      description: `You are no longer a member of "${group.name}".`,
    });
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

      <div className="space-y-12">
        {myGroups.length > 0 && (
          <div>
            <h2 className="text-2xl font-headline font-bold mb-6">My Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {myGroups.map(group => (
                <GroupCard 
                  key={group.id}
                  group={group}
                  isMember={true}
                  onJoinClick={() => handleJoinClick(group.id)}
                  onLeaveClick={() => handleLeaveClick(group.id)}
                  currentUserId={profileData?.handle}
                />
              ))}
            </div>
          </div>
        )}

        {myGroups.length > 0 && discoverGroups.length > 0 && (
          <Separator />
        )}

        {discoverGroups.length > 0 && (
           <div>
            <h2 className="text-2xl font-headline font-bold mb-6">Discover Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {discoverGroups.map(group => (
                  <GroupCard 
                    key={group.id}
                    group={group}
                    isMember={false}
                    onJoinClick={() => handleJoinClick(group.id)}
                    onLeaveClick={() => handleLeaveClick(group.id)}
                    currentUserId={profileData?.handle}
                  />
              ))}
            </div>
          </div>
        )}
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
