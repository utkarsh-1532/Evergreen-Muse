'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Post } from "@/types";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PostActionsProps {
    post: Post;
    onToggleLike: (postId: string, isLiked: boolean) => void;
}

export const PostActions = ({ post, onToggleLike }: PostActionsProps) => {
    const { user } = useUser();
    const { toast } = useToast();

    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likeIds?.length || 0);

    useEffect(() => {
        if (user?.uid && post.likeIds) {
            setIsLiked(post.likeIds.includes(user.uid));
        }
    }, [user, post.likeIds]);

    const handleLikeClick = () => {
        if (!user) {
            toast({
                variant: 'destructive',
                title: 'You must be logged in to like a post.',
            });
            return;
        }

        const newLikeState = !isLiked;
        const newLikeCount = newLikeState ? likeCount + 1 : likeCount - 1;
        
        setIsLiked(newLikeState);
        setLikeCount(newLikeCount);

        onToggleLike(post.id, isLiked);
    };

    return (
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleLikeClick}>
              <Heart 
                className={cn("mr-2 h-5 w-5", isLiked ? "text-red-500 fill-current" : "")}
                strokeWidth={1.5} 
              />
              <span>{likeCount}</span>
              <span className="sr-only">Likes</span>
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle className="mr-2 h-5 w-5" strokeWidth={1.5} />
              <span className="sr-only">Comment</span>
              <span>Comment</span>
            </Button>
          </div>

          <div>
             <Button variant="ghost" size="icon">
                <Bookmark className="h-5 w-5" strokeWidth={1.5}/>
                <span className="sr-only">Bookmark</span>
            </Button>
          </div>
      </div>
    )
}
