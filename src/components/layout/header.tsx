
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Send, User, Bell, Home, Search, Users, Briefcase, Award, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useContext } from "react";
import { ProfileContext } from "@/context/ProfileContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/jobs", label: "Jobs" },
  { href: "/events", label: "Events" },
  { href: "/success-stories", label: "Stories" },
  { href: "/donate", label: "Donate" },
];

export function AppHeader() {
  const pathname = usePathname();
  const { profileData } = useContext(ProfileContext);

  const isRegisterPage = pathname === "/register";
  const showAuthArea = !profileData || isRegisterPage;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 mr-auto">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline-block font-bold font-headline">
            Sinhgad Connect
          </span>
          <span className="sm:hidden font-bold font-headline text-xl">
            Connect
          </span>
        </Link>
        
        <div className="flex items-center justify-end">
          {/* Desktop Navigation */}
          {!showAuthArea && (
            <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
              {navLinks.map((link) => (
                <Button key={link.href} variant="ghost" asChild className={cn("text-muted-foreground", pathname === link.href && "text-primary bg-primary/10")}>
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
            </nav>
          )}

          <div className="flex items-center justify-end space-x-2 pl-4">
            {showAuthArea ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/register?tab=login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register?tab=register">Join Now</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/messages">
                    <Send />
                    <span className="sr-only">Messages</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/notifications">
                    <Bell />
                     <span className="sr-only">Notifications</span>
                  </Link>
                </Button>
                <Link href="/profile">
                  <Avatar className="h-9 w-9 cursor-pointer">
                    <AvatarImage src={profileData?.avatar} data-ai-hint={profileData?.aiHint} />
                    <AvatarFallback>{profileData?.name.substring(0,2)}</AvatarFallback>
                  </Avatar>
                   <span className="sr-only">Profile</span>
                </Link>
              </>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
