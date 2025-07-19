import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Briefcase, Rocket, Building, Globe } from "lucide-react";

const networkingGroups = [
  {
    title: "Software & Tech Innovators",
    description: "Connect with alumni in the tech industry. Share insights on coding, product development, and emerging technologies.",
    icon: <Code className="h-10 w-10 text-primary" />,
    members: "12,500+ Members",
  },
  {
    title: "Entrepreneurship Hub",
    description: "A group for founders, aspiring entrepreneurs, and investors. Discuss startup ideas, funding, and growth strategies.",
    icon: <Rocket className="h-10 w-10 text-primary" />,
    members: "3,200+ Members",
  },
  {
    title: "Core Engineering Circle",
    description: "For alumni in Mechanical, Civil, and Electrical fields. Collaborate on projects and discuss industry trends.",
    icon: <Building className="h-10 w-10 text-primary" />,
    members: "8,750+ Members",
  },
  {
    title: "Management & Consulting",
    description: "Network with alumni in business management, finance, and consulting roles across various industries.",
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    members: "6,100+ Members",
  },
  {
    title: "Bay Area Alumni Chapter",
    description: "Connect with fellow graduates living and working in the San Francisco Bay Area for local meetups and networking.",
    icon: <Globe className="h-10 w-10 text-primary" />,
    members: "1,800+ Members",
  },
   {
    title: "Higher Education & Academia",
    description: "A forum for alumni pursuing or working in research, teaching, and higher education.",
    icon: <Globe className="h-10 w-10 text-primary" />,
    members: "2,400+ Members",
  },
];

export default function NetworkingPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold">Networking Hub</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Join groups based on your interests, profession, and location.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {networkingGroups.map((group) => (
          <Card key={group.title} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex-row items-center gap-4">
              {group.icon}
              <div className="flex-1">
                <CardTitle className="font-headline text-xl">{group.title}</CardTitle>
                <CardDescription>{group.members}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{group.description}</p>
            </CardContent>
            <CardContent>
              <Button variant="outline" className="w-full">
                Join Group <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
