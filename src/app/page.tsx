'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/signup');
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <p>Loading...</p>
    </div>
  );
}
