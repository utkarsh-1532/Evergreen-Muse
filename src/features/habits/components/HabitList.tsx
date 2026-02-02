'use client';

import { Habit } from '@/types';
import { HabitCard } from './HabitCard';
import { WithId } from '@/firebase/firestore/use-collection';

interface HabitListProps {
  habits: WithId<Habit>[];
  selectedDate: Date;
  onToggleHabit: (habit: WithId<Habit>, date: Date) => void;
}

export function HabitList({ habits, selectedDate, onToggleHabit }: HabitListProps) {
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
        <HabitCard key={habit.id} habit={habit} selectedDate={selectedDate} onToggle={onToggleHabit} />
      ))}
    </>
  );
}
