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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { addSeed } from '@/lib/firebase/learning';

const formSchema = z.object({
  front: z.string().min(1, 'Front content is required.'),
  back: z.string().min(1, 'Back content is required.'),
  category: z.string().optional(),
});

export function AddSeedDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { front: '', back: '', category: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'You must be logged in.' });
      return;
    }
    setLoading(true);
    try {
      await addSeed(firestore, user.uid, values);
      toast({ title: 'Seed planted!', description: 'Your new knowledge seed is ready to grow.' });
      setIsOpen(false);
      form.reset();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error planting seed', description: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="fixed bottom-24 right-6 z-30 h-14 w-14 rounded-full bg-primary text-white shadow-xl shadow-primary/40 flex items-center justify-center hover:scale-110 transition-transform active:scale-90">
          <Plus className="h-7 w-7" />
          <span className="sr-only">Add New Seed</span>
        </button>
      </DialogTrigger>
      <DialogContent className="glass-panel">
        <DialogHeader>
          <DialogTitle>Plant a new seed of knowledge</DialogTitle>
          <DialogDescription>Capture a new concept, fact, or link.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="front" render={({ field }) => (
              <FormItem>
                <FormLabel>Front (Question or Concept)</FormLabel>
                <FormControl><Textarea placeholder="e.g., What is Spaced Repetition?" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="back" render={({ field }) => (
              <FormItem>
                <FormLabel>Back (Answer or Definition)</FormLabel>
                <FormControl><Textarea placeholder="A learning technique that involves..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                <FormLabel>Category (Optional)</FormLabel>
                <FormControl><Input placeholder="e.g., Coding, Philosophy" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Plant Seed'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
