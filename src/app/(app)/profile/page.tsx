'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, useUser } from '@/firebase';
import { createProfile, getUserProfile } from '@/lib/firebase/firestore';
import { UserProfile } from '@/lib/firebase/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters.' })
    .max(20, { message: 'Username must be at most 20 characters.' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain letters, numbers, and underscores.',
    }),
  bio: z.string().max(160, { message: 'Bio must be at most 160 characters.' }).optional(),
});

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setProfileLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      bio: '',
    },
  });

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        setProfileLoading(true);
        const userProfile = await getUserProfile(firestore, user.uid);
        setProfile(userProfile);
        if (userProfile) {
          form.reset({
            username: userProfile.username,
            bio: userProfile.bio || '',
          });
        }
        setProfileLoading(false);
      }
    }
    fetchProfile();
  }, [user, firestore, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;

    setLoading(true);
    try {
      if (profile) {
        // Update existing profile
        const profileRef = doc(firestore, 'userProfiles', user.uid);
        await updateDoc(profileRef, {
            bio: values.bio,
            // username is immutable based on my security rules, so I won't update it here.
            // If the user wants to change username, that would be a more complex flow.
            // For now, they set it once.
        });
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been successfully updated.',
        });
        router.push('/feed');

      } else {
        // Create new profile
        await createProfile(firestore, user, values.username);
        toast({
          title: 'Profile Created',
          description: `Welcome, @${values.username}!`,
        });
        router.push('/feed');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            {profile ? 'Update your profile information.' : 'Choose a unique username to get started.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="@username" {...field} disabled={!!profile} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="animate-spin" /> : (profile ? 'Save Changes' : 'Create Profile')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
