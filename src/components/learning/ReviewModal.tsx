'use client';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { WithId } from '@/firebase/firestore/use-collection';
import { LearningSeed } from '@/lib/firebase/types';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { ThumbsDown, Brain, Sparkles, X, RotateCcw } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { updateSeedReview } from '@/lib/firebase/learning';
import { ReviewResult } from '@/lib/srs';
import { Progress } from '../ui/progress';

interface ReviewModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  dueSeeds: WithId<LearningSeed>[];
}

export function ReviewModal({ isOpen, onOpenChange, dueSeeds }: ReviewModalProps) {
  const { user } = useUser();
  const firestore = useFirestore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionSeeds, setSessionSeeds] = useState<WithId<LearningSeed>[]>([]);

  useEffect(() => {
    if (isOpen) {
      // When the modal opens, shuffle the due seeds for the session
      setSessionSeeds([...dueSeeds].sort(() => Math.random() - 0.5));
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [isOpen, dueSeeds]);

  const currentSeed = sessionSeeds[currentIndex];
  const totalSeeds = sessionSeeds.length;

  const handleReview = (result: ReviewResult) => {
    if (!user || !firestore || !currentSeed) return;

    updateSeedReview(firestore, user.uid, currentSeed, result);
    
    // Move to the next card
    if (currentIndex < totalSeeds - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex + 1), 150); // Delay for flip animation
    } else {
      // End of session
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  }

  const progress = totalSeeds > 0 ? ((currentIndex + 1) / totalSeeds) * 100 : 0;

  if (!currentSeed) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel sm:max-w-2xl h-[70vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Watering Session</DialogTitle>
          <DialogDescription>Review your knowledge seeds.</DialogDescription>
          <Button variant="ghost" size="icon" className="absolute top-3 right-3" onClick={handleClose}><X /></Button>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto">
            {/* Flashcard */}
            <div className="flex-1 flex items-center justify-center">
                <div 
                    className="w-full h-full relative"
                    style={{ perspective: '1000px' }}
                >
                    <div 
                        className={cn(
                            "absolute w-full h-full rounded-xl p-6 flex items-center justify-center text-center transition-transform duration-500 ease-in-out",
                            "[transform-style:preserve-3d] [backface-visibility:hidden]"
                        )}
                        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                    >
                        {/* Front */}
                        <div className="absolute w-full h-full bg-card rounded-xl [backface-visibility:hidden] flex items-center justify-center">
                            <p className="text-2xl font-semibold">{currentSeed.front}</p>
                        </div>
                        {/* Back */}
                        <div className="absolute w-full h-full bg-card rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden] flex items-center justify-center">
                             <p className="text-xl">{currentSeed.back}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="pt-6 mt-6 border-t">
                {!isFlipped ? (
                    <Button className="w-full" onClick={() => setIsFlipped(true)}>Reveal Answer</Button>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        <Button variant="destructive" className="flex-col h-20" onClick={() => handleReview('forgot')}>
                            <ThumbsDown className="mb-1"/> Forgot
                        </Button>
                        <Button variant="secondary" className="flex-col h-20" onClick={() => handleReview('hard')}>
                            <Brain className="mb-1"/> Hard
                        </Button>
                        <Button className="flex-col h-20 bg-forest-mid hover:bg-forest-mist" onClick={() => handleReview('easy')}>
                            <Sparkles className="mb-1"/> Easy
                        </Button>
                    </div>
                )}
            </div>
        </div>

        <div className="p-4 border-t flex items-center gap-4">
            <Progress value={progress} className="h-2" />
            <span className="text-sm font-medium text-muted-foreground">{currentIndex + 1} / {totalSeeds}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
