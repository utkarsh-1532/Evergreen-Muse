'use client';

import { useMemo } from 'react';
import { useLearning } from '@/hooks/useLearning';
import { AddSeedDialog } from '@/features/learning/components/AddSeedDialog';
import { ReviewDueCard } from '@/features/learning/components/ReviewDueCard';
import { SeedList } from '@/features/learning/components/SeedList';
import { Skeleton } from '@/components/ui/skeleton';

export default function LearningPage() {
  const { seeds, addSeed, updateSeedReview, isLoading } = useLearning();

  const dueSeeds = useMemo(() => {
    if (!seeds) return [];
    const now = new Date();
    return seeds.filter((seed) => {
      if (!seed.nextReview) return false;
      return seed.nextReview.toDate() <= now;
    });
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
      <ReviewDueCard dueSeeds={dueSeeds} onUpdateSeedReview={updateSeedReview} />

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Your Garden</h2>
        <SeedList seeds={seeds || []} />
      </div>

      <AddSeedDialog onAddSeed={addSeed} />
    </div>
  );
}
