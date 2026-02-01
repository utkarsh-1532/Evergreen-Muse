'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Post } from "@/lib/firebase/types";
import { formatDistanceToNow } from 'date-fns';

interface PostHeaderProps {
    post: Post;
}

export const PostHeader = ({ post }: PostHeaderProps) => {
    const getInitials = (name?: string | null) => {
        if (!name) return 'U';
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="flex items-center gap-4">
            <Avatar>
                <AvatarImage src={post.authorProfilePicUrl} />
                <AvatarFallback>{getInitials(post.authorUsername)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold">{post.authorUsername || 'Anonymous'}</p>
                <p className="text-sm text-muted-foreground">
                {post.timestamp ? formatDistanceToNow( (post.timestamp as any).toDate(), { addSuffix: true }) : 'just now'}
                </p>
            </div>
        </div>
    )
}
