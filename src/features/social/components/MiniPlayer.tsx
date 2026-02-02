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

    const onCanPlay = () => {
      setIsLoading(false);
    };
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

    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('waiting', onWaiting);

    return () => {
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('waiting', onWaiting);
      audio.pause();
    };
  }, [audioPreviewUrl]);

  const handlePlayClick = async () => {
    if (audioRef.current) {
      if (audioRef.current.readyState < 3) { // HAVE_FUTURE_DATA
        setIsLoading(true);
        audioRef.current.load(); // Preload if not ready
      }
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
    <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/30 p-1 pr-2 text-white shadow-2xl backdrop-blur-xl">
      <Image src={albumArtUrl} alt={songTitle} width={32} height={32} className="rounded-full object-cover aspect-square" />
      
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate text-xs text-white">{songTitle}</p>
        <p className="text-[10px] text-white/70 truncate">{artistName}</p>
      </div>
      
      <div className={cn("flex items-center justify-center gap-0.5 h-3 w-4", !isPlaying && "opacity-50")}>
        <span className={cn("w-0.5 h-full bg-white rounded-full", isPlaying && "animate-pulse [animation-delay:-0.3s]")} />
        <span className={cn("w-0.5 h-2/3 bg-white rounded-full", isPlaying && "animate-pulse [animation-delay:-0.1s]")} />
        <span className={cn("w-0.5 h-full bg-white rounded-full", isPlaying && "animate-pulse")} />
        <span className={cn("w-0.5 h-1/2 bg-white rounded-full", isPlaying && "animate-pulse [animation-delay:-0.2s]")} />
      </div>

      {isLoading ? (
        <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 text-white" disabled>
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      ) : isPlaying ? (
        <Button variant="ghost" size="icon" onClick={handlePauseClick} className="rounded-full w-8 h-8 text-white hover:bg-white/20">
          <Pause className="h-4 w-4" />
        </Button>
      ) : (
        <Button variant="ghost" size="icon" onClick={handlePlayClick} className="rounded-full w-8 h-8 text-white hover:bg-white/20">
          <Play className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
