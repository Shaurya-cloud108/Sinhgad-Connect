
"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BrainCircuit, Send } from "lucide-react";
import Link from "next/link";
import { ShareDialog } from "@/components/share-dialog";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { successStories } from "@/lib/data.tsx";
import { useSearchParams } from "next/navigation";


function SuccessStoriesContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const storyFragment = window.location.hash;
    if (storyFragment) {
        const element = document.getElementById(storyFragment.substring(1));
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('bg-primary/10', 'transition-all', 'duration-1000');
                setTimeout(() => {
                    element.classList.remove('bg-primary/10');
                }, 2000);
            }, 100);
        }
    }
  }, [searchParams]);

  return (
    <div className="container py-8 md:py-12">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div className="text-left mb-4 md:mb-0">
          <h1 className="text-4xl font-headline font-bold">Alumni Success Stories</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Be inspired by the remarkable achievements of your fellow graduates.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {successStories.map((story) => (
          <Card key={story.id} id={`story-${story.id}`} className="flex flex-col md:flex-row overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative md:w-1/3 h-64 md:h-auto">
              <Image
                src={story.image}
                alt={story.name}
                layout="fill"
                objectFit="cover"
                data-ai-hint={story.aiHint}
              />
            </div>
            <div className="flex flex-col justify-between p-6 md:w-2/3">
              <div>
                <CardHeader className="p-0">
                  <CardTitle className="font-headline text-2xl">{story.name}</CardTitle>
                  <CardDescription>Class of {story.class} | {story.role}</CardDescription>
                </CardHeader>
                <CardContent className="p-0 pt-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">{story.story}</p>
                   <div className="flex flex-wrap gap-2 mt-4">
                    {story.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </div>
              <CardFooter className="p-0 pt-6 flex items-center justify-between">
                <Button asChild variant="link" className="p-0 text-primary">
                   <Link href={`/success-stories/${story.id}`}>
                     Read Full Story & AI Insights <ArrowRight className="ml-2 h-4 w-4" />
                   </Link>
                </Button>
                <ShareDialog contentType="story" contentId={story.id}>
                    <Button variant="ghost" size="icon">
                        <Send className="h-4 w-4"/>
                    </Button>
                </ShareDialog>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
      
      <Card className="mt-16 bg-primary/5 border-primary/20">
        <CardHeader className="text-center">
            <BrainCircuit className="h-10 w-10 mx-auto text-primary" />
            <CardTitle className="font-headline text-2xl">GenAI Career Advisor</CardTitle>
            <CardDescription>
                Click on a success story to get AI-powered summaries of their journey and personalized career advice.
            </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export default function SuccessStoriesPage() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div className="container py-8 md:py-12">
                <div className="text-center mb-12 space-y-2">
                    <Skeleton className="h-10 w-3/4 mx-auto" />
                    <Skeleton className="h-6 w-1/2 mx-auto" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        )
    }

    return <SuccessStoriesContent />
}
