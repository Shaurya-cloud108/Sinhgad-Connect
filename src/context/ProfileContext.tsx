
"use client";

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { profileData as initialProfileData, ProfileData } from '@/lib/data.tsx';
import { usePathname } from 'next/navigation';

type ProfileContextType = {
    profileData: ProfileData | null;
    setProfileData: React.Dispatch<React.SetStateAction<ProfileData | null>>;
};

export const ProfileContext = createContext<ProfileContextType>({
    profileData: null,
    setProfileData: () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const pathname = usePathname();

    // This is a mock auth flow. In a real app, you'd check a token.
     useEffect(() => {
        // Simulate loading profile data on initial mount
        if (initialProfileData) {
            setProfileData(initialProfileData);
        }
    }, []);

    useEffect(() => {
        if (pathname === '/register') {
            setProfileData(null);
        } else if (!profileData) {
            // If user navigates away from register without "logging in", restore profile
            setProfileData(initialProfileData);
        }
    }, [pathname]);


    return (
        <ProfileContext.Provider value={{ profileData, setProfileData }}>
            {children}
        </ProfileContext.Provider>
    );
};
