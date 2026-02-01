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
        <div className="aspect-square relative w-full bg-muted ring-1 ring-black/5">
            <SafeImage 
                src={post.imageUrl} 
                alt={post.imageCaption || 'Post image'} 
                fill 
                className="object-cover"
                priority={priority}
                sizes="(max-width: 768px) 100vw, 448px"
            />
        </div>
    )
}
