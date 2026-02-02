'use client';

import { useUser } from '@/firebase';
import { useSocial } from '@/hooks/useSocial';
import { CreatePostDialog } from '@/features/social/components/CreatePostDialog';
import { PostFeed } from '@/features/social/components/PostFeed';
import FeatureBoundary from '@/components/FeatureBoundary';

export default function SocialPage() {
  const { user } = useUser();
  const { createPost } = useSocial();

  return (
    <div className="max-w-[470px] mx-auto space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold font-headline">Social Feed</h1>
                <p className="text-muted-foreground">
                    Share your thoughts and see what others are up to.
                </p>
            </div>
            {user && <CreatePostDialog createPost={createPost} userId={user.uid} />}
        </div>
        
        <FeatureBoundary>
            <PostFeed />
        </FeatureBoundary>
    </div>
  );
}
