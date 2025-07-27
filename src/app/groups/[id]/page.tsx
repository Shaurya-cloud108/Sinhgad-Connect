
"use client";

import { useState, useContext, useEffect, use } from "react";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AppContext } from "@/context/AppContext";
import { ProfileContext } from "@/context/ProfileContext";
import { ArrowLeft, Users, Lock, CheckCircle, PlusCircle, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
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

export default function GroupProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const resolvedParams = use(params);

  const { groups, joinGroup, leaveGroup } = useContext(AppContext);
  const { profileData } = useContext(ProfileContext);
  const { toast } = useToast();

  const [group, setGroup] = useState<typeof groups[0] | null>(null);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const groupData = groups.find((g) => g.id === resolvedParams.id);
    if (groupData) {
      setGroup(groupData);
    } else {
      notFound();
    }
  }, [resolvedParams.id, groups]);

  useEffect(() => {
    if (group && profileData) {
      setIsMember(profileData.groups?.includes(group.id) || false);
    }
  }, [group, profileData]);

  const handleJoinClick = () => {
    if (!profileData || !group) return;

    if (group.type === "private") {
      toast({
        title: "Request Sent",
        description: `Your request to join "${group.name}" has been sent for approval.`,
      });
    } else {
      joinGroup(group, profileData);
      toast({
        title: "Joined Group!",
        description: `You are now a member of "${group.name}".`,
      });
    }
  };

  const handleLeaveClick = () => {
    if (!profileData || !group) return;

    leaveGroup(group, profileData);
    toast({
      title: "You have left the group",
      description: `You are no longer a member of "${group.name}".`,
    });
  };

  if (!group || !profileData) {
    return (
      <div className="container py-8 md:py-12">
        <Skeleton className="h-10 w-48 mb-8" />
        <Card className="max-w-4xl mx-auto">
          <Skeleton className="h-48 w-full" />
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/4 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <Button variant="ghost" onClick={() => router.back()} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Groups
      </Button>

      <Card className="max-w-4xl mx-auto overflow-hidden">
        <div className="relative h-48 w-full">
          <Image
            src={group.banner}
            alt={`${group.name} banner`}
            layout="fill"
            objectFit="cover"
            data-ai-hint={group.aiHint}
          />
        </div>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <CardTitle className="font-headline text-3xl flex items-center gap-2">
                {group.name}
                {group.type === "private" && <Lock className="h-5 w-5 text-muted-foreground" />}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 text-sm mt-2">
                <Users className="h-4 w-4" />
                {group.memberCount} Members
              </CardDescription>
            </div>
            {isMember ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline">
                        <LogOut className="mr-2 h-4 w-4" />
                        Leave Group
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Leave "{group.name}"?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will need to request to join again if this is a private group. Are you sure you want to leave?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLeaveClick}>
                      Leave
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button onClick={handleJoinClick}>
                <PlusCircle className="mr-2 h-4 w-4" />
                {group.type === "private" ? "Request to Join" : "Join Group"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">{group.description}</p>
          <div className="flex flex-wrap gap-2">
            {group.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for group feed or members list */}
      <div className="max-w-4xl mx-auto mt-8">
        <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
                <p>Group content and posts will appear here.</p>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
