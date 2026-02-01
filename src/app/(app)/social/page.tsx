'use client';

import { useUserProfile } from '@/hooks/use-user-profile';

export default function SocialPage() {
  const { profile } = useUserProfile();

  return (
    <div>
      <h1 className="text-3xl font-bold">Social Feed</h1>
      <p>Welcome, {profile?.username}!</p>
      <p>Posts will be displayed here.</p>
    </div>
  );
}
