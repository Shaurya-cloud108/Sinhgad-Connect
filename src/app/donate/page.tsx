import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, BookOpen, Wrench, Lightbulb } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const donationInitiatives = [
  {
    title: "Student Scholarship Fund",
    description: "Support talented students from underprivileged backgrounds to pursue their dreams without financial burden.",
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    goal: 50000,
    raised: 27500,
  },
  {
    title: "Campus Infrastructure Development",
    description: "Contribute to modernizing our campus with state-of-the-art labs, classrooms, and student facilities.",
    icon: <Wrench className="h-8 w-8 text-primary" />,
    goal: 100000,
    raised: 45000,
  },
  {
    title: "Innovation & Research Grant",
    description: "Fuel groundbreaking research and innovative projects undertaken by our students and faculty.",
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    goal: 75000,
    raised: 62000,
  },
];

export default function DonatePage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold">Donation Portal</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Your contribution, big or small, makes a lasting impact on the future of our institution and its students.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {donationInitiatives.map((initiative) => (
          <Card key={initiative.title} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">{initiative.icon}</div>
                <CardTitle className="font-headline text-xl">{initiative.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{initiative.description}</CardDescription>
              <div className="mt-6">
                <Progress value={(initiative.raised / initiative.goal) * 100} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>${initiative.raised.toLocaleString()} Raised</span>
                  <span>Goal: ${initiative.goal.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Heart className="mr-2 h-4 w-4" /> Contribute Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-16">
        <h2 className="text-2xl font-headline font-bold">Why Give Back?</h2>
        <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
          Giving back to your alma mater is a way to show your gratitude, invest in the next generation of leaders, and leave a legacy that will inspire others for years to come. Every donation helps us maintain our standard of excellence and provide an unparalleled educational experience.
        </p>
      </div>
    </div>
  );
}
