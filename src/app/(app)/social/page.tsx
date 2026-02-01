'use client';

import { useUser } from '@/firebase';

export default function SocialPage() {
  const { user } = useUser();

  return (
    <div>
      <h1 className="text-3xl font-bold">Social Feed</h1>
      <p>Welcome, {user?.displayName || user?.email}!</p>
      <p>Posts will be displayed here.</p>
    </div>
  );
}
