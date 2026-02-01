'use client';

import { useFirestore, useMemoFirebase } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { UserProfile } from '@/lib/firebase/types';
import { doc } from 'firebase/firestore';

export function useUserProfileById(userId: string | null | undefined) {
  const firestore = useFirestore();

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    return doc(firestore, 'userProfiles', userId);
  }, [firestore, userId]);

  const { data: profile, isLoading, error } = useDoc<UserProfile>(profileRef);

  return { profile, isLoading, error };
}
