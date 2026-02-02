'use client';

import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  writeBatch,
  WriteBatch,
  Firestore,
  updateDoc,
  collection,
  deleteDoc,
  FieldValue,
  arrayUnion,
  arrayRemove,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { updateProfile as updateAuthProfile, User } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Post, UserProfile, Habit } from './types';
import { POSTS_COLLECTION } from '@/lib/constants';
import { deleteObject, ref as storageRef } from 'firebase/storage';
import type { Storage } from 'firebase/storage';
import { WithId } from '@/firebase/firestore/use-collection';
import { isToday, isYesterday, isSameDay, startOfDay } from 'date-fns';

export function createProfile(
  db: Firestore,
  user: User,
  username: string,
  bio?: string
): Promise<void> {
  const userProfileRef = doc(db, 'userProfiles', user.uid);
  const usernameRef = doc(db, 'usernames', username);

  // This function now returns the promise from the transaction.
  return runTransaction(db, async (transaction) => {
    const usernameDoc = await transaction.get(usernameRef);
    if (usernameDoc.exists()) {
      throw new Error(`Username @${username} is already taken.`);
    }

    const userProfileDoc = await transaction.get(userProfileRef);
    if (userProfileDoc.exists()) {
      // This is an unexpected state for a new user creation flow.
      // We will update, but this may indicate a previous failed signup.
      transaction.update(userProfileRef, { bio: bio || '' });
    } else {
      // New user profile
      transaction.set(userProfileRef, {
        userId: user.uid,
        username: username,
        email: user.email,
        bio: bio || '',
        createdAt: serverTimestamp(),
      });
    }

    // Create the username lock
    transaction.set(usernameRef, { uid: user.uid });
  }).then(() => {
    // After transaction, update the auth user's display name
    return updateAuthProfile(user, { displayName: username });
  });
}

export async function getUserProfile(db: Firestore, userId: string): Promise<UserProfile | null> {
    const userProfileRef = doc(db, 'userProfiles', userId);
    const userProfileSnap = await getDoc(userProfileRef);
    if (userProfileSnap.exists()) {
        return { id: userProfileSnap.id, ...userProfileSnap.data() } as UserProfile;
    }
    return null;
}

export function createPost(
  db: Firestore,
  author: { uid: string; username: string; profilePicUrl?: string },
  postData: Partial<Omit<Post, 'id' | 'authorId' | 'authorUsername' | 'authorProfilePicUrl' | 'timestamp' | 'likeIds'>>
): void {
  if (!author.uid || !author.username) {
    throw new Error('Author details are required to create a post.');
  }
  const postsCollectionRef = collection(db, POSTS_COLLECTION);

  const newPostData = {
    ...postData,
    authorId: author.uid,
    authorUsername: author.username,
    authorProfilePicUrl: author.profilePicUrl || '',
    timestamp: serverTimestamp(),
    likeIds: [],
  };

  addDocumentNonBlocking(postsCollectionRef, newPostData);
}

export async function deletePost(
  db: Firestore,
  storage: Storage,
  postId: string,
  imageUrl?: string
): Promise<void> {
  if (!postId) {
    throw new Error('Post ID is required to delete a post.');
  }

  // First, try to delete the image from Storage if it exists
  if (imageUrl) {
    try {
      const imageRef = storageRef(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error: any) {
      // Log the error but don't block post deletion
      // It's possible the file doesn't exist or permissions failed
      console.warn(`Failed to delete image ${imageUrl}:`, error);
    }
  }

  // Then, delete the post document from Firestore
  const postRef = doc(db, POSTS_COLLECTION, postId);
  await deleteDoc(postRef);
}


export function toggleLikeOnPost(firestore: Firestore, postId: string, userId: string, isLiked: boolean) {
  const postRef = doc(firestore, POSTS_COLLECTION, postId);
  const updateData = {
    likeIds: isLiked ? arrayRemove(userId) : arrayUnion(userId)
  };
  updateDocumentNonBlocking(postRef, updateData);
}

export async function addHabit(db: Firestore, userId: string, title: string): Promise<void> {
  const habitsCollectionRef = collection(db, 'userProfiles', userId, 'habits');
  const newHabit = {
    userId,
    title,
    streak: 0,
    completedDates: [],
    lastCompleted: null,
    createdAt: serverTimestamp(),
  };
  await addDoc(habitsCollectionRef, newHabit);
}

export function toggleHabit(db: Firestore, userId: string, habit: WithId<Habit>, selectedDate: Date) {
  const habitRef = doc(db, 'userProfiles', userId, 'habits', habit.id);
  const normalizedSelectedDate = startOfDay(selectedDate);
  
  const matchingTimestamp = habit.completedDates?.find(ts => isSameDay(ts.toDate(), normalizedSelectedDate));
  const isCompletedOnSelectedDate = !!matchingTimestamp;

  const updateData: any = {};

  if (isCompletedOnSelectedDate && matchingTimestamp) {
    // ---- UNDO COMPLETION ----
    updateData.completedDates = arrayRemove(matchingTimestamp);

    if (isToday(normalizedSelectedDate)) {
      updateData.streak = Math.max(0, habit.streak - 1);
      
      const previousDates = habit.completedDates
        .map(t => t.toDate())
        .filter(d => !isSameDay(d, normalizedSelectedDate))
        .sort((a, b) => b.getTime() - a.getTime());
        
      updateData.lastCompleted = previousDates.length > 0 ? Timestamp.fromDate(previousDates[0]) : null;
    }
  } else {
    // ---- MARK AS COMPLETE ----
    const newCompletionTime = Timestamp.fromDate(normalizedSelectedDate);
    updateData.completedDates = arrayUnion(newCompletionTime);

    if (isToday(normalizedSelectedDate)) {
      const wasCompletedYesterday = habit.lastCompleted ? isYesterday(habit.lastCompleted.toDate()) : false;
      
      updateData.streak = wasCompletedYesterday ? habit.streak + 1 : 1;
      updateData.lastCompleted = newCompletionTime;
    } else {
      // If completing a past date, check if it's the new "lastCompleted"
      if (!habit.lastCompleted || normalizedSelectedDate > habit.lastCompleted.toDate()) {
        updateData.lastCompleted = newCompletionTime;
        // Note: Full streak recalculation for past dates is complex and not implemented here
        // to keep the primary streak logic focused on current momentum.
      }
    }
  }
  
  updateDocumentNonBlocking(habitRef, updateData);
}

export function checkAndResetHabitStreak(db: Firestore, userId: string, habit: WithId<Habit>) {
    if (habit.streak > 0 && habit.lastCompleted) {
        const lastDay = habit.lastCompleted.toDate();
        if (!isToday(lastDay) && !isYesterday(lastDay)) {
            const habitRef = doc(db, 'userProfiles', userId, 'habits', habit.id);
            updateDocumentNonBlocking(habitRef, { streak: 0 });
        }
    }
}
