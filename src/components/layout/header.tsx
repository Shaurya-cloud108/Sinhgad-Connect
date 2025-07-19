
"use client";

import Link from "next/link";
import { GraduationCap, Send, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { href: "/search", label: "Search" },
  { href: "/jobs", label: "Jobs" },
  { href: "/events", label: "Events" },
  { href: "/success-stories", label: "Stories" },
  { href: "/networking", label: "Networking" },
];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        {/* Mobile Header */}
        <div className="flex md:hidden flex-1 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                 <span className="font-bold font-headline text-xl">
                    Alumni
                </span>
            </Link>
             <div className="flex items-center space-x-1">
                 <Button variant="ghost" size="icon" asChild>
                    <Link href="/messages">
                      <Send className="h-6 w-6" />
                    </Link>
                </Button>
            </div>
        </div>
        
        {/* Desktop Header */}
        <div className="hidden md:flex flex-1 items-center">
             <Link href="/" className="flex items-center space-x-2 mr-6">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline">
                Sinhgad Alumni Connect
                </span>
            </Link>
            <nav className="flex items-center space-x-4 text-sm font-medium">
            {navLinks.map((link) => (
                <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary text-muted-foreground px-2 py-1"
                >
                {link.label}
                </Link>
            ))}
            </nav>
            <div className="flex flex-1 items-center justify-end space-x-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/messages">
                    <Send />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/notifications">
                    <Bell />
                  </Link>
                </Button>
                <Link href="/profile">
                  <Avatar className="h-9 w-9 cursor-pointer">
                    <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="professional woman" />
                    <AvatarFallback>PS</AvatarFallback>
                  </Avatar>
                </Link>
            </div>
        </div>

      </div>
    </header>
  );
}
