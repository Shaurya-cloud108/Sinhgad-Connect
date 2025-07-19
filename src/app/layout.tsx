
import type {Metadata} from 'next';
import './globals.css';
import { AppHeader } from '@/components/layout/header';
import { AppFooter } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { BottomNav } from '@/components/layout/bottom-nav';
import { ProfileProvider } from '@/context/ProfileContext';
import { AppProvider } from '@/context/AppContext';
import React from 'react';
import { Playfair_Display, PT_Sans } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-playfair',
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

export const metadata: Metadata = {
  title: 'Sinhgad Connect',
  description: 'Connecting students and alumni for mentorship, guidance, and lifelong learning.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${ptSans.variable}`}>
      <body className="font-body antialiased">
        <AppProvider>
          <ProfileProvider>
            <div className="flex flex-col min-h-screen">
              <AppHeader />
              <main className="flex-grow pb-20 md:pb-0">{children}</main>
              <AppFooter />
              <BottomNav />
            </div>
            <Toaster />
          </ProfileProvider>
        </AppProvider>
      </body>
    </html>
  );
}
