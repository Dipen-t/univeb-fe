import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';

const WS_URL = 'ws://localhost:8080/ws?room=demo_room';

export function useWebSocket() {
  const socket = useRef<WebSocket | null>(null);
  const { setSong, setIsPlaying } = useStore();

  useEffect(() => {
    // 1. Connect
    socket.current = new WebSocket(WS_URL);

    // 2. Handle Incoming Messages
    socket.current.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log("📩 Received:", msg);

        switch (msg.type) {
          case 'SEARCH_RESULT':
            // Python found a song! Update the store.
            const track = msg.data;
            setSong({
              title: track.title,
              artist: track.artist,
              youtubeId: track.youtube_id,
              spotifyId: track.spotify_id,
              coverUrl: `https://img.youtube.com/vi/${track.youtube_id}/hqdefault.jpg` // Get thumbnail from YouTube
            });
            break;

          case 'PLAY':
            setIsPlaying(true);
            break;

          case 'PAUSE':
            setIsPlaying(false);
            break;
        }
      } catch (e) {
        console.error("WS Error:", e);
      }
    };

    return () => {
      socket.current?.close();
    };
  }, []);

  // 3. Helper to Send Messages
  const sendMessage = (type: string, data: any) => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({ type, data }));
    } else {
      console.warn("⚠️ WebSocket not ready");
    }
  };

  return { sendMessage };
}