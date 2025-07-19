
"use client";

import { useState, useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Briefcase, Rocket, Building, Globe, PlusCircle } from "lucide-react";
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

function CreateGroupDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { addNetworkingGroup } = useContext(AppContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (title && description) {
      addNetworkingGroup({
        title,
        description,
        iconName: "rocket", // Default icon for new groups
        members: "1 Member",
      });
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


export default function NetworkingPage() {
  const { networkingGroups, joinedGroups, toggleGroupMembership } = useContext(AppContext);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  return (
    <div className="container py-8 md:py-12">
      <div className="flex justify-between items-center mb-12">
        <div className="text-left">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {networkingGroups.map((group) => {
          const isJoined = joinedGroups.has(group.title);
          return (
            <Card key={group.title} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex-row items-center gap-4">
                <GroupIcon iconName={group.iconName} />
                <div className="flex-1">
                  <CardTitle className="font-headline text-xl">{group.title}</CardTitle>
                  <CardDescription>{group.members}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{group.description}</p>
              </CardContent>
              <CardContent>
                <Button 
                  variant={isJoined ? "secondary" : "outline"} 
                  className="w-full"
                  onClick={() => toggleGroupMembership(group)}
                >
                  {isJoined ? "Leave Group" : "Join Group"}
                  {!isJoined && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
