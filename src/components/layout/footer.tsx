import Link from "next/link";
import { GraduationCap, Twitter, Linkedin, Facebook } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">Sinhgad Alumni Connect</span>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium mb-4 md:mb-0">
            <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
              About
            </Link>
            <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
              Contact
            </Link>
            <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
              Privacy Policy
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Facebook className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Sinhgad College of Engineering Alumni Association. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
