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

  if (isLoading) {
      return (
          <div className="space-y-6 max-w-md mx-auto">
              <Skeleton className="h-32 w-full rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
          </div>
      )
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <HabitProgress 
        username={profile?.username} 
        completed={completedToday}
        total={totalHabits}
      />
      <HabitList habits={habits || []} />
      <AddHabitDialog />
    </div>
  );
}
