
"use client";

import React, { createContext, useState, ReactNode, useEffect, useMemo, useContext } from 'react';
import type { CommunityMember } from '@/lib/data.tsx';
import { AppContext } from './AppContext';
import { useRouter } from 'next/navigation';

type ProfileContextType = {
    loggedInUserHandle: string | null;
    setLoggedInUserHandle: React.Dispatch<React.SetStateAction<string | null>>;
    profileData: CommunityMember | null;
    setCommunityMembers: React.Dispatch<React.SetStateAction<CommunityMember[]>>;
};

export const ProfileContext = createContext<ProfileContextType>({
    loggedInUserHandle: null,
    setLoggedInUserHandle: () => {},
    profileData: null,
    setCommunityMembers: () => {},
});

const MOCK_LOGGED_IN_USER_HANDLE = 'priya-sharma';

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const [loggedInUserHandle, setLoggedInUserHandle] = useState<string | null>(null);
    const { communityMembers, setCommunityMembers } = useContext(AppContext);
    const router = useRouter();

     useEffect(() => {
        // In a real app, this would be determined by an auth session.
        // For this prototype, we'll set a default logged-in user.
        if (communityMembers.length > 0) {
            setLoggedInUserHandle(MOCK_LOGGED_IN_USER_HANDLE);
        }
    }, [communityMembers]);

    const profileData = useMemo(() => {
        if (!loggedInUserHandle) return null;
        return communityMembers.find(m => m.handle === loggedInUserHandle) || null;
    }, [loggedInUserHandle, communityMembers]);


    return (
        <ProfileContext.Provider value={{ loggedInUserHandle, setLoggedInUserHandle, profileData, setCommunityMembers }}>
            {children}
        </ProfileContext.Provider>
    );
};
