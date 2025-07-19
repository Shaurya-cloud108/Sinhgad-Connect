"use client";

import Link from "next/link";
import { GraduationCap, Send, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/search", label: "Search" },
  { href: "/jobs", label: "Jobs" },
  { href: "/events", label: "Events" },
  { href: "/success-stories", label: "Stories" },
  { href: "/networking", label: "Networking" },
  { href: "/donate", label: "Donate" },
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
                <Button variant="ghost" size="icon">
                    <Heart className="h-6 w-6" />
                </Button>
                 <Button variant="ghost" size="icon">
                    <Send className="h-6 w-6" />
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
            <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
                <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary text-muted-foreground"
                >
                {link.label}
                </Link>
            ))}
            </nav>
            <div className="flex flex-1 items-center justify-end space-x-4">
                <Button asChild>
                    <Link href="/register">Join Now</Link>
                </Button>
                 <Button variant="outline" asChild>
                    <Link href="/login">Sign In</Link>
                </Button>
            </div>
        </div>

      </div>
    </header>
  );
}
