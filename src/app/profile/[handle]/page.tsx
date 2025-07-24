
"use client";

import ProfilePageContent from './profile-content';

export default function ProfilePage({ params: { handle } }: { params: { handle: string } }) {
  // This is now a Client Component to handle hooks and context.
  // It passes the handle to the main content component.
  return <ProfilePageContent handle={handle} />;
}
