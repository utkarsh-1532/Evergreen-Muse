'use client';

import { Habit } from '@/lib/firebase/types';
import { HabitCard } from './HabitCard';
import { useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { checkAndResetHabitStreak } from '@/lib/firebase/firestore';
import { WithId } from '@/firebase/firestore/use-collection';

interface HabitListProps {
  habits: WithId<Habit>[];
  selectedDate: Date;
}

export function HabitList({ habits, selectedDate }: HabitListProps) {
  const firestore = useFirestore();
  const { user } = useUser();

  useEffect(() => {
    if (firestore && user && habits.length > 0) {
      // This check should only run for the current day, not when viewing the past
      if (new Date().toDateString() === new Date().toDateString()) {
        habits.forEach((habit) => {
          checkAndResetHabitStreak(firestore, user.uid, habit);
        });
      }
    }
  }, [firestore, user, habits]);

  if (habits.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-20 bg-white/30 dark:bg-zinc-900/60 backdrop-blur-sm rounded-xl mt-4">
        <h3 className="text-xl font-semibold">No habits yet.</h3>
        <p>Click the '+' button to add your first habit!</p>
      </div>
    );
  }

  return (
    <>
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} selectedDate={selectedDate} />
      ))}
    </>
  );
}
