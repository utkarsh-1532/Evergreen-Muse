'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useStorage } from '@/firebase';
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
import { Post } from '@/types';
import { useUserProfile } from '@/hooks/use-user-profile';
import { uploadImageWithProgress } from '@/lib/firebase/storage';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import Cropper, { Area } from 'react-easy-crop';
import getCroppedImg from '@/lib/canvasUtils';

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

interface CreatePostDialogProps {
    createPost: (postData: Partial<Omit<Post, 'id' | 'authorId' | 'authorUsername' | 'authorProfilePicUrl' | 'timestamp' | 'likeIds'>>) => void;
    userId: string | undefined;
}

export function CreatePostDialog({ createPost, userId }: CreatePostDialogProps) {
  const { profile } = useUserProfile();
  const storage = useStorage();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'song'>('text');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ItunesResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSongSelected, setIsSongSelected] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { postType: 'text', text: '' },
  });

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm.trim() === '' || isSongSelected) {
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
  }, [debouncedSearchTerm, toast, isSongSelected]);

  const handleTabChange = (value: string) => {
    const tab = value as 'text' | 'image' | 'song';
    setActiveTab(tab);
    form.reset();
    form.setValue('postType', tab);
    setImagePreview(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setSearchTerm('');
    setSearchResults([]);
    setIsSongSelected(false);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('file' as any, file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setValue('file', undefined as any, { shouldValidate: true });
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };
  
  const selectSong = (song: ItunesResult) => {
    form.setValue('songTitle' as any, song.trackName);
    form.setValue('artistName' as any, song.artistName);
    form.setValue('albumArtUrl' as any, song.artworkUrl100.replace('100x100', '600x600'));
    form.setValue('audioPreviewUrl' as any, song.previewUrl);
    
    setIsSongSelected(true);
    setSearchResults([]);
    setSearchTerm(`${song.trackName} - ${song.artistName}`);
  }

  async function onSubmit(values: FormValues) {
    if (!userId || !profile || !storage) {
      toast({ variant: 'destructive', title: 'You must be logged in to post.' });
      return;
    }
    setLoading(true);
    
    const postData: Partial<Omit<Post, 'id' | 'authorId' | 'authorUsername' | 'authorProfilePicUrl' | 'timestamp' | 'likeIds'>> = {};
    
    try {
      switch (values.postType) {
        case 'text':
          postData.title = values.title;
          postData.text = values.text;
          break;
        case 'image':
          if (!imagePreview || !croppedAreaPixels) {
            throw new Error('Image preview or crop data is missing.');
          }

          setIsUploading(true);
          setUploadProgress(0);
          
          toast({
            title: 'Cropping image...',
            description: 'Getting your image ready for upload.',
          });

          const croppedImageFile = await getCroppedImg(imagePreview, croppedAreaPixels);
          if (!croppedImageFile) {
            throw new Error('Failed to crop image.');
          }
          
          toast({
            title: 'Uploading image...',
            description: 'Please wait, this may take a moment.',
          });
          const imageUrl = await uploadImageWithProgress(
            storage, 
            croppedImageFile, 
            userId,
            (progress) => setUploadProgress(progress)
          );

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
    
      createPost(postData);
    
      toast({ title: 'Post submitted!', description: 'Your post will appear shortly.' });
      setIsOpen(false);
      form.reset();
      handleTabChange('text');
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Failed to create post', description: error.message });
    } finally {
        setLoading(false);
        setIsUploading(false);
        setUploadProgress(0);
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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Share something new</DialogTitle>
          <DialogDescription>
            What's on your mind? Share a story, an image, or a song.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-2">
          <Form {...form}>
            <form id="create-post-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      <FormItem><FormLabel>Your Story</FormLabel><FormControl><Textarea placeholder="Share your thoughts..." {...field} value={field.value ?? ''} rows={12} /></FormControl><FormMessage /></FormItem>
                  )} />
                </TabsContent>
                
                <TabsContent value="image" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4 max-w-[320px]">
                          <FormField
                              control={form.control}
                              name="file"
                              render={() => (
                                  <FormItem>
                                      <FormLabel>Upload Image</FormLabel>
                                      <FormControl>
                                          <div className="relative">
                                              {!imagePreview ? (
                                                  <label
                                                      htmlFor="file-upload"
                                                      className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg cursor-pointer text-muted-foreground hover:bg-muted/50 transition-colors"
                                                  >
                                                      <ImageIcon className="w-12 h-12" />
                                                      <p className="mt-2 text-sm font-medium">Click to upload</p>
                                                      <p className="text-xs">Image will be cropped to 1:1</p>
                                                  </label>
                                              ) : (
                                                  <div className="relative w-full overflow-hidden border rounded-lg aspect-square bg-muted">
                                                      <Cropper
                                                          image={imagePreview}
                                                          crop={crop}
                                                          zoom={zoom}
                                                          aspect={1}
                                                          onCropChange={setCrop}
                                                          onZoomChange={setZoom}
                                                          onCropComplete={onCropComplete}
                                                          />
                                                      <Button
                                                          type="button"
                                                          variant="destructive"
                                                          size="icon"
                                                          className="absolute top-2 right-2 rounded-full h-8 w-8 disabled:opacity-50 z-10"
                                                          onClick={handleRemoveImage}
                                                          disabled={isUploading || loading}
                                                      >
                                                          <X className="w-4 h-4" />
                                                      </Button>
                                                      {isUploading && (
                                                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20">
                                                              <Progress value={uploadProgress} className="w-1/2" />
                                                              <p className="mt-2 text-sm font-medium text-primary-foreground">{Math.round(uploadProgress)}% uploaded</p>
                                                          </div>
                                                      )}
                                                  </div>
                                              )}
                                              <Input
                                                  id="file-upload"
                                                  ref={fileInputRef}
                                                  type="file"
                                                  accept="image/*"
                                                  className="hidden"
                                                  onChange={handleFileChange}
                                                  disabled={isUploading || loading}
                                              />
                                          </div>
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                          {imagePreview && (
                               <FormItem>
                                    <FormLabel>Zoom</FormLabel>
                                    <Slider
                                        value={[zoom]}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        onValueChange={(vals) => setZoom(vals[0])}
                                        disabled={isUploading || loading}
                                    />
                               </FormItem>
                          )}
                      </div>
                      <div className="space-y-4">
                      {imagePreview && (
                          <>
                              <FormField control={form.control} name="imageCaption" render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Caption (Optional)</FormLabel>
                                      <FormControl><Input placeholder="A witty caption" {...field} value={field.value ?? ''} disabled={isUploading || loading} /></FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )} />
                              <FormField control={form.control} name="text" render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Additional thoughts (Optional)</FormLabel>
                                      <FormControl><Textarea placeholder="Add more context to your image..." {...field} value={field.value ?? ''} disabled={isUploading || loading} rows={10} /></FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )} />
                          </>
                      )}
                      </div>
                  </div>
                </TabsContent>

                <TabsContent value="song" className="space-y-4 pt-4">
                  <div className="relative">
                    <FormLabel>Search for a song</FormLabel>
                    <div className="relative mt-2">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                       <Input 
                         placeholder="Search artist or song title..." 
                         value={searchTerm}
                         onChange={(e) => {
                           setSearchTerm(e.target.value);
                           setIsSongSelected(false);
                         }}
                         className="pl-10"
                       />
                       {searchTerm && <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setSearchTerm('')}><X className="h-4 w-4"/></Button>}
                    </div>
                    {searchLoading && <Loader2 className="animate-spin absolute right-2 bottom-2" />}
                    {searchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
                        {searchResults.map((song) => (
                          <button key={song.trackId} type="button" onClick={() => selectSong(song)} className="w-full text-left p-2 hover:bg-accent flex items-center gap-3">
                            <img src={song.artworkUrl100} alt={song.trackName} width={40} height={40} className="rounded-sm" />
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
                      <FormItem><FormLabel>Why this song? (Optional)</FormLabel><FormControl><Textarea placeholder="What does this song mean to you?" {...field} value={field.value ?? ''} rows={8}/></FormControl><FormMessage /></FormItem>
                  )} />
                </TabsContent>

              </Tabs>
            </form>
          </Form>
        </div>
        <DialogFooter className="p-6 pt-4 border-t">
          <Button type="submit" form="create-post-form" disabled={loading || isUploading}>
            {loading || isUploading ? <Loader2 className="animate-spin" /> : 'Post'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
