import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';

export function useWebSocket() {
  const socket = useRef<WebSocket | null>(null);
  const { setSong, setIsPlaying } = useStore();

  useEffect(() => {
    // 1. DYNAMIC URL LOGIC
    // If we are on Vercel, we need wss:// (Secure).
    // If we are on Localhost, we use ws:// (Insecure).
    
    // Get the domain from env, or default to localhost
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'localhost:8080';
    
    // If the URL contains "localhost", use "ws", otherwise use "wss"
    const protocol = backendUrl.includes('localhost') ? 'ws' : 'wss';
    
    // Construct the full URL
    const wsUrl = `${protocol}://${backendUrl}/ws?room=demo_room`;
    
    console.log(`🔌 Connecting to: ${wsUrl}`);

    // 2. CONNECT
    socket.current = new WebSocket(wsUrl);

    // 3. HANDLE MESSAGES
    socket.current.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log("📩 Received:", msg);

        switch (msg.type) {
          case 'SEARCH_RESULT':
            const track = msg.data;
            setSong({
              title: track.title,
              artist: track.artist,
              youtubeId: track.youtube_id,
              spotifyId: track.spotify_id,
              coverUrl: `https://img.youtube.com/vi/${track.youtube_id}/hqdefault.jpg`
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
  }, [setSong, setIsPlaying]); // Add dependencies to keep React happy

  // 4. HELPER TO SEND MESSAGES
  const sendMessage = (type: string, data: any) => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({ type, data }));
    } else {
      console.warn("⚠️ WebSocket not ready");
    }
  };

  return { sendMessage };
}