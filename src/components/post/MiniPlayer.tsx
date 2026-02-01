'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Play, Pause, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mediaEmitter } from '@/lib/media-emitter';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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
  const { toast } = useToast();

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

  useEffect(() => {
    if (!audioPreviewUrl) return;
    
    audioRef.current = new Audio(audioPreviewUrl);
    const audio = audioRef.current;

    const onPlaying = () => {
        setIsLoading(false);
        setIsPlaying(true);
        mediaEmitter.emit('audio-play-start', audioPreviewUrl);
    };
    const onPause = () => {
      setIsLoading(false);
      setIsPlaying(false);
    };
    const onEnded = () => {
      setIsLoading(false);
      setIsPlaying(false);
      audio.currentTime = 0;
    };
    const onWaiting = () => {
      setIsLoading(true);
    };

    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('waiting', onWaiting);

    return () => {
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('waiting', onWaiting);
      audio.pause();
    };
  }, [audioPreviewUrl]);

  const handlePlayClick = async () => {
    if (audioRef.current) {
      setIsLoading(true);
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error("Audio playback failed:", error);
        setIsLoading(false);
        setIsPlaying(false);
        toast({
          variant: 'destructive',
          title: 'Audio Error',
          description: 'The audio preview is unavailable.',
        });
      }
    }
  };

  const handlePauseClick = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };
  
  return (
    <div className="flex items-center gap-3 rounded-full border p-2 bg-background/80 backdrop-blur-sm shadow-sm">
      <Image src={albumArtUrl} alt={songTitle} width={48} height={48} className="rounded-full object-cover aspect-square" />
      
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate text-sm">{songTitle}</p>
        <p className="text-xs text-muted-foreground truncate">{artistName}</p>
      </div>
      
      <div className={cn("flex items-center justify-center gap-0.5 h-4 w-5", !isPlaying && "opacity-50")}>
        <span className={cn("w-1 h-full bg-primary rounded-full", isPlaying && "animate-pulse [animation-delay:-0.3s]")} />
        <span className={cn("w-1 h-2/3 bg-primary rounded-full", isPlaying && "animate-pulse [animation-delay:-0.1s]")} />
        <span className={cn("w-1 h-full bg-primary rounded-full", isPlaying && "animate-pulse")} />
        <span className={cn("w-1 h-1/2 bg-primary rounded-full", isPlaying && "animate-pulse [animation-delay:-0.2s]")} />
      </div>

      {isLoading ? (
        <Button variant="ghost" size="icon" className="rounded-full w-10 h-10" disabled>
          <Loader2 className="h-5 w-5 animate-spin" />
        </Button>
      ) : isPlaying ? (
        <Button variant="ghost" size="icon" onClick={handlePauseClick} className="rounded-full w-10 h-10">
          <Pause className="h-5 w-5" />
        </Button>
      ) : (
        <Button variant="ghost" size="icon" onClick={handlePlayClick} className="rounded-full w-10 h-10">
          <Play className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
