'use client';
import { Post } from '@/lib/firebase/types';
import { SafeImage } from '../ui/SafeImage';

interface PostMediaProps {
    post: Post;
    priority?: boolean;
}

export const PostMedia = ({ post, priority }: PostMediaProps) => {
    if (!post.imageUrl) {
        return null;
    }

    return (
        <div className="aspect-[4/5] relative w-full bg-muted">
            <SafeImage 
                src={post.imageUrl} 
                alt={post.imageCaption || 'Post image'} 
                fill 
                className="object-cover"
                priority={priority}
                sizes="(max-width: 640px) 100vw, 448px"
            />
        </div>
    )
}
