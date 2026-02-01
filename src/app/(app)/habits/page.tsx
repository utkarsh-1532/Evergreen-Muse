'use client';

import { AddHabitDialog } from '@/components/habits/AddHabitDialog';
import { HabitList } from '@/components/habits/HabitList';
import { HabitProgress } from '@/components/habits/HabitProgress';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Habit } from '@/lib/firebase/types';
import { collection, query, orderBy } from 'firebase/firestore';
import { isToday } from 'date-fns';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Skeleton } from '@/components/ui/skeleton';

export default function HabitsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { profile } = useUserProfile();

  const habitsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'userProfiles', user.uid, 'habits'),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user]);

  const { data: habits, isLoading } = useCollection<Habit>(habitsQuery);

  const completedToday = habits?.filter(habit => 
    habit.lastCompleted && isToday(habit.lastCompleted.toDate())
  ).length || 0;

  const totalHabits = habits?.length || 0;

  // Sort habits: completed ones go to the bottom
  const sortedHabits = [...(habits || [])].sort((a, b) => {
    const aCompleted = a.lastCompleted && isToday(a.lastCompleted.toDate());
    const bCompleted = b.lastCompleted && isToday(b.lastCompleted.toDate());
    if (aCompleted && !bCompleted) return 1;
    if (!aCompleted && bCompleted) return -1;
    // Keep original sort order (by createdAt) for habits with the same completion status
    return 0;
  });

  if (isLoading && !habits) {
      return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-3 p-4 max-w-md mx-auto w-full">
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-20 w-full rounded-2xl" />
            </div>
        </div>
      )
  }

  return (
    <div className="h-full bg-gray-50/50">
      {/* The Canopy (Header) */}
      <HabitProgress 
        username={profile?.username} 
        completed={completedToday}
        total={totalHabits}
      />
      
      {/* The Understory (Habit List) */}
      <div className="max-w-md mx-auto p-4 space-y-3 pb-28">
        <HabitList habits={sortedHabits} />
      </div>

      {/* The Seed (FAB) */}
      <AddHabitDialog />
    </div>
  );
}
