'use client';

import { Habit } from '@/types';
import { format } from 'date-fns';
import { DateTimeline } from './DateTimeline';
import { WithId } from '@/firebase/firestore/use-collection';

interface HabitProgressProps {
  username?: string | null;
  completed: number;
  total: number;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  habits: WithId<Habit>[];
}

export function HabitProgress({
  username,
  completed,
  total,
  selectedDate,
  setSelectedDate,
  habits,
}: HabitProgressProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="sticky top-0 z-20 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 glass-panel">
      <div className="max-w-md mx-auto p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-serif font-bold text-gray-900 dark:text-zinc-100">
            {getGreeting()}, {username || 'friend'}!
          </h1>
          <div className="text-right">
            <p className="text-sm font-medium text-primary">
              {completed}/{total} Habits Done
            </p>
            <p className="text-xs text-muted-foreground">On {format(selectedDate, 'MMM d')}</p>
          </div>
        </div>
        <DateTimeline
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          habits={habits}
        />
      </div>
    </div>
  );
}
