'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { UserProfile } from '@/types';
import { doc } from 'firebase/firestore';

export function useUserProfile() {
  const { user } = useUser();
  const firestore = useFirestore();

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'userProfiles', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile, isLoading, error } = useDoc<UserProfile>(profileRef);

  return { profile, isLoading, error };
}
