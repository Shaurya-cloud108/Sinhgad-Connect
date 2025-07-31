
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

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const [loggedInUserHandle, setLoggedInUserHandle] = useState<string | null>(() => {
        // On initial load, try to get the user from localStorage.
        if (typeof window !== 'undefined') {
            return localStorage.getItem('loggedInUserHandle');
        }
        return null;
    });
    const { communityMembers, setCommunityMembers } = useContext(AppContext);
    const router = useRouter();

     useEffect(() => {
        // When loggedInUserHandle changes, update localStorage.
        if (loggedInUserHandle) {
            localStorage.setItem('loggedInUserHandle', loggedInUserHandle);
        } else {
            localStorage.removeItem('loggedInUserHandle');
        }
    }, [loggedInUserHandle]);

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
