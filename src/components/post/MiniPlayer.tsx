'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Play, Pause, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MiniPlayerProps {
  songTitle: string;
  artistName: string;
  albumArtUrl: string;
  audioPreviewUrl: string;
}

export function MiniPlayer({ songTitle, artistName, albumArtUrl, audioPreviewUrl }: MiniPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio(audioPreviewUrl);
    const audio = audioRef.current;

    const handleCanPlay = () => setIsLoading(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleLoading = () => setIsLoading(true);

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleLoading);
    audio.addEventListener('stalled', handleLoading);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleLoading);
      audio.removeEventListener('stalled', handleLoading);
      audio.pause();
    };
  }, [audioPreviewUrl]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        setIsLoading(true);
        audioRef.current.play().catch(() => setIsLoading(false)); // Handle potential play errors
      }
    }
  };

  return (
    <div className="flex items-center gap-4 rounded-md border p-4">
      <div className="relative h-16 w-16 shrink-0">
        <Image src={albumArtUrl} alt={songTitle} fill className="rounded-md object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{songTitle}</p>
        <p className="text-sm text-muted-foreground truncate">{artistName}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={togglePlayPause} className="rounded-full w-12 h-12" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}
