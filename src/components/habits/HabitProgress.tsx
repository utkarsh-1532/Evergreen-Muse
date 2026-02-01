'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface HabitProgressProps {
    username?: string | null;
    completed: number;
    total: number;
}

export function HabitProgress({ username, completed, total }: HabitProgressProps) {
    const progressPercentage = total > 0 ? (completed / total) * 100 : 0;
    
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    }

    return (
        <Card className="bg-white/60 dark:bg-black/60 backdrop-blur-lg border-white/20 shadow-xl">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    {getGreeting()}, {username || 'friend'}!
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                        Today's Progress: {completed}/{total} habits
                    </p>
                    <Progress value={progressPercentage} className="h-3 bg-emerald-100 [&>*]:bg-emerald-500" />
                </div>
            </CardContent>
        </Card>
    );
}
