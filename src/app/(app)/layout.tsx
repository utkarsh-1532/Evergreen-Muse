'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useUserProfile } from '@/hooks/use-user-profile';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const { profile, isLoading: isProfileLoading } = useUserProfile();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
    if (!isUserLoading && user && !isProfileLoading && !profile && pathname !== '/profile') {
        router.replace('/profile');
    }
  }, [user, isUserLoading, router, profile, isProfileLoading, pathname]);
  
  if (isUserLoading || !user || (pathname !== '/profile' && isProfileLoading)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <main className="flex-1 p-4 md:p-6 mb-24">
        {children}
      </main>
    </>
  );
}
