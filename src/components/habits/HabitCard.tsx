'use client';

import { Check, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Habit } from '@/lib/firebase/types';
import { isSameDay } from 'date-fns';
import { useFirestore, useUser } from '@/firebase';
import { toggleHabit } from '@/lib/firebase/firestore';
import { WithId } from '@/firebase/firestore/use-collection';

interface HabitCardProps {
  habit: WithId<Habit>;
  selectedDate: Date;
}

export function HabitCard({ habit, selectedDate }: HabitCardProps) {
  const firestore = useFirestore();
  const { user } = useUser();

  const isCompleted = habit.completedDates?.some((ts) => isSameDay(ts.toDate(), selectedDate)) || false;

  const handleToggle = () => {
    if (!firestore || !user) return;
    toggleHabit(firestore, user.uid, habit, selectedDate);
  };

  return (
    <div
      className={cn(
        'glass-panel rounded-2xl p-4 flex items-center justify-between group transition-all',
        'border-gray-200 dark:border-zinc-800',
        isCompleted
          ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-500/30'
          : 'bg-white dark:bg-zinc-900'
      )}
    >
      <div className="flex-1">
        <p
          className={cn(
            'font-medium text-gray-700 dark:text-zinc-200 transition-all',
            isCompleted && 'line-through text-muted-foreground opacity-50'
          )}
        >
          {habit.title}
        </p>
        {habit.streak > 0 && (
          <div className="flex items-center gap-1 text-orange-500 mt-1">
            <Flame className="h-4 w-4" />
            <span className="text-xs font-bold">{habit.streak} day streak</span>
          </div>
        )}
      </div>
      <button
        onClick={handleToggle}
        aria-label={`Mark ${habit.title} as ${isCompleted ? 'incomplete' : 'complete'}`}
        className={cn(
          'flex items-center justify-center h-12 w-12 rounded-full transition-all duration-300 ring-offset-background focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-90',
          isCompleted
            ? 'bg-emerald-500 text-white'
            : 'bg-gray-100 text-gray-400 ring-1 ring-inset ring-gray-200 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-500 dark:ring-zinc-700 dark:hover:bg-zinc-700'
        )}
      >
        <Check className="h-7 w-7" />
      </button>
    </div>
  );
}
