'use client';

import { Post, UserProfile } from '@/lib/firebase/types';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserProfileById } from '@/hooks/use-user-profile-by-id';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Music, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';

interface PostCardProps {
  post: Post;
}

const AuthorHeader = ({ authorId, timestamp }: { authorId: string, timestamp: any }) => {
    const { profile: authorProfile, isLoading: isAuthorLoading } = useUserProfileById(authorId);

    const getInitials = (name?: string | null) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length > 1) {
            return parts[0][0] + parts[parts.length - 1][0];
        }
        return name.substring(0, 2).toUpperCase();
    };

    if (isAuthorLoading) {
        return (
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-3 w-[100px]" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={authorProfile?.profilePicUrl} />
              <AvatarFallback>{getInitials(authorProfile?.username)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{authorProfile?.username || 'Anonymous'}</p>
              <p className="text-sm text-muted-foreground">
                {timestamp ? formatDistanceToNow( (timestamp as any).toDate(), { addSuffix: true }) : 'just now'}
              </p>
            </div>
        </div>
    )
}


export function PostCard({ post }: PostCardProps) {
  
  return (
    <Card>
      <CardHeader>
        <AuthorHeader authorId={post.authorId} timestamp={post.timestamp} />
      </CardHeader>
      <CardContent className="space-y-4">
        {post.title && <h3 className="text-xl font-semibold leading-snug">{post.title}</h3>}
        
        {post.imageUrl && (
            <div className="space-y-2">
                 <div className="aspect-video relative w-full overflow-hidden rounded-lg border">
                    <Image src={post.imageUrl} alt={post.imageCaption || 'Post image'} fill className="object-cover" />
                </div>
                {post.imageCaption && <p className="text-sm text-muted-foreground italic text-center">{post.imageCaption}</p>}
            </div>
        )}

        {post.songTitle && (
            <div className="flex items-center gap-4 rounded-md border p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <Music className="h-8 w-8 text-primary" />
                </div>
                <div className='min-w-0'>
                    <p className="font-semibold truncate">{post.songTitle}</p>
                    <p className="text-sm text-muted-foreground truncate">{post.songArtist}</p>
                </div>
            </div>
        )}

        {post.text && <p className="whitespace-pre-wrap font-serif text-base leading-relaxed">{post.text}</p>}
        
      </CardContent>
      <CardFooter className="flex items-center gap-2 border-t pt-4 mt-4">
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
      </CardFooter>
    </Card>
  )
}
