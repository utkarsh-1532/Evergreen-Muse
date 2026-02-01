'use client';

import { format, subDays, isToday as isTodayFns } from 'date-fns';
import { cn } from '@/lib/utils';

interface HabitProgressProps {
    username?: string | null;
    completed: number;
    total: number;
}

function DateStrip() {
    const today = new Date();
    const days = Array.from({ length: 7 }).map((_, i) => subDays(today, 3 - i));

    return (
        <div className="flex justify-between items-center mt-4">
            {days.map(day => {
                const isCurrentDay = isTodayFns(day);
                return (
                    <div key={day.toString()} className="flex flex-col items-center gap-2">
                        <span className="text-xs text-muted-foreground uppercase">{format(day, 'E')}</span>
                        <span className={cn(
                            "flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium",
                            isCurrentDay ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : 'text-foreground'
                        )}>
                            {format(day, 'd')}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}


export function HabitProgress({ username, completed, total }: HabitProgressProps) {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    }

    return (
        <div className="w-full bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100 dark:border-zinc-800 p-4">
            <div className="max-w-md mx-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-serif font-bold text-gray-800 dark:text-zinc-100">
                        {getGreeting()}, {username || 'friend'}!
                    </h1>
                    <div className="text-right">
                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{completed}/{total} Completed</p>
                        <p className="text-xs text-muted-foreground">Today's Progress</p>
                    </div>
                </div>
                <DateStrip />
            </div>
        </div>
    );
}
