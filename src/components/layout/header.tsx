"use client";

import Link from "next/link";
import { useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "/directory", label: "Directory" },
  { href: "/jobs", label: "Jobs" },
  { href: "/events", label: "Events" },
  { href: "/success-stories", label: "Success Stories" },
  { href: "/networking", label: "Networking" },
  { href: "/donate", label: "Donate" },
];

export function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline sm:inline-block">
              Sinhgad Alumni Connect
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
           <Button asChild>
              <Link href="/register">Join Now</Link>
            </Button>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="md:hidden px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <span className="font-bold ml-2 font-headline">Sinhgad Alumni</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                <div className="flex flex-col space-y-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-muted-foreground transition-colors hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
