'use client';
import { Firestore, doc, collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { LearningSeed } from './types';
import { calculateSrsUpdate, ReviewResult } from '@/lib/srs';
import { updateDocumentNonBlocking } from '../non-blocking-updates';
import { WithId } from '../firestore/use-collection';

export async function addSeed(db: Firestore, userId: string, data: { front: string; back: string; category: string }): Promise<void> {
  if (!userId || !data.front || !data.back) {
    throw new Error('User, front, and back are required to create a seed.');
  }

  const seedsCollectionRef = collection(db, 'userProfiles', userId, 'seeds');

  const newSeedData = {
    userId,
    front: data.front,
    back: data.back,
    category: data.category || 'General',
    box: 0,
    nextReview: serverTimestamp(), // Review immediately
    createdAt: serverTimestamp(),
  };

  await addDoc(seedsCollectionRef, newSeedData);
}

export function updateSeedReview(db: Firestore, userId: string, seed: WithId<LearningSeed>, result: ReviewResult) {
    const { newBox, nextReviewDate } = calculateSrsUpdate(seed.box, result);

    const seedRef = doc(db, 'userProfiles', userId, 'seeds', seed.id);
    
    const updateData = {
        box: newBox,
        nextReview: Timestamp.fromDate(nextReviewDate),
    };
    
    updateDocumentNonBlocking(seedRef, updateData);
}
