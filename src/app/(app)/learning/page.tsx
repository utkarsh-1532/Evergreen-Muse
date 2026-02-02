'use client';

import { useMemo, useState } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useCollection, WithId } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import { LearningSeed } from '@/lib/firebase/types';
import { AddSeedDialog } from '@/components/learning/AddSeedDialog';
import { ReviewDueCard } from '@/components/learning/ReviewDueCard';
import { SeedList } from '@/components/learning/SeedList';
import { Skeleton } from '@/components/ui/skeleton';

export default function LearningPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const seedsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'userProfiles', user.uid, 'seeds'),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user]);

  const { data: seeds, isLoading } = useCollection<LearningSeed>(seedsQuery);

  const dueSeeds = useMemo(() => {
    if (!seeds) return [];
    const now = new Date();
    return seeds.filter((seed) => seed.nextReview && seed.nextReview.toDate() <= now);
  }, [seeds]);

  if (isLoading && !seeds) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReviewDueCard dueSeeds={dueSeeds} />

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Your Garden</h2>
        <SeedList seeds={seeds || []} />
      </div>

      <AddSeedDialog />
    </div>
  );
}
