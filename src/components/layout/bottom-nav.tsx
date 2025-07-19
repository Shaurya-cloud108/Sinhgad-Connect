
// components/layout/bottom-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Users, Briefcase, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/networking", label: "Network", icon: Users },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/notifications", label: "Alerts", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} className="flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors flex-1 py-1">
              <link.icon className={cn("h-6 w-6", isActive && "text-primary")} />
              <span className={cn("text-[10px] mt-1", isActive && "text-primary")}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
