'use client';

import { useFirestore, useMemoFirebase } from '@/firebase';
import { useCollection, WithId } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import { PostCard } from './PostCard';
import { Post } from '@/lib/firebase/types';
import { POSTS_COLLECTION } from '@/lib/constants';
import { PostCardSkeleton } from './PostCardSkeleton';

export function PostFeed() {
  const firestore = useFirestore();

  const postsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // Query the top-level 'global_posts' collection
    return query(collection(firestore, POSTS_COLLECTION), orderBy('timestamp', 'desc'));
  }, [firestore]);

  const { data: posts, isLoading, error } = useCollection<Post>(postsQuery);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    );
  }

  if (error) {
    console.error("Error loading posts:", error);
    return <div className="text-center text-destructive bg-destructive/10 p-4 rounded-md">Error loading posts. Please try again later.</div>;
  }
  
  if (!posts || posts.length === 0) {
      return <div className="text-center text-muted-foreground py-20 bg-muted/50 rounded-lg">
          <h3 className='text-xl font-semibold'>No posts yet.</h3>
          <p>Be the first one to share something!</p>
        </div>
  }

  return (
    <div className="space-y-6">
      {posts.map((post: WithId<Post>) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
