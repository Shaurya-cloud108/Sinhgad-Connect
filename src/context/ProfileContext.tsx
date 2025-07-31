
"use client";

import React, { createContext, useState, ReactNode, useEffect, useMemo, useContext } from 'react';
import type { CommunityMember } from '@/lib/data';
import { AppContext } from './AppContext';

type ProfileContextType = {
    loggedInUserHandle: string | null;
    setLoggedInUserHandle: React.Dispatch<React.SetStateAction<string | null>>;
    profileData: CommunityMember | null;
};

export const ProfileContext = createContext<ProfileContextType>({
    loggedInUserHandle: 'priya-sharma', // Default to a known user for now
    setLoggedInUserHandle: () => {},
    profileData: null,
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const [loggedInUserHandle, setLoggedInUserHandle] = useState<string | null>('priya-sharma');
    const { communityMembers } = useContext(AppContext);

    const profileData = useMemo(() => {
        if (!loggedInUserHandle) return null;
        return communityMembers.find(m => m.handle === loggedInUserHandle) || null;
    }, [loggedInUserHandle, communityMembers]);


    return (
        <ProfileContext.Provider value={{ loggedInUserHandle, setLoggedInUserHandle, profileData }}>
            {children}
        </ProfileContext.Provider>
    );
};

    