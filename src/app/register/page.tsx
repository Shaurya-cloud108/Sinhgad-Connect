
"use client";

import React, { useContext } from "react";
import Image from "next/image";
import { RegisterForm } from "./register-form";
import { LoginForm } from "./login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams, useRouter } from 'next/navigation';
import { ProfileContext } from "@/context/ProfileContext";


function RegisterPageContent() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') || 'register';
  const { profileData } = useContext(ProfileContext);
  const router = useRouter();

  // If user is already logged in, redirect them away from the register page.
  useEffect(() => {
    if (profileData) {
      router.replace('/');
    }
  }, [profileData, router]);

  // Don't render the form if we are about to redirect.
  if (profileData) {
    return null;
  }

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
        <Tabs defaultValue={defaultTab} className="w-full max-w-md mx-auto">
            <Card className="shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-2">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="register">Create Account</TabsTrigger>
                        <TabsTrigger value="login">Login</TabsTrigger>
                    </TabsList>
                </CardHeader>
                <CardContent>
                    <TabsContent value="register">
                        <CardDescription className="text-center mb-4">
                            Join as a student or an alumnus. It's free!
                        </CardDescription>
                        <RegisterForm />
                    </TabsContent>
                    <TabsContent value="login">
                         <CardDescription className="text-center mb-4">
                            Welcome back! Sign in to your account.
                        </CardDescription>
                        <LoginForm />
                    </TabsContent>
                </CardContent>
            </Card>
        </Tabs>
      </div>
    </div>
  );
}

function RegisterPageWrapper() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-[calc(100vh-112px)] flex items-center justify-center p-4 bg-secondary/50">
      {mounted ? (
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

export default function RegisterPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <RegisterPageWrapper />
        </React.Suspense>
    )
}
