'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Play, Pause, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mediaEmitter } from '@/lib/media-emitter';

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

  // Effect to pause this player if another one starts
  useEffect(() => {
    const handleOtherAudioPlay = (playingUrl: string) => {
        if (audioRef.current && playingUrl !== audioPreviewUrl) {
            audioRef.current.pause();
        }
    };

    mediaEmitter.on('audio-play-start', handleOtherAudioPlay);

    return () => {
        mediaEmitter.off('audio-play-start', handleOtherAudioPlay);
    };
  }, [audioPreviewUrl]);

  // Effect to set up and tear down the audio element and its listeners
  useEffect(() => {
    audioRef.current = new Audio(audioPreviewUrl);
    const audio = audioRef.current;

    const onCanPlay = () => setIsLoading(false);
    const onPlay = () => {
        setIsPlaying(true);
        mediaEmitter.emit('audio-play-start', audioPreviewUrl);
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onLoading = () => setIsLoading(true);

    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('waiting', onLoading);
    audio.addEventListener('stalled', onLoading);

    return () => {
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('waiting', onLoading);
      audio.removeEventListener('stalled', onLoading);
      audio.pause();
    };
  }, [audioPreviewUrl]);

  const handlePlayClick = () => {
    if (audioRef.current) {
      setIsLoading(true);
      audioRef.current.play().catch(() => setIsLoading(false)); // Handle potential play errors
    }
  };

  const handlePauseClick = () => {
    if (audioRef.current) {
      audioRef.current.pause();
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
      
      {isLoading ? (
        <Button variant="ghost" size="icon" className="rounded-full w-12 h-12" disabled>
          <Loader2 className="h-6 w-6 animate-spin" />
        </Button>
      ) : isPlaying ? (
        <Button variant="ghost" size="icon" onClick={handlePauseClick} className="rounded-full w-12 h-12">
          <Pause className="h-6 w-6" />
        </Button>
      ) : (
        <Button variant="ghost" size="icon" onClick={handlePlayClick} className="rounded-full w-12 h-12">
          <Play className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
