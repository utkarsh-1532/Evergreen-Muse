'use client';

import { useState } from 'react';
import { AddHabitDialog } from '@/features/habits/components/AddHabitDialog';
import { HabitList } from '@/features/habits/components/HabitList';
import { HabitProgress } from '@/features/habits/components/HabitProgress';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Skeleton } from '@/components/ui/skeleton';
import { isSameDay } from 'date-fns';
import { useHabits } from '@/hooks/useHabits';

export default function HabitsPage() {
  const { profile } = useUserProfile();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { habits, addHabit, toggleHabit, isLoading } = useHabits();

  const habitsCompletedOnSelectedDate =
    habits?.filter((habit) =>
      habit.completedDates?.some((ts) => isSameDay(ts.toDate(), selectedDate))
    ).length || 0;

  const totalHabits = habits?.length || 0;

  // Sort habits: completed ones for the selected date go to the bottom
  const sortedHabits = [...(habits || [])].sort((a, b) => {
    const aCompleted = a.completedDates?.some((ts) => isSameDay(ts.toDate(), selectedDate));
    const bCompleted = b.completedDates?.some((ts) => isSameDay(ts.toDate(), selectedDate));

    if (aCompleted && !bCompleted) return 1;
    if (!aCompleted && bCompleted) return -1;
    return 0;
  });

  if (isLoading && !habits) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="space-y-3 p-4 max-w-md mx-auto w-full">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50/50 dark:bg-zinc-950">
      <HabitProgress
        username={profile?.username}
        completed={habitsCompletedOnSelectedDate}
        total={totalHabits}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        habits={sortedHabits || []}
      />

      <div className="max-w-md mx-auto p-4 space-y-3 min-h-screen pb-32">
        <HabitList habits={sortedHabits} selectedDate={selectedDate} onToggleHabit={toggleHabit} />
      </div>

      <AddHabitDialog onAddHabit={addHabit} />
    </div>
  );
}
