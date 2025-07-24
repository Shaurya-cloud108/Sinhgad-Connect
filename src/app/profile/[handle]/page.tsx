
"use client";

import ProfilePageContent from './profile-content';

// This page component is kept simple to pass the params down to the
// main content component, which is also a client component and handles all logic.
export default function ProfilePage({ params }: { params: { handle: string } }) {
  return <ProfilePageContent params={params} />;
}
