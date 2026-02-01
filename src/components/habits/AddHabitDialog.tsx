'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
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
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { addHabit } from '@/lib/firebase/firestore';

const formSchema = z.object({
  title: z.string().min(3, 'Habit must be at least 3 characters.').max(100, 'Habit must be 100 characters or less.'),
});

export function AddHabitDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'You must be logged in.' });
      return;
    }
    setLoading(true);
    try {
      await addHabit(firestore, user.uid, values.title);
      toast({ title: 'Habit added!', description: 'Your new habit is ready to be tracked.' });
      setIsOpen(false);
      form.reset();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error adding habit', description: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="fixed bottom-24 right-6 h-14 w-14 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-200 flex items-center justify-center hover:scale-110 transition-transform">
          <Plus className="h-7 w-7" />
          <span className="sr-only">Add Habit</span>
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white/80 dark:bg-black/80 backdrop-blur-lg border-white/20">
        <DialogHeader>
          <DialogTitle>What do you want to achieve?</DialogTitle>
          <DialogDescription>Add a new daily habit to your list.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habit</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Read for 15 minutes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Save Habit'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
