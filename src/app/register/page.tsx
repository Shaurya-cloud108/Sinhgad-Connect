
"use client";

import Image from "next/image";
import { RegisterForm } from "./register-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function RegisterPageContent() {
  return (
    <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="hidden lg:block">
        <h1 className="text-4xl lg:text-5xl font-headline font-bold mb-4 leading-tight">
          Connect. Learn. Grow.
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Join a vibrant community where students and alumni connect for mentorship, guidance, and lifelong learning. Your journey starts here.
        </p>
        <Image
          src="https://placehold.co/800x600.png"
          alt="Students and alumni networking"
          width={800}
          height={600}
          className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-500 ease-in-out"
          data-ai-hint="graduates celebrating"
        />
      </div>
      <div>
        <Card className="w-full max-w-md mx-auto shadow-xl transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Create Your Account</CardTitle>
            <CardDescription>
              Join as a student or an alumnus. It's free!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-[calc(100vh-112px)] flex items-center justify-center p-4 bg-secondary/50">
      {isClient ? (
        <RegisterPageContent />
      ) : (
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="hidden lg:block space-y-4">
                 <Skeleton className="h-12 w-3/4" />
                 <Skeleton className="h-6 w-full" />
                 <Skeleton className="h-6 w-5/6" />
                 <Skeleton className="aspect-video w-full" />
            </div>
            <div>
                <Skeleton className="w-full max-w-md h-[550px] mx-auto" />
            </div>
        </div>
      )}
    </div>
  );
}
