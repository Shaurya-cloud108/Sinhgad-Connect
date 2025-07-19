
import ProfilePageContent from './profile-content';

export default async function ProfilePage({ params: { handle } }: { params: { handle: string } }) {
  // This is now a Server Component. It can be async and safely access params.
  // It passes the handle to the Client Component which will handle all the interactive logic.
  return <ProfilePageContent handle={handle} />;
}
