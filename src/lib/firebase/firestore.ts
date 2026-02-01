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
  collection,
} from 'firebase/firestore';
import { updateProfile as updateAuthProfile, User } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Post, UserProfile } from './types';
import { POSTS_COLLECTION } from '@/lib/constants';

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
