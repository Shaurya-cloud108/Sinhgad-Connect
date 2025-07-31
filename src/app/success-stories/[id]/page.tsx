
'use client';

import { useState, useEffect, use, useContext } from 'react';
import { SuccessStory } from '@/lib/data';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BrainCircuit, Lightbulb, Sparkles, UserCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AppContext } from '@/context/AppContext';

export default function StoryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [story, setStory] = useState<SuccessStory | null>(null);
  const { successStories } = useContext(AppContext);
  const resolvedParams = use(params);

  useEffect(() => {
    if (successStories.length > 0) {
      const storyData = successStories.find((s) => s.id === resolvedParams.id);
      if (storyData) {
        setStory(storyData);
      } else {
        notFound();
      }
    }
  }, [resolvedParams.id, successStories]);

  if (!story) {
    return (
        <div className="container py-8 md:py-12">
            <Skeleton className="h-10 w-48 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1 space-y-6">
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="lg:col-span-2">
                    <Skeleton className="h-[500px] w-full" />
                </div>
            </div>
      </div>
    );
  }

  const { insights } = story;

  return (
    <div className="container py-8 md:py-12">
      <Button variant="ghost" onClick={() => router.back()} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Success Stories
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Story Details */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="overflow-hidden">
                <div className="relative h-60 w-full">
                    <Image
                        src={story.image}
                        alt={story.name}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint={story.aiHint}
                    />
                </div>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">{story.name}</CardTitle>
                    <CardDescription>Class of {story.class} | {story.role}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {story.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl">The Full Story</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{story.story}</p>
                </CardContent>
             </Card>
        </div>

        {/* Right Column: AI Insights */}
        <div className="lg:col-span-2">
            <Card className="bg-primary/5 border-primary/20 sticky top-24">
                <CardHeader>
                    <div className="flex items-center gap-3 text-primary">
                        <BrainCircuit className="h-8 w-8" />
                        <CardTitle className="font-headline text-3xl text-primary">AI-Powered Insights</CardTitle>
                    </div>
                    <CardDescription>
                        Our GenAI Career Advisor analyzed this story to provide you with a summary and actionable advice.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {insights && (
                        <>
                            <div>
                                <h3 className="flex items-center gap-2 font-headline text-xl font-bold mb-3">
                                    <Sparkles className="h-5 w-5 text-accent" />
                                    Summary
                                </h3>
                                <p className="text-muted-foreground">{insights.summary}</p>
                            </div>
                             <div>
                                <h3 className="flex items-center gap-2 font-headline text-xl font-bold mb-3">
                                    <UserCheck className="h-5 w-5 text-accent" />
                                    Key Takeaways
                                </h3>
                                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                                    {insights.keyTakeaways.map((takeaway, i) => (
                                        <li key={i}>{takeaway}</li>
                                    ))}
                                </ul>
                            </div>
                             <div>
                                <h3 className="flex items-center gap-2 font-headline text-xl font-bold mb-3">
                                    <Lightbulb className="h-5 w-5 text-accent" />
                                    Career Advice
                                </h3>
                                <p className="text-muted-foreground">{insights.careerAdvice}</p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
