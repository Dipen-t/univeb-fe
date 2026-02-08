'use client';

import { useEffect, useRef } from 'react';
import YouTube, { YouTubeEvent } from 'react-youtube';
import { useStore } from '@/store/useStore';

export default function YouTubePlayer() {
  const { currentSong, isPlaying } = useStore();
  const playerRef = useRef<any>(null);

  // 1. Sync Play/Pause with Global State
  useEffect(() => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  // 2. Handle Player Ready
  const onReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    console.log("📺 Next.js Player Ready");
  };

  if (!currentSong?.youtubeId) return null;

  return (
    <div className="hidden"> 
      {/* HIDDEN CLASS: We hide the actual video 
         so we can build our own custom UI on top.
      */}
      <YouTube
        videoId={currentSong.youtubeId}
        opts={{
          height: '0',
          width: '0',
          playerVars: {
            autoplay: 1,
            controls: 0, // Hide controls
            origin: typeof window !== 'undefined' ? window.location.origin : '',
          },
        }}
        onReady={onReady}
      />
    </div>
  );
}