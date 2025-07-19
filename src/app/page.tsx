import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Award, Briefcase, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white">
        <Image
          src="https://placehold.co/1600x900.png"
          alt="Sinhgad College campus"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
          data-ai-hint="university campus"
        />
        <div className="absolute inset-0 bg-primary/70 z-10"></div>
        <div className="relative z-20 px-4">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary-foreground drop-shadow-md">
            Welcome Back, Alumni!
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/90">
            Reconnect with peers, discover opportunities, and cherish the memories. Your journey with Sinhgad continues here.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/register">Join the Network</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/directory">Find Alumni</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-headline font-bold text-center mb-10">
            Stay Connected
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline">Upcoming Events</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Join us for reunions, workshops, and networking events.
                </CardDescription>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-start gap-2"><span className="font-semibold text-primary">Oct 25:</span> Annual Alumni Meet 2024</li>
                  <li className="flex items-start gap-2"><span className="font-semibold text-primary">Nov 12:</span> Tech Talk by Industry Leaders</li>
                </ul>
                <Button variant="link" className="px-0 mt-4" asChild>
                  <Link href="/events">View All Events <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                   <div className="bg-primary/10 p-3 rounded-full">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline">Alumni Spotlight</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Read inspiring stories from our distinguished alumni.
                </CardDescription>
                <div className="flex items-center gap-4 mt-4">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="professional portrait" />
                    <AvatarFallback>SN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Sunita Narayan</p>
                    <p className="text-sm text-muted-foreground">CEO at Innovate Inc.</p>
                  </div>
                </div>
                <Button variant="link" className="px-0 mt-4" asChild>
                  <Link href="/success-stories">More Success Stories <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                   <div className="bg-primary/10 p-3 rounded-full">
                    <Briefcase className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline">Career Center</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Explore exclusive job opportunities within the alumni network.
                </CardDescription>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex justify-between"><span>Software Engineer at Google</span> <Badge variant="secondary">New</Badge></li>
                  <li className="flex justify-between"><span>Product Manager at Microsoft</span></li>
                </ul>
                <Button variant="link" className="px-0 mt-4" asChild>
                  <Link href="/jobs">Visit Job Board <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-card">
        <div className="container text-center">
            <Users className="h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className="text-3xl font-headline font-bold">
              A Thriving Community Awaits
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Our alumni are making a difference across the globe. Join thousands of graduates to network, mentor, and grow together.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">50,000+</p>
                <p className="text-muted-foreground">Alumni Worldwide</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">100+</p>
                <p className="text-muted-foreground">Countries</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">1,000+</p>
                <p className="text-muted-foreground">Companies</p>
              </div>
            </div>
        </div>
      </section>
    </div>
  );
}
