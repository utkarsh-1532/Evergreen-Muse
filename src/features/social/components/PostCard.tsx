'use client';

import { Post } from '@/types';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { PostHeader } from './PostHeader';
import { PostMedia } from './PostMedia';
import { PostActions } from './PostActions';
import { MiniPlayer } from './MiniPlayer';
import { cn } from '@/lib/utils';
import { useSocial } from '@/hooks/useSocial';

interface PostCardProps {
  post: Post;
  priority?: boolean;
}

export function PostCard({ post, priority }: PostCardProps) {
  const hasSong = post.songTitle && post.artistName && post.albumArtUrl && post.audioPreviewUrl;
  const { deletePost, toggleLike } = useSocial();
  
  return (
    <Card className="rounded-3xl overflow-hidden glass-panel transition-all duration-300 will-change-transform">
      <CardHeader className="p-4">
        <PostHeader post={post} onDeletePost={deletePost} />
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative">
          <PostMedia post={post} priority={priority} />

          {hasSong && (
            <div className={cn(
                'z-10 w-11/12 max-w-sm',
                post.imageUrl ? 'absolute bottom-4 left-1/2 -translate-x-1/2' : 'px-4 pb-4'
            )}>
              <MiniPlayer 
                songTitle={post.songTitle!}
                artistName={post.artistName!}
                albumArtUrl={post.albumArtUrl!}
                audioPreviewUrl={post.audioPreviewUrl!}
              />
            </div>
          )}
        </div>
        
        {(post.title || post.text || post.imageCaption) && (
            <div className="space-y-4 p-4">
                {post.title && <h3 className="text-xl font-semibold leading-snug font-headline">{post.title}</h3>}
                
                {post.imageUrl && post.imageCaption && <p className="text-sm text-muted-foreground italic">{post.imageCaption}</p>}

                {post.text && <p className="whitespace-pre-wrap font-serif text-base leading-relaxed text-gray-800">{post.text}</p>}
            </div>
        )}
        
      </CardContent>
      <CardFooter className="flex items-center border-t p-2">
          <PostActions post={post} onToggleLike={toggleLike} />
      </CardFooter>
    </Card>
  )
}
