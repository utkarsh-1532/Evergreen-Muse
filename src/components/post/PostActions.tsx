'use client';
import { Button } from "@/components/ui/button";
import { Post } from "@/lib/firebase/types";
import { Heart, MessageCircle } from "lucide-react";

interface PostActionsProps {
    post: Post;
}

export const PostActions = ({ post }: PostActionsProps) => {
    return (
        <>
          <Button variant="ghost" size="sm">
            <Heart className="mr-2" />
            <span>{post.likeIds?.length || 0}</span>
            <span className="sr-only">Likes</span>
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="mr-2" />
            <span className="sr-only">Comment</span>
            <span>Comment</span>
          </Button>
      </>
    )
}
