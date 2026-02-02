'use client';

import { useCallback } from 'react';
import { useUser, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { useCollection, WithId } from '@/firebase/firestore/use-collection';
import { LearningSeed } from '@/types';
import {
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  Timestamp,
  deleteDoc,
} from 'firebase/firestore';
import { calculateSrsUpdate, ReviewResult } from '@/lib/srs';

export function useLearning() {
  const { user } = useUser();
  const firestore = useFirestore();

  const seedsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'userProfiles', user.uid, 'seeds'),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user]);

  const { data: seeds, isLoading } = useCollection<LearningSeed>(seedsQuery);

  const addSeed = useCallback(async (data: { front: string; back: string; category: string }) => {
    if (!firestore || !user) throw new Error('User or firestore not available');
    if (!data.front || !data.back) {
      throw new Error('Front and back content are required.');
    }
    const seedsCollectionRef = collection(firestore, 'userProfiles', user.uid, 'seeds');
    const newSeedData = {
      userId: user.uid,
      front: data.front,
      back: data.back,
      category: data.category || 'General',
      box: 0,
      nextReview: serverTimestamp(),
      createdAt: serverTimestamp(),
    };
    await addDoc(seedsCollectionRef, newSeedData);
  }, [firestore, user]);

  const updateSeedReview = useCallback((seed: WithId<LearningSeed>, result: ReviewResult) => {
    if (!firestore || !user) throw new Error('User or firestore not available');
    const { newBox, nextReviewDate } = calculateSrsUpdate(seed.box, result);
    const seedRef = doc(firestore, 'userProfiles', user.uid, 'seeds', seed.id);
    const updateData = {
      box: newBox,
      nextReview: Timestamp.fromDate(nextReviewDate),
    };
    updateDocumentNonBlocking(seedRef, updateData);
  }, [firestore, user]);

  const deleteSeed = useCallback(async (seedId: string) => {
    if (!firestore || !user) throw new Error('User or firestore not available');
    const seedRef = doc(firestore, 'userProfiles', user.uid, 'seeds', seedId);
    await deleteDoc(seedRef);
  }, [firestore, user]);

  return { seeds: seeds || [], addSeed, updateSeedReview, deleteSeed, isLoading };
}
