'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/firebase";
import { Post } from "@/lib/firebase/types";
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from "lucide-react";
import { DeletePostDialog } from "./DeletePostDialog";

interface PostHeaderProps {
    post: Post;
}

export const PostHeader = ({ post }: PostHeaderProps) => {
    const { user } = useUser();
    const isOwner = user?.uid === post.authorId;

    const getInitials = (name?: string | null) => {
        if (!name) return 'U';
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
                <Avatar>
                    <AvatarImage src={post.authorProfilePicUrl} />
                    <AvatarFallback>{getInitials(post.authorUsername)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{post.authorUsername || 'Anonymous'}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">
                    {post.timestamp ? formatDistanceToNow( (post.timestamp as any).toDate(), { addSuffix: true }) : 'just now'}
                    </p>
                </div>
            </div>

            {isOwner && (
                <DeletePostDialog post={post}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete Post</span>
                    </Button>
                </DeletePostDialog>
            )}
        </div>
    )
}
