'use client';

import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  SetOptions,
  writeBatch,
  WriteBatch,
  Firestore,
  updateDoc,
} from 'firebase/firestore';
import { updateProfile as updateAuthProfile, User } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { UserProfile } from './types';

export async function createProfile(
  db: Firestore,
  user: User,
  username: string,
  bio?: string
) {
  const userProfileRef = doc(db, 'userProfiles', user.uid);
  const usernameRef = doc(db, 'usernames', username);

  try {
    await runTransaction(db, async (transaction) => {
      const usernameDoc = await transaction.get(usernameRef);
      if (usernameDoc.exists()) {
        throw new Error(`Username @${username} is already taken.`);
      }

      const userProfileDoc = await transaction.get(userProfileRef);
      if (userProfileDoc.exists()) {
        // Profile already exists, just update it if needed
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
    });

    // After transaction, update the auth user's display name
    await updateAuthProfile(user, { displayName: username });

  } catch (e: any) {
     // Re-throw transaction errors to be caught by the UI
    throw e;
  }
}

export async function getUserProfile(db: Firestore, userId: string): Promise<UserProfile | null> {
    const userProfileRef = doc(db, 'userProfiles', userId);
    const userProfileSnap = await getDoc(userProfileRef);
    if (userProfileSnap.exists()) {
        return { id: userProfileSnap.id, ...userProfileSnap.data() } as UserProfile;
    }
    return null;
}
