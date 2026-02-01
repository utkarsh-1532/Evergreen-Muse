'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, useUser, useStorage } from '@/firebase';
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
import { Loader2, Plus, Type, Image as ImageIcon, Music, Search, X } from 'lucide-react';
import { Post } from '@/lib/firebase/types';
import { useUserProfile } from '@/hooks/use-user-profile';
import { uploadImage } from '@/lib/firebase/storage';
import Image from 'next/image';

// Schemas for each post type
const textPostSchema = z.object({
  postType: z.literal('text'),
  title: z.string().max(100).optional(),
  text: z.string().min(1, 'Post content cannot be empty.'),
});

const imagePostSchema = z.object({
  postType: z.literal('image'),
  file: z.instanceof(File).refine((file) => file.size > 0, 'Please select an image.'),
  text: z.string().max(2200).optional(),
  imageCaption: z.string().max(200).optional(),
});

const songPostSchema = z.object({
  postType: z.literal('song'),
  songTitle: z.string().min(1, 'Song title is required.'),
  artistName: z.string().min(1, 'Artist name is required.'),
  albumArtUrl: z.string().url('Album art URL is required.'),
  audioPreviewUrl: z.string().url('Audio preview URL is required.'),
  text: z.string().max(2200).optional(),
});

const formSchema = z.discriminatedUnion('postType', [
  textPostSchema,
  imagePostSchema,
  songPostSchema,
]);

type FormValues = z.infer<typeof formSchema>;

interface ItunesResult {
  trackId: number;
  artistName: string;
  trackName: string;
  previewUrl: string;
  artworkUrl100: string;
}

export function CreatePostDialog() {
  const { user } = useUser();
  const { profile } = useUserProfile();
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'song'>('text');
  
  // Image states
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Music search states
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ItunesResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { postType: 'text', text: '' },
  });

  // Debounce effect for iTunes search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch from iTunes API when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const fetchMusic = async () => {
      setSearchLoading(true);
      try {
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(debouncedSearchTerm)}&media=music&entity=song&limit=5`);
        const data = await response.json();
        setSearchResults(data.results);
      } catch (error) {
        console.error('iTunes search failed:', error);
        toast({ variant: 'destructive', title: 'Could not fetch music results.' });
      } finally {
        setSearchLoading(false);
      }
    };

    fetchMusic();
  }, [debouncedSearchTerm, toast]);

  const handleTabChange = (value: string) => {
    const tab = value as 'text' | 'image' | 'song';
    setActiveTab(tab);
    form.reset();
    form.setValue('postType', tab);
    setImagePreview(null);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('file' as any, file); // Bypassing strict type for RHF
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const selectSong = (song: ItunesResult) => {
    form.setValue('songTitle' as any, song.trackName);
    form.setValue('artistName' as any, song.artistName);
    form.setValue('albumArtUrl' as any, song.artworkUrl100.replace('100x100', '600x600'));
    form.setValue('audioPreviewUrl' as any, song.previewUrl);
    setSearchResults([]);
    setSearchTerm(`${song.trackName} - ${song.artistName}`);
  }

  async function onSubmit(values: FormValues) {
    if (!user || !profile || !storage) {
      toast({ variant: 'destructive', title: 'You must be logged in to post.' });
      return;
    }
    setLoading(true);

    const postData: Partial<Omit<Post, 'id' | 'timestamp' | 'likeIds'>> = {
      authorId: user.uid,
      authorUsername: profile.username,
      authorProfilePicUrl: profile.profilePicUrl || '',
    };
    
    try {
      switch (values.postType) {
        case 'text':
          postData.title = values.title;
          postData.text = values.text;
          break;
        case 'image':
          const imageUrl = await uploadImage(storage, values.file, user.uid);
          postData.imageUrl = imageUrl;
          postData.imageCaption = values.imageCaption;
          postData.text = values.text || '';
          break;
        case 'song':
          postData.songTitle = values.songTitle;
          postData.artistName = values.artistName;
          postData.albumArtUrl = values.albumArtUrl;
          postData.audioPreviewUrl = values.audioPreviewUrl;
          postData.text = values.text || '';
          break;
      }
    
      createPost(firestore, postData);
    
      toast({ title: 'Post submitted!', description: 'Your post will appear shortly.' });
      setIsOpen(false);
      form.reset();
      setImagePreview(null);
      setSearchTerm('');
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Failed to create post', description: error.message });
    } finally {
        setLoading(false);
    }
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
              
              <TabsContent value="text" className="space-y-4 pt-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title (Optional)</FormLabel><FormControl><Input placeholder="A catchy title" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="text" render={({ field }) => (
                    <FormItem><FormLabel>Your Story</FormLabel><FormControl><Textarea placeholder="Share your thoughts..." {...field} value={field.value ?? ''} rows={8} /></FormControl><FormMessage /></FormItem>
                )} />
              </TabsContent>
              
              <TabsContent value="image" className="space-y-4 pt-4">
                 <FormField control={form.control} name="file" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Upload Image</FormLabel>
                        <FormControl><Input type="file" accept="image/*" onChange={handleFileChange} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                {imagePreview && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                        <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="cover" />
                    </div>
                )}
                 <FormField control={form.control} name="imageCaption" render={({ field }) => (
                    <FormItem><FormLabel>Caption (Optional)</FormLabel><FormControl><Input placeholder="A witty caption" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="text" render={({ field }) => (
                    <FormItem><FormLabel>Additional thoughts (Optional)</FormLabel><FormControl><Textarea placeholder="Add more context to your image..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                )} />
              </TabsContent>

              <TabsContent value="song" className="space-y-4 pt-4">
                <div className="relative">
                  <FormLabel>Search for a song</FormLabel>
                  <div className="relative mt-2">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input 
                       placeholder="Search artist or song title..." 
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="pl-10"
                     />
                     {searchTerm && <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setSearchTerm('')}><X className="h-4 w-4"/></Button>}
                  </div>
                  {searchLoading && <Loader2 className="animate-spin absolute right-2 bottom-2" />}
                  {searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
                      {searchResults.map((song) => (
                        <button key={song.trackId} type="button" onClick={() => selectSong(song)} className="w-full text-left p-2 hover:bg-accent flex items-center gap-3">
                          <Image src={song.artworkUrl100} alt={song.trackName} width={40} height={40} className="rounded-sm" />
                          <div>
                            <p className="font-medium text-sm">{song.trackName}</p>
                            <p className="text-xs text-muted-foreground">{song.artistName}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <FormField control={form.control} name="text" render={({ field }) => (
                    <FormItem><FormLabel>Why this song? (Optional)</FormLabel><FormControl><Textarea placeholder="What does this song mean to you?" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
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
