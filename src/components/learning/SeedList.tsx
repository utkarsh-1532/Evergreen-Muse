'use client';

import { WithId } from '@/firebase/firestore/use-collection';
import { LearningSeed } from '@/lib/firebase/types';
import { SeedCard } from './SeedCard';
import { BookDashed } from 'lucide-react';

interface SeedListProps {
  seeds: WithId<LearningSeed>[];
}

export function SeedList({ seeds }: SeedListProps) {
  if (seeds.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-20 bg-muted/50 rounded-lg flex flex-col items-center">
        <BookDashed className="h-12 w-12 mb-4" />
        <h3 className="text-xl font-semibold">Your garden is empty.</h3>
        <p>Click the '+' button to plant your first knowledge seed!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {seeds.map((seed) => (
        <SeedCard key={seed.id} seed={seed} />
      ))}
    </div>
  );
}
