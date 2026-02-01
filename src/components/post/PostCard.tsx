'use client';

import { Post } from '@/lib/firebase/types';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { PostHeader } from './PostHeader';
import { PostMedia } from './PostMedia';
import { PostActions } from './PostActions';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  
  return (
    <Card className="transition-shadow shadow-md hover:shadow-lg">
      <CardHeader>
        <PostHeader post={post} />
      </CardHeader>
      <CardContent className="space-y-4">
        {post.title && <h3 className="text-xl font-semibold leading-snug">{post.title}</h3>}
        
        <PostMedia post={post} />

        {post.text && <p className="whitespace-pre-wrap font-serif text-base leading-relaxed">{post.text}</p>}
        
      </CardContent>
      <CardFooter className="flex items-center gap-2 border-t pt-4 mt-4">
          <PostActions post={post} />
      </CardFooter>
    </Card>
  )
}
