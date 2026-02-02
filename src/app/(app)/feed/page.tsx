"use client";

import { useUserProfile } from "@/hooks/use-user-profile";
import { ArrowRight, BookOpen, PenSquare, Target } from "lucide-react";
import Link from 'next/link';
import { FadeIn } from '@/components/ui/FadeIn';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

export default function FeedPage() {
  const { profile } = useUserProfile();

  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-4xl font-bold font-serif">
          Welcome, {profile?.username || 'Friend'}!
        </h1>
        <p className="text-muted-foreground text-lg">
          Ready to continue your journey of growth?
        </p>
      </FadeIn>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <FadeIn delay={0.2}>
          <Link href="/habits" className="block h-full">
            <SpotlightCard className="flex flex-col h-full p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Target className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold font-serif">Track Your Habits</h2>
                </div>
                <p className="pt-2 text-muted-foreground flex-grow">
                    Build positive routines and break old patterns. Consistency is key to mastery.
                </p>
                <div className="flex items-center text-sm font-medium text-primary mt-4">
                    Go to Habits <ArrowRight className="ml-2 h-4 w-4" />
                </div>
            </SpotlightCard>
          </Link>
        </FadeIn>

        <FadeIn delay={0.4}>
          <Link href="/journal" className="block h-full">
            <SpotlightCard className="flex flex-col h-full p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <PenSquare className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold font-serif">Creative Journaling</h2>
                </div>
                <p className="pt-2 text-muted-foreground flex-grow">
                    Unleash your thoughts, ideas, and reflections. A space for your mind to wander and create.
                </p>
                <div className="flex items-center text-sm font-medium text-primary mt-4">
                    Start Writing <ArrowRight className="ml-2 h-4 w-4" />
                </div>
            </SpotlightCard>
          </Link>
        </FadeIn>

        <FadeIn delay={0.6}>
          <Link href="/learning" className="block h-full">
            <SpotlightCard className="flex flex-col h-full p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold font-serif">Expand Your Knowledge</h2>
                </div>
                <p className="pt-2 text-muted-foreground flex-grow">
                   Curate your learning path. Collect resources, take notes, and track your progress.
                </p>
                <div className="flex items-center text-sm font-medium text-primary mt-4">
                    Go to Learning <ArrowRight className="ml-2 h-4 w-4" />
                </div>
            </SpotlightCard>
          </Link>
        </FadeIn>
      </div>
    </div>
  );
}
