'use client';

import { useCallback } from 'react';
import { useUser, useFirestore, useStorage, useMemoFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import {
  collection,
  query,
  orderBy,
  doc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from 'firebase/firestore';
import { ref as storageRef, deleteObject } from 'firebase/storage';
import { POSTS_COLLECTION } from '@/lib/constants';
import { Post } from '@/types';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useUserProfile } from './use-user-profile';

export function useSocial() {
  const { user } = useUser();
  const { profile } = useUserProfile();
  const firestore = useFirestore();
  const storage = useStorage();

  const postsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, POSTS_COLLECTION), orderBy('timestamp', 'desc'));
  }, [firestore]);

  const { data: posts, isLoading, error } = useCollection<Post>(postsQuery);

  const createPost = useCallback((postData: Partial<Omit<Post, 'id' | 'authorId' | 'authorUsername' | 'authorProfilePicUrl' | 'timestamp' | 'likeIds'>>) => {
    if (!user || !profile || !firestore) {
      throw new Error('User must be logged in to create a post.');
    }
    const postsCollectionRef = collection(firestore, POSTS_COLLECTION);
    const newPostData = {
      ...postData,
      authorId: user.uid,
      authorUsername: profile.username,
      authorProfilePicUrl: profile.profilePicUrl || '',
      timestamp: serverTimestamp(),
      likeIds: [],
    };
    addDocumentNonBlocking(postsCollectionRef, newPostData);
  }, [firestore, user, profile]);

  const deletePost = useCallback(async (postId: string, imageUrl?: string) => {
    if (!firestore || !storage) throw new Error("Firestore or storage not available.");
    if (imageUrl) {
      try {
        const imageRef = storageRef(storage, imageUrl);
        await deleteObject(imageRef);
      } catch (error: any) {
        console.warn(`Failed to delete image ${imageUrl}:`, error);
      }
    }
    const postRef = doc(firestore, POSTS_COLLECTION, postId);
    await deleteDoc(postRef);
  }, [firestore, storage]);

  const toggleLike = useCallback((postId: string, isLiked: boolean) => {
    if (!firestore || !user) throw new Error("User or firestore not available.");
    const postRef = doc(firestore, POSTS_COLLECTION, postId);
    const updateData = {
      likeIds: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
    };
    updateDocumentNonBlocking(postRef, updateData);
  }, [firestore, user]);

  return {
    posts: posts || [],
    isLoading,
    error,
    createPost,
    deletePost,
    toggleLike,
  };
}
