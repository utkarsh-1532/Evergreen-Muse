'use server';

/**
 * @fileOverview AI agent that suggests soundtracks for journal entries.
 *
 * - suggestSoundtrack - A function that suggests soundtracks for a given journal entry.
 * - SuggestSoundtrackInput - The input type for the suggestSoundtrack function.
 * - SuggestSoundtrackOutput - The return type for the suggestSoundtrack function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSoundtrackInputSchema = z.object({
  journalEntryText: z.string().describe('The text content of the journal entry.'),
});

export type SuggestSoundtrackInput = z.infer<typeof SuggestSoundtrackInputSchema>;

const SuggestSoundtrackOutputSchema = z.object({
  suggestedSongTitle: z.string().describe('The suggested song title.'),
  suggestedArtist: z.string().describe('The suggested artist for the song.'),
});

export type SuggestSoundtrackOutput = z.infer<typeof SuggestSoundtrackOutputSchema>;

export async function suggestSoundtrack(input: SuggestSoundtrackInput): Promise<SuggestSoundtrackOutput> {
  return suggestSoundtrackFlow(input);
}

const suggestSoundtrackPrompt = ai.definePrompt({
  name: 'suggestSoundtrackPrompt',
  input: {schema: SuggestSoundtrackInputSchema},
  output: {schema: SuggestSoundtrackOutputSchema},
  prompt: `Based on the following journal entry, suggest a song that would be a suitable soundtrack.

Journal Entry:
{{journalEntryText}}

Please provide the song title and artist.

Title: {{suggestedSongTitle}}
Artist: {{suggestedArtist}}`,
});

const suggestSoundtrackFlow = ai.defineFlow(
  {
    name: 'suggestSoundtrackFlow',
    inputSchema: SuggestSoundtrackInputSchema,
    outputSchema: SuggestSoundtrackOutputSchema,
  },
  async input => {
    const {output} = await suggestSoundtrackPrompt(input);
    return output!;
  }
);
