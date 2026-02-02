'use client';
import { addDays, startOfDay } from 'date-fns';

// Exponential backoff intervals in days for each box
const srsIntervals: { [key: number]: number } = {
  0: 1, 
  1: 2,
  2: 4,
  3: 8,
  4: 16,
  5: 32,
};
const MAX_BOX = 5;

export type ReviewResult = 'forgot' | 'hard' | 'easy';

interface SrsUpdate {
    newBox: number;
    nextReviewDate: Date;
}

export function calculateSrsUpdate(currentBox: number, result: ReviewResult): SrsUpdate {
  let newBox: number;
  let daysToAdd: number;
  const today = startOfDay(new Date());

  switch (result) {
    case 'forgot':
      newBox = 0;
      daysToAdd = 1; // Review tomorrow to avoid immediate re-review
      break;
    case 'hard':
      newBox = currentBox; // Keep in the same box
      daysToAdd = 1; // Review again tomorrow
      break;
    case 'easy':
      newBox = Math.min(currentBox + 1, MAX_BOX);
      daysToAdd = srsIntervals[newBox] || 32;
      break;
  }
  
  const nextReviewDate = addDays(today, daysToAdd);

  return { newBox, nextReviewDate };
}
