import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";

export function useWebSocket() {
  const socket = useRef<WebSocket | null>(null);
  const { setSong, setIsPlaying, addToQueue, removeFromQueue } = useStore();

  useEffect(() => {
    // 1. DYNAMIC URL LOGIC
    let backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "localhost:8080";
    
    // SAFETY FIX: Remove http:// or https:// if it exists to avoid double protocol
    backendUrl = backendUrl.replace(/^https?:\/\//, '');

    const protocol = backendUrl.includes("localhost") ? "ws" : "wss";
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
          // CASE 1: Play Immediately
          case "PLAY_NOW":
            const song = msg.data;
            console.log("▶ Playing Now:", song.Title);

            // Set as current song
            setSong({
              queueId: song.QueueID || song.queue_id || 'now-playing',
              title: song.Title,
              artist: song.Artist,
              youtubeId: song.YoutubeID,
              spotifyId: "none",
              coverUrl: song.CoverURL,
            });
            setIsPlaying(true);
            
            // OPTIONAL: If this song was in the queue, remove it.
            // For now, we assume the backend handles order, so we just shift the top.
            removeFromQueue(); 
            break;

          // CASE 2: Add to Queue
          case "QUEUE_ADDED":
            const queuedSong = msg.data;
            console.log("📝 Added to Queue:", queuedSong.Title);

            // Update the UI Store
            addToQueue({
              queueId: queuedSong.QueueID || queuedSong.queue_id,
              title: queuedSong.Title,
              artist: queuedSong.Artist,
              youtubeId: queuedSong.YoutubeID,
              coverUrl: queuedSong.CoverURL,
            });
            break;

          case "PLAY":
            setIsPlaying(true);
            break;

          case "PAUSE":
            setIsPlaying(false);
            break;
            
          case "QUEUE_EMPTY":
             console.log("📭 The party is over (Queue empty).");
             break;
        }
      } catch (e) {
        console.error("WS Error:", e);
      }
    };

    return () => {
      socket.current?.close();
    };
  }, [setSong, setIsPlaying, addToQueue, removeFromQueue]); 

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