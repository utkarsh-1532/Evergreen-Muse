'use client';

import { Habit } from '@/lib/firebase/types';
import { HabitCard } from './HabitCard';
import { useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { checkAndResetHabitStreak } from '@/lib/firebase/firestore';
import { WithId } from '@/firebase/firestore/use-collection';

interface HabitListProps {
  habits: WithId<Habit>[];
}

export function HabitList({ habits }: HabitListProps) {
  const firestore = useFirestore();
  const { user } = useUser();

  useEffect(() => {
    if (firestore && user && habits.length > 0) {
      habits.forEach(habit => {
        checkAndResetHabitStreak(firestore, user.uid, habit);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore, user, habits]);


  if (habits.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-20 bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-xl mt-4">
        <h3 className="text-xl font-semibold">No habits yet.</h3>
        <p>Click the '+' button to add your first habit!</p>
      </div>
    );
  }

  return (
    <>
      {habits.map(habit => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </>
  );
}
