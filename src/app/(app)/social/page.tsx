'use client';

import { useUserProfile } from '@/hooks/use-user-profile';
import { CreatePostDialog } from '@/components/post/CreatePostDialog';
import { PostFeed } from '@/components/post/PostFeed';
import FeatureBoundary from '@/components/FeatureBoundary';

export default function SocialPage() {
  const { profile } = useUserProfile();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold font-headline">Social Feed</h1>
                <p className="text-muted-foreground">
                    Share your thoughts and see what others are up to.
                </p>
            </div>
            {profile && <CreatePostDialog />}
        </div>
        
        <FeatureBoundary>
            <PostFeed />
        </FeatureBoundary>
    </div>
  );
}
