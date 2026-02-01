"use server";

import { suggestSoundtrack } from "@/ai/flows/suggest-soundtrack";
import { z } from "zod";

const SuggestionSchema = z.object({
  journalEntryText: z.string().min(10, "Journal entry is too short."),
});

type SuggestionResult = {
  success: boolean;
  data: {
    songTitle: string;
    artist: string;
  } | null;
  error: string | null;
};

export async function getSoundtrackSuggestion(
  prevState: any,
  formData: FormData
): Promise<SuggestionResult> {
  const validatedFields = SuggestionSchema.safeParse({
    journalEntryText: formData.get("journalEntryText"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      data: null,
      error: validatedFields.error.flatten().fieldErrors.journalEntryText?.[0] || 'Invalid input.',
    };
  }

  try {
    const result = await suggestSoundtrack({
      journalEntryText: validatedFields.data.journalEntryText,
    });
    return {
      success: true,
      data: {
        songTitle: result.suggestedSongTitle,
        artist: result.suggestedArtist,
      },
      error: null,
    };
  } catch (error) {
    console.error("AI suggestion failed:", error);
    return {
      success: false,
      data: null,
      error: "Failed to get a suggestion from AI. Please try again.",
    };
  }
}
