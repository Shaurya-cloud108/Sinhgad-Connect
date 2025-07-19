
"use client";

import { useState, useContext, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Briefcase, Rocket, Building, Globe, PlusCircle, MessageSquare, Send } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AppContext, NetworkingGroup } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { ProfileContext } from "@/context/ProfileContext";
import { Skeleton } from "@/components/ui/skeleton";
import { ShareDialog } from "@/components/share-dialog";

function CreateGroupDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { addNetworkingGroup, setSelectedConversationByName } = useContext(AppContext);
  const { profileData } = useContext(ProfileContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (title && description && profileData) {
      const newGroupData = {
        title,
        description,
        iconName: "rocket", // Default icon for new groups
        members: [{
          id: profileData.handle,
          name: profileData.name,
          avatar: profileData.avatar,
          role: 'admin' as 'admin' | 'member'
        }],
      };
      addNetworkingGroup(newGroupData);
      setSelectedConversationByName(title);
      router.push('/messages');
      onOpenChange(false);
      setTitle("");
      setDescription("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Group</DialogTitle>
          <DialogDescription>
            Start a new community for alumni to connect on a specific topic.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input 
            placeholder="Group Title (e.g., AI Enthusiasts)" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
          <Textarea 
            placeholder="Group Description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Create Group</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GroupIcon({ iconName }: { iconName: string }) {
    const iconProps = { className: "h-10 w-10 text-primary" };
    switch (iconName) {
        case "code":
            return <Code {...iconProps} />;
        case "rocket":
            return <Rocket {...iconProps} />;
        case "building":
            return <Building {...iconProps} />;
        case "briefcase":
            return <Briefcase {...iconProps} />;
        case "globe":
            return <Globe {...iconProps} />;
        default:
            return <Rocket {...iconProps} />;
    }
}

function GroupCard({ group, isMember }: { group: NetworkingGroup, isMember: boolean }) {
    const { toggleGroupMembership, setSelectedConversationByName } = useContext(AppContext);
    const router = useRouter();

    const handleGoToChat = () => {
        setSelectedConversationByName(group.title);
        router.push("/messages");
    }

    const handleJoinGroup = () => {
        toggleGroupMembership(group.title);
    }

    return (
        <Card className="flex flex-col hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex-row items-center gap-4">
                <GroupIcon iconName={group.iconName} />
                <div className="flex-1">
                <CardTitle className="font-headline text-xl">{group.title}</CardTitle>
                <CardDescription>{group.members.length} Members</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
            </CardContent>
            <CardFooter className="gap-2">
                {isMember ? (
                <Button className="w-full" onClick={handleGoToChat}>
                    <MessageSquare className="mr-2 h-4 w-4" /> Go to Chat
                </Button>
                ) : (
                <Button className="w-full" onClick={handleJoinGroup}>
                    Join Group
                </Button>
                )}
                <ShareDialog contentType="group" contentId={group.title}>
                    <Button variant="outline" size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </ShareDialog>
            </CardFooter>
        </Card>
    )
}

function NetworkingPageContent() {
  const { myGroups, exploreGroups } = useContext(AppContext);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredExploreGroups = exploreGroups.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    g.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="text-left mb-4 md:mb-0">
            <h1 className="text-4xl font-headline font-bold">Networking Hub</h1>
            <p className="mt-2 text-lg text-muted-foreground">
            Join groups based on your interests, profession, and location.
            </p>
        </div>
        <Button onClick={() => setIsCreateGroupOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Group
        </Button>
      </div>

      <CreateGroupDialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen} />

      <div className="space-y-12">
        {myGroups.length > 0 && (
            <div>
                <h2 className="text-2xl font-headline font-bold mb-4">My Groups</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {myGroups.map((group) => (
                        <GroupCard key={group.title} group={group} isMember={true} />
                    ))}
                </div>
            </div>
        )}

        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                 <h2 className="text-2xl font-headline font-bold">Explore Groups</h2>
                 <Input 
                    placeholder="Search for groups..."
                    className="w-full md:max-w-xs mt-4 md:mt-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                 />
            </div>
            
            {filteredExploreGroups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {filteredExploreGroups.map((group) => (
                        <GroupCard key={group.title} group={group} isMember={false} />
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                        <p>No groups found matching "{searchQuery}". Try a different search, or create your own!</p>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}

export default function NetworkingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
        <div className="container py-8 md:py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div className="space-y-2 mb-4 md:mb-0">
                    <Skeleton className="h-10 w-72" />
                    <Skeleton className="h-6 w-96" />
                </div>
                <Skeleton className="h-10 w-36" />
            </div>
            <div className="mb-8 mt-12">
                <div className="flex justify-between items-center mb-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-64" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Skeleton className="h-56 w-full" />
                    <Skeleton className="h-56 w-full" />
                    <Skeleton className="h-56 w-full" />
                </div>
            </div>
        </div>
    );
  }

  return <NetworkingPageContent />;
}

    