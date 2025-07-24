
"use client";

import { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileContext } from '@/context/ProfileContext';

export default function ProfilePage() {
    const { profileData } = useContext(ProfileContext);
    const router = useRouter();

    useEffect(() => {
        // This component ensures that navigating to /profile redirects
        // to the user's own dynamic profile page /profile/[handle]
        if (profileData?.handle) {
            router.replace(`/profile/${profileData.handle}`);
        }
        // No else needed; ProfileContext handles showing login if no profile
    }, [profileData, router]);

    // Render a loading state or null while redirecting
    return null; 
}
