'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, useUser } from '@/firebase';
import { createPost } from '@/lib/firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Type, Image as ImageIcon, Music } from 'lucide-react';
import { Post } from '@/lib/firebase/types';
import { useUserProfile } from '@/hooks/use-user-profile';

// Schemas for each post type
const textPostSchema = z.object({
  postType: z.literal('text'),
  title: z.string().max(100).optional(),
  text: z.string().min(1, 'Post content cannot be empty.'),
});

const imagePostSchema = z.object({
  postType: z.literal('image'),
  imageUrl: z.string().url('Please enter a valid image URL.'),
  text: z.string().max(2200).optional(),
  imageCaption: z.string().max(200).optional(),
});

const songPostSchema = z.object({
  postType: z.literal('song'),
  songTitle: z.string().min(1, 'Song title is required.'),
  songArtist: z.string().min(1, 'Artist name is required.'),
  text: z.string().max(2200).optional(),
});

const formSchema = z.discriminatedUnion('postType', [
  textPostSchema,
  imagePostSchema,
  songPostSchema,
]);

type FormValues = z.infer<typeof formSchema>;

export function CreatePostDialog() {
  const { user } = useUser();
  const { profile } = useUserProfile();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'song'>('text');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postType: 'text',
      text: '',
    },
  });
  
  const handleTabChange = (value: string) => {
      const tab = value as 'text' | 'image' | 'song';
      setActiveTab(tab);
      form.reset(); // Reset form when switching tabs to clear values and errors
      form.setValue('postType', tab);
  }

  function onSubmit(values: FormValues) {
    if (!user || !profile) {
        toast({ variant: 'destructive', title: 'You must have a complete profile to post.' });
        return;
    }
    setLoading(true);

    const postData: Partial<Omit<Post, 'id' | 'authorId' | 'authorUsername' | 'authorProfilePicUrl' | 'timestamp' | 'likeIds'>> = {};

    switch (values.postType) {
        case 'text':
            postData.title = values.title;
            postData.text = values.text;
            break;
        case 'image':
            postData.imageUrl = values.imageUrl;
            postData.imageCaption = values.imageCaption;
            postData.text = values.text || '';
            break;
        case 'song':
            postData.songTitle = values.songTitle;
            postData.songArtist = values.songArtist;
            postData.text = values.text || '';
            break;
    }
    
    const author = {
      uid: user.uid,
      username: profile.username,
      profilePicUrl: profile.profilePicUrl
    };

    createPost(firestore, author, postData);
    
    toast({ title: 'Post submitted!', description: 'Your post will appear shortly.' });
    setIsOpen(false);
    form.reset();
    setLoading(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share something new</DialogTitle>
          <DialogDescription>
            What's on your mind? Share a story, an image, or a song.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="text"><Type className="mr-2"/>Text</TabsTrigger>
                <TabsTrigger value="image"><ImageIcon className="mr-2"/>Image</TabsTrigger>
                <TabsTrigger value="song"><Music className="mr-2"/>Song</TabsTrigger>
              </TabsList>
              
              {/* Text Post Form */}
              <TabsContent value="text" className="space-y-4 pt-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title (Optional)</FormLabel>
                        <FormControl><Input placeholder="A catchy title" {...field} value={field.value ?? ''} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="text" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Your Story</FormLabel>
                        <FormControl><Textarea placeholder="Share your thoughts..." {...field} value={field.value ?? ''} rows={8} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
              </TabsContent>
              
              {/* Image Post Form */}
              <TabsContent value="image" className="space-y-4 pt-4">
                 <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl><Input placeholder="https://images.unsplash.com/..." {...field} value={field.value ?? ''} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="imageCaption" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Caption (Optional)</FormLabel>
                        <FormControl><Input placeholder="A witty caption" {...field} value={field.value ?? ''} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="text" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Additional thoughts (Optional)</FormLabel>
                        <FormControl><Textarea placeholder="Add more context to your image..." {...field} value={field.value ?? ''} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
              </TabsContent>

              {/* Song Post Form */}
              <TabsContent value="song" className="space-y-4 pt-4">
                 <FormField control={form.control} name="songTitle" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Song Title</FormLabel>
                        <FormControl><Input placeholder="e.g., Bohemian Rhapsody" {...field} value={field.value ?? ''} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="songArtist" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Artist</FormLabel>
                        <FormControl><Input placeholder="e.g., Queen" {...field} value={field.value ?? ''}/></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="text" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Why this song? (Optional)</FormLabel>
                        <FormControl><Textarea placeholder="What does this song mean to you?" {...field} value={field.value ?? ''} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
              </TabsContent>

            </Tabs>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Post'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
