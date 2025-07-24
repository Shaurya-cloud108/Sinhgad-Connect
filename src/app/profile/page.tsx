
"use client";

import { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileContext } from '@/context/ProfileContext';

export default function ProfilePage() {
    const { loggedInUserHandle } = useContext(ProfileContext);
    const router = useRouter();

    useEffect(() => {
        // This component ensures that navigating to /profile redirects
        // to the user's own dynamic profile page /profile/[handle]
        if (loggedInUserHandle) {
            router.replace(`/profile/${loggedInUserHandle}`);
        }
        // No else needed; ProfileContext handles showing login if no profile
    }, [loggedInUserHandle, router]);

    // Render a loading state or null while redirecting
    return null; 
}
