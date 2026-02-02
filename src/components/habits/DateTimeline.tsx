'use client';

import { useRef, useEffect, useMemo } from 'react';
import { format, eachDayOfInterval, startOfDay, isSameDay, addDays, subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { WithId } from '@/firebase/firestore/use-collection';
import { Habit } from '@/lib/firebase/types';
import { CheckCircle2 } from 'lucide-react';

interface DateTimelineProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  habits: WithId<Habit>[];
}

export function DateTimeline({ selectedDate, setSelectedDate, habits }: DateTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLButtonElement>(null);

  const dates = useMemo(() => {
    const today = new Date();
    return eachDayOfInterval({
      start: subDays(today, 30),
      end: addDays(today, 7),
    });
  }, []);

  const completionData = useMemo(() => {
    const map = new Map<string, boolean>();
    if (!habits || habits.length === 0) return map;

    dates.forEach(date => {
      if (date > new Date()) return;

      const habitsForDate = habits.filter(h => h.createdAt.toDate() <= date);
      if (habitsForDate.length === 0) return;

      const completedCount = habitsForDate.filter(habit =>
        habit.completedDates.some(ts => isSameDay(ts.toDate(), date))
      ).length;

      if (completedCount > 0 && completedCount === habitsForDate.length) {
        map.set(format(date, 'yyyy-MM-dd'), true);
      }
    });
    return map;
  }, [habits, dates]);

  useEffect(() => {
    if (scrollRef.current && todayRef.current) {
      const scrollContainer = scrollRef.current;
      const todayElement = todayRef.current;
      const scrollLeft = todayElement.offsetLeft - scrollContainer.offsetWidth / 2 + todayElement.offsetWidth / 2;
      scrollContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, []);

  return (
    <div ref={scrollRef} className="flex overflow-x-auto no-scrollbar snap-x py-4 gap-3 -mx-4 px-4">
      {dates.map((day, index) => {
        const isSelected = isSameDay(day, selectedDate);
        const isToday = isSameDay(day, new Date());
        const isCompleted = completionData.get(format(day, 'yyyy-MM-dd')) || false;

        return (
          <button
            key={index}
            ref={isToday ? todayRef : null}
            onClick={() => setSelectedDate(startOfDay(day))}
            className={cn(
              'snap-center shrink-0 w-14 h-20 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer relative',
              isSelected
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110'
                : 'bg-transparent text-gray-400 dark:text-zinc-500 hover:bg-gray-100 dark:hover:bg-zinc-800'
            )}
          >
            <span className="text-xs uppercase">{format(day, 'E')}</span>
            <span className="text-lg font-bold">{format(day, 'd')}</span>
            {isCompleted && !isSelected && (
                 <CheckCircle2 className="absolute bottom-1 h-3.5 w-3.5 text-primary fill-white dark:fill-zinc-800" />
            )}
          </button>
        );
      })}
    </div>
  );
}
