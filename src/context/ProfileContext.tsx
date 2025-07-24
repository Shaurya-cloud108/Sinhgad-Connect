
"use client";

import React, { createContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { initialCommunityMembers, CommunityMember } from '@/lib/data.tsx';

type ProfileContextType = {
    loggedInUserHandle: string | null;
    setLoggedInUserHandle: React.Dispatch<React.SetStateAction<string | null>>;
    profileData: CommunityMember | null; // The full data of the logged-in user
};

export const ProfileContext = createContext<ProfileContextType>({
    loggedInUserHandle: null,
    setLoggedInUserHandle: () => {},
    profileData: null,
});

// For prototype purposes, we'll hardcode the logged-in user's handle.
// In a real app, this would come from an auth session.
const MOCK_LOGGED_IN_USER_HANDLE = 'priya-sharma';

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const [loggedInUserHandle, setLoggedInUserHandle] = useState<string | null>(null);

     useEffect(() => {
        // Simulate loading user auth data on initial mount
        setLoggedInUserHandle(MOCK_LOGGED_IN_USER_HANDLE);
    }, []);

    // This is a simple mock auth flow.
    // In a real app, you'd have a proper login/logout flow updating the handle.
    // For now, we assume the user is always logged in as Priya Sharma.
    const profileData = useMemo(() => {
        if (!loggedInUserHandle) return null;
        return initialCommunityMembers.find(m => m.handle === loggedInUserHandle) || null;
    }, [loggedInUserHandle]);


    return (
        <ProfileContext.Provider value={{ loggedInUserHandle, setLoggedInUserHandle, profileData }}>
            {children}
        </ProfileContext.Provider>
    );
};
