'use client';

import { useCallback, useEffect } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useCollection, WithId } from '@/firebase/firestore/use-collection';
import { Habit } from '@/types';
import {
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  Timestamp,
  deleteDoc,
} from 'firebase/firestore';
import { isToday, isYesterday, isSameDay, startOfDay, differenceInCalendarDays } from 'date-fns';
import { updateDocumentNonBlocking } from '@/firebase';

function recalculateStreakFromDates(completedDates: Timestamp[]): { streak: number; lastCompleted: Timestamp | null } {
    if (!completedDates || completedDates.length === 0) {
        return { streak: 0, lastCompleted: null };
    }

    const sortedDates = completedDates.map(ts => ts.toDate()).sort((a, b) => b.getTime() - a.getTime());
    const lastCompletedDate = sortedDates[0];
    
    let streak = 1;

    for (let i = 0; i < sortedDates.length - 1; i++) {
        const currentDay = startOfDay(sortedDates[i]);
        const nextDayInList = startOfDay(sortedDates[i + 1]);
        
        const diff = differenceInCalendarDays(currentDay, nextDayInList);

        if (diff === 1) {
            streak++;
        } else if (diff > 1) {
            break; // Gap detected, streak ends
        }
    }

    return { streak, lastCompleted: Timestamp.fromDate(lastCompletedDate) };
}


export function useHabits() {
  const { user } = useUser();
  const firestore = useFirestore();

  const habitsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'userProfiles', user.uid, 'habits'),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user]);

  const { data: habits, isLoading } = useCollection<Habit>(habitsQuery);

  const checkAndResetHabitStreak = useCallback((habit: WithId<Habit>) => {
    if (!firestore || !user) return;
    if (habit.streak > 0 && habit.lastCompleted) {
        const lastDay = habit.lastCompleted.toDate();
        if (!isToday(lastDay) && !isYesterday(lastDay)) {
            const habitRef = doc(firestore, 'userProfiles', user.uid, 'habits', habit.id);
            updateDocumentNonBlocking(habitRef, { streak: 0 });
        }
    }
  }, [firestore, user]);

  useEffect(() => {
    if (habits && habits.length > 0) {
        habits.forEach(habit => {
            checkAndResetHabitStreak(habit);
        });
    }
  }, [habits, checkAndResetHabitStreak]);

  const addHabit = useCallback(async (title: string) => {
    if (!firestore || !user) throw new Error("User or firestore not available");
    const habitsCollectionRef = collection(firestore, 'userProfiles', user.uid, 'habits');
    const newHabit = {
      userId: user.uid,
      title,
      streak: 0,
      completedDates: [],
      lastCompleted: null,
      createdAt: serverTimestamp(),
    };
    await addDoc(habitsCollectionRef, newHabit);
  }, [firestore, user]);

  const toggleHabit = useCallback((habit: WithId<Habit>, selectedDate: Date) => {
    if (!firestore || !user) throw new Error("User or firestore not available");
    const habitRef = doc(firestore, 'userProfiles', user.uid, 'habits', habit.id);
    const normalizedSelectedDate = startOfDay(selectedDate);
    
    const existingCompletion = habit.completedDates?.find(ts => isSameDay(ts.toDate(), normalizedSelectedDate));
    let newCompletedDates: Timestamp[];

    if (existingCompletion) {
      newCompletedDates = habit.completedDates.filter(ts => !isSameDay(ts.toDate(), normalizedSelectedDate));
    } else {
      newCompletedDates = [...(habit.completedDates || []), Timestamp.fromDate(normalizedSelectedDate)];
    }

    const { streak, lastCompleted } = recalculateStreakFromDates(newCompletedDates);

    const updateData = {
      completedDates: newCompletedDates,
      streak,
      lastCompleted,
    };
    
    updateDocumentNonBlocking(habitRef, updateData);
  }, [firestore, user]);

  const deleteHabit = useCallback(async (habitId: string) => {
    if (!firestore || !user) throw new Error("User or firestore not available");
    const habitRef = doc(firestore, 'userProfiles', user.uid, 'habits', habitId);
    await deleteDoc(habitRef);
  }, [firestore, user]);

  return { habits: habits || [], addHabit, toggleHabit, deleteHabit, isLoading };
}
