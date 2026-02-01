'use client';
import { MiniPlayer } from './MiniPlayer';
import { Post } from '@/lib/firebase/types';
import { SafeImage } from '../ui/SafeImage';
import { cn } from '@/lib/utils';

interface PostMediaProps {
    post: Post;
}

export const PostMedia = ({ post }: PostMediaProps) => {
    return (
        <>
            {post.imageUrl && (
                <div className="space-y-2">
                     <div className="aspect-[4/5] relative w-full overflow-hidden rounded-lg border">
                        <SafeImage 
                            src={post.imageUrl} 
                            alt={post.imageCaption || 'Post image'} 
                            fill 
                            className={cn("object-cover", {
                                'object-top': post.imagePosition === 'top',
                                'object-center': !post.imagePosition || post.imagePosition === 'center',
                                'object-bottom': post.imagePosition === 'bottom',
                            })}
                        />
                    </div>
                    {post.imageCaption && <p className="text-sm text-muted-foreground italic text-center">{post.imageCaption}</p>}
                </div>
            )}

            {post.songTitle && post.artistName && post.albumArtUrl && post.audioPreviewUrl && (
              <MiniPlayer 
                songTitle={post.songTitle}
                artistName={post.artistName}
                albumArtUrl={post.albumArtUrl}
                audioPreviewUrl={post.audioPreviewUrl}
              />
            )}
        </>
    )
}
