'use client';

import { WithId } from '@/firebase/firestore/use-collection';
import { PostCard } from './PostCard';
import { Post } from '@/types';
import { PostCardSkeleton } from './PostCardSkeleton';
import { useSocial } from '@/hooks/useSocial';

export function PostFeed() {
  const { posts, isLoading, error } = useSocial();

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
      {posts.map((post: WithId<Post>, index: number) => (
        <PostCard key={post.id} post={post} priority={index < 2} />
      ))}
    </div>
  );
}
