'use client';

import { useEffect, useRef } from 'react';
import YouTube, { YouTubeEvent } from 'react-youtube';
import { useStore } from '@/store/useStore';
import { useWebSocket } from '@/context/WebSocketContext';

export default function YouTubePlayer() {
  const { currentSong, isPlaying } = useStore();
  const { sendMessage } = useWebSocket();
  const playerRef = useRef<any>(null);

  // 1. Handle Song Ending (Auto-Next)
  const onStateChange = (event: YouTubeEvent) => {
    // 0 = Ended
    if (event.data === 0) {
        console.log("🏁 Song Finished! Requesting NEXT_SONG...");
        sendMessage("NEXT_SONG", null);
    }
  };

  const onReady = (event: YouTubeEvent) => {
    console.log("📺 Player Ready");
    playerRef.current = event.target;
    // If we load in and it's supposed to be playing, hit play
    if (isPlaying) {
        event.target.playVideo();
    }
  };

  // 2. THE FIX: Listen for 'currentSong' changes too!
  useEffect(() => {
    if (!playerRef.current) return;
    
    try {
      if (isPlaying) {
        console.log("▶️ Force Play (Song Changed or Resumed)");
        playerRef.current.playVideo();
      } else {
        console.log("⏸️ Pause");
        playerRef.current.pauseVideo();
      }
    } catch (e) {
      console.warn("⚠️ Player Sync Error", e);
    }
  }, [isPlaying, currentSong]); // <--- ADDED 'currentSong' HERE

  if (!currentSong?.youtubeId) return null;

  return (
    <div className="hidden">
      <YouTube
        videoId={currentSong.youtubeId}
        opts={{
          height: '0', 
          width: '0',
          playerVars: { 
            autoplay: 1, 
            controls: 0,
            playsinline: 1 
          },
        }}
        onReady={onReady}
        onStateChange={onStateChange}
      />
    </div>
  );
}