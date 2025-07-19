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
import { ArrowRight, BrainCircuit } from "lucide-react";
import Link from "next/link";

const successStories = [
  {
    name: "Sunita Narayan",
    class: "2009",
    role: "CEO, Innovate Inc.",
    image: "https://placehold.co/400x400.png",
    aiHint: "professional woman portrait",
    story: "Led her company through a successful IPO, becoming a leading voice in sustainable technology.",
    tags: ["Leadership", "Technology", "Entrepreneurship"],
  },
  {
    name: "Dr. Rohan Gupta",
    class: "2005",
    role: "Lead Researcher, CureAI",
    image: "https://placehold.co/400x400.png",
    aiHint: "male doctor",
    story: "Pioneered a new AI-driven diagnostic tool that has significantly improved early cancer detection rates.",
    tags: ["Healthcare", "AI/ML", "Research"],
  },
  {
    name: "Meera Desai",
    class: "2012",
    role: "Award-Winning Architect",
    image: "https://placehold.co/400x400.png",
    aiHint: "female architect",
    story: "Designed the iconic 'Green Tower' in Mumbai, a landmark of eco-friendly architecture.",
    tags: ["Architecture", "Sustainability", "Design"],
  },
  {
    name: "Karan Malhotra",
    class: "2016",
    role: "Forbes 30 Under 30, FinTech",
    image: "https://placehold.co/400x400.png",
    aiHint: "young businessman",
    story: "Co-founded a FinTech startup that provides accessible financial services to rural communities.",
    tags: ["Finance", "Startup", "Social Impact"],
  },
];

export default function SuccessStoriesPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold">Alumni Success Stories</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Be inspired by the remarkable achievements of your fellow graduates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {successStories.map((story) => (
          <Card key={story.name} className="flex flex-col md:flex-row overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
                  <p className="text-sm text-muted-foreground">{story.story}</p>
                   <div className="flex flex-wrap gap-2 mt-4">
                    {story.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </div>
              <CardFooter className="p-0 pt-6">
                <Button variant="link" className="p-0 text-primary">
                   Read Full Story & AI Insights <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
      
      <Card className="mt-16 bg-primary/5">
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
