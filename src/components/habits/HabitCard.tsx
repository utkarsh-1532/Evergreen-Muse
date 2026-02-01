'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Habit } from '@/lib/firebase/types';
import { isToday } from 'date-fns';
import { useFirestore, useUser } from '@/firebase';
import { toggleHabit } from '@/lib/firebase/firestore';
import { WithId } from '@/firebase/firestore/use-collection';

interface HabitCardProps {
  habit: WithId<Habit>;
}

export function HabitCard({ habit }: HabitCardProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const isCompleted = habit.lastCompleted ? isToday(habit.lastCompleted.toDate()) : false;

  const handleToggle = () => {
    if (!firestore || !user) return;
    toggleHabit(firestore, user.uid, habit);
  };

  return (
    <Card
      className={cn(
        'bg-white/60 dark:bg-black/60 backdrop-blur-lg border-white/20 shadow-lg transition-all duration-300',
        isCompleted && 'bg-emerald-50/80 dark:bg-emerald-900/60 border-emerald-500/20'
      )}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex-1">
          <p className={cn(
            'text-lg font-medium transition-all',
            isCompleted && 'line-through text-muted-foreground'
          )}>
            {habit.title}
          </p>
          {habit.streak > 0 && (
            <div className="flex items-center gap-1 text-orange-500 mt-1">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-bold">{habit.streak} day streak</span>
            </div>
          )}
        </div>
        <Button
          size="icon"
          onClick={handleToggle}
          className={cn(
            'h-14 w-14 rounded-full transition-all duration-300',
            isCompleted
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
          )}
        >
          <Check className="h-8 w-8" />
        </Button>
      </CardContent>
    </Card>
  );
}
