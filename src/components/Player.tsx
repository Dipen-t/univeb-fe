'use client';

import { useStore } from '@/store/useStore';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWebSocket } from '@/hooks/useWebSocket';
export default function Player() {
  const { currentSong, isPlaying, setIsPlaying } = useStore();
    const { sendMessage } = useWebSocket();
  // 1. The "Empty State" (When no song is loaded)
  if (!currentSong) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
        <div className="w-64 h-64 bg-zinc-800 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
          <span className="text-zinc-500 text-6xl">🎵</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">No Music Playing</h2>
          <p className="text-zinc-400">Search for a song to start the vibe.</p>
        </div>
      </div>
    );
  }

  // 2. The "Active State" (Music is ready)
  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto px-6 space-y-8">
      
      {/* --- ALBUM ARTWORK --- */}
      <div className="relative w-full aspect-square">
        {/* The Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-cyan-500 blur-3xl opacity-20 rounded-full animate-pulse" />
        
        {/* The Image */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        >
          <img 
            src={currentSong.coverUrl || "https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163"} 
            alt="Album Art"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* --- SONG INFO --- */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-bold text-white tracking-tight truncate">
          {currentSong.title}
        </h1>
        <p className="text-lg text-zinc-400 font-medium truncate">
          {currentSong.artist}
        </p>
      </div>

      {/* --- CONTROLS --- */}
      <div className="flex items-center justify-center space-x-8">
        <button className="text-zinc-400 hover:text-white transition">
          <SkipBack size={32} />
        </button>

        {/* The Big Play Button */}
        <button 
          onClick={() => {
            // If playing, send PAUSE. If paused, send PLAY.
            const action = isPlaying ? "PAUSE" : "PLAY";
            sendMessage(action, null); 
            // Note: We don't setIsPlaying() here manually. 
            // We wait for the server to echo the command back.
          }}
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition shadow-lg shadow-white/10"
        >
          {isPlaying ? (
            <Pause size={36} fill="currentColor" />
          ) : (
            <Play size={36} fill="currentColor" className="ml-1" />
          )}
        </button>

        <button className="text-zinc-400 hover:text-white transition">
          <SkipForward size={32} />
        </button>
      </div>
      
      {/* Source Badge (Hidden Trick) */}
      <div className="px-3 py-1 bg-zinc-800 rounded-full text-xs font-mono text-zinc-500">
        Playing via {currentSong.youtubeId ? 'YouTube Audio' : 'Spotify'}
      </div>

    </div>
  );
}