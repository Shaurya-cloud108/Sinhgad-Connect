
"use client";

import React, { createContext, useState, ReactNode } from 'react';
import { profileData as initialProfileData, ProfileData } from '@/lib/data';

type ProfileContextType = {
    profileData: ProfileData;
    setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
};

export const ProfileContext = createContext<ProfileContextType>({
    profileData: initialProfileData,
    setProfileData: () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);

    return (
        <ProfileContext.Provider value={{ profileData, setProfileData }}>
            {children}
        </ProfileContext.Provider>
    );
};
