'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Wind } from "lucide-react";
import { WithId } from "@/firebase/firestore/use-collection";
import { LearningSeed } from "@/lib/firebase/types";
import { ReviewModal } from './ReviewModal';

interface ReviewDueCardProps {
  dueSeeds: WithId<LearningSeed>[];
}

export function ReviewDueCard({ dueSeeds }: ReviewDueCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dueCount = dueSeeds.length;

  if (dueCount === 0) {
    return (
      <Card className="glass-panel">
        <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Wind className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>All Caught Up!</CardTitle>
              <CardDescription>Your garden is well-tended. No reviews due today.</CardDescription>
            </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-primary/50 bg-primary/5 hover:border-primary/80 transition-colors">
        <CardHeader>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <BrainCircuit className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle>Time to Water Your Garden!</CardTitle>
                        <CardDescription>{dueCount} {dueCount === 1 ? 'seed is' : 'seeds are'} ready for review.</CardDescription>
                    </div>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    Start Review
                </Button>
            </div>
        </CardHeader>
      </Card>
      <ReviewModal 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        dueSeeds={dueSeeds}
      />
    </>
  );
}
