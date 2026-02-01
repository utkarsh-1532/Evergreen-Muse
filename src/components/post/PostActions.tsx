'use client';
import { Button } from "@/components/ui/button";
import { Post } from "@/lib/firebase/types";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";

interface PostActionsProps {
    post: Post;
}

export const PostActions = ({ post }: PostActionsProps) => {
    return (
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <Heart className="mr-2 h-5 w-5" strokeWidth={1.5} />
              <span>{post.likeIds?.length || 0}</span>
              <span className="sr-only">Likes</span>
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle className="mr-2 h-5 w-5" strokeWidth={1.5} />
              <span className="sr-only">Comment</span>
              <span>Comment</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="mr-2 h-5 w-5" strokeWidth={1.5} />
              <span className="sr-only">Share</span>
              <span>Share</span>
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
