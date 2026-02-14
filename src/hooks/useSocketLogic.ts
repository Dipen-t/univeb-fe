import { useCallback } from 'react';
import { useStore } from '@/store/useStore';

export function useSocketLogic() {
  const { setSong, setIsPlaying, addToQueue, setQueue } = useStore();

  const handleMessage = useCallback((msg: any) => {
    // Ignore PONGs
    if (msg.type !== 'PONG') console.log("📩 Received:", msg.type, msg.data);

    switch (msg.type) {
      case "PLAY_NOW":
        if (msg.data && (msg.data.Title || msg.data.title)) {
          setSong({
            title: msg.data.Title || msg.data.title,
            artist: msg.data.Artist || msg.data.artist,
            youtubeId: msg.data.YoutubeID || msg.data.youtube_id,
            coverUrl: msg.data.CoverURL || msg.data.cover_url,
          });
          setIsPlaying(true);
        }
        break;

      case "PAUSE":
        console.log("⏸️ Pausing");
        setIsPlaying(false);
        break;

      case "PLAY":
        console.log("▶️ Resuming");
        setIsPlaying(true);
        break;

      case "QUEUE_ADDED":
        if (msg.data) {
          addToQueue({
            queueId: msg.data.QueueID || msg.data.queue_id,
            title: msg.data.Title || msg.data.title,
            artist: msg.data.Artist || msg.data.artist,
            youtubeId: msg.data.YoutubeID || msg.data.youtube_id,
            coverUrl: msg.data.CoverURL || msg.data.cover_url,
            status: msg.data.Status || msg.data.status || 'waiting'
          });
        }
        break;

      case "SYNC_STATE":
        const state = msg.data;
        // 1. Sync Current Song
        if (state.current_song) {
          setSong({
            title: state.current_song.title,
            artist: state.current_song.artist,
            youtubeId: state.current_song.youtube_id,
            coverUrl: state.current_song.cover_url,
          });
          setIsPlaying(true);
        }
        // 2. Sync Queue
        if (state.queue && Array.isArray(state.queue)) {
          const formattedQueue = state.queue.map((s: any) => ({
            queueId: s.queue_id,
            title: s.title,
            artist: s.artist,
            youtubeId: s.youtube_id,
            coverUrl: s.cover_url,
            status: s.Status || s.status || 'waiting'
          }));
          setQueue(formattedQueue);
        }
        break;

      case "QUEUE_UPDATED":
        console.log("🔄 Queue Updated");
        if (Array.isArray(msg.data)) {
          const formattedQueue = msg.data.map((s: any) => ({
            queueId: s.queue_id,
            title: s.title,
            artist: s.artist,
            youtubeId: s.youtube_id,
            coverUrl: s.cover_url,
            status: s.Status || s.status || 'waiting'
          }));
          setQueue(formattedQueue);
        }
        break;

      case "QUEUE_EMPTY":
        console.log("📭 Queue is empty");
        break;
    }
  }, [setSong, setIsPlaying, addToQueue, setQueue]);

  return { handleMessage };
}