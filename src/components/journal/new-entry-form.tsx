"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getSoundtrackSuggestion } from "@/lib/actions";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Wand2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(1, "Title is required."),
  text: z.string().min(1, "Entry text is required."),
  songTitle: z.string().optional(),
  songArtist: z.string().optional(),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Save Entry
    </Button>
  );
}

function SuggestionButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="outline"
      size="sm"
      className="ml-auto"
      disabled={pending}
    >
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wand2 className="mr-2 h-4 w-4" />
      )}
      Suggest Soundtrack
    </Button>
  );
}

export default function NewEntryForm() {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      text: "",
      songTitle: "",
      songArtist: "",
    },
  });

  const [suggestionState, suggestionAction] = useFormState(
    getSoundtrackSuggestion,
    { success: false, data: null, error: null }
  );

  useEffect(() => {
    if (suggestionState.success && suggestionState.data) {
      form.setValue("songTitle", suggestionState.data.songTitle);
      form.setValue("songArtist", suggestionState.data.artist);
      toast({
        title: "Suggestion Added!",
        description: "We've filled in the soundtrack for you.",
      });
    } else if (suggestionState.error) {
      toast({
        variant: "destructive",
        title: "Suggestion Failed",
        description: suggestionState.error,
      });
    }
  }, [suggestionState, form, toast]);

  function onMainSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting main form:", values);
    toast({
      title: "Entry Saved!",
      description: "Your new journal entry has been saved.",
    });
    form.reset();
  }

  const journalText = form.watch("text");

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onMainSubmit)}>
          <CardHeader>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="A memorable day..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Thoughts</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell me about your day..."
                      className="min-h-[200px] font-serif"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Soundtrack</h3>
                <form action={suggestionAction}>
                  <input type="hidden" name="journalEntryText" value={journalText} />
                  <SuggestionButton />
                </form>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="songTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Song Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Yesterday" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="songArtist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Artist</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., The Beatles" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
