'use client';

import { useStore } from '@/store/useStore';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWebSocket } from "@/context/WebSocketContext";

export default function Player() {
  const { currentSong, isPlaying } = useStore();
  const { sendMessage } = useWebSocket();

  // --- HANDLERS ---
  const handlePlayPause = () => {
    const action = isPlaying ? "PAUSE" : "PLAY";
    sendMessage(action, null);
  };

  const handleSkip = () => {
    console.log("⏭️ Skipping song...");
    sendMessage("NEXT_SONG", null);
  };

  const handlePrevious = () => {
    console.log("⏮️ Requesting Previous Song...");
    sendMessage("PREV_SONG", null);
  };

  // --- RENDER ---
  // 1. The "Empty State"
  if (!currentSong) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 sm:px-6 py-8 sm:py-12 text-center">
        <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">🎵</div>
        <h2 className="text-lg sm:text-xl font-bold text-white mb-2">No Music Playing</h2>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-xs">
          Search for a song to start the session.
        </p>
      </div>
    );
  }

  // 2. The "Active State"
  return (
    <div className="flex flex-col h-full px-4 sm:px-6 py-4 sm:py-6">
      {/* --- ALBUM ARTWORK --- */}
      <div className="flex-1 flex items-center justify-center mb-4 sm:mb-6">
        <motion.div
          key={currentSong.youtubeId || currentSong.spotifyId}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-full max-w-[280px] sm:max-w-xs md:max-w-sm aspect-square"
        >
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="w-full h-full object-cover rounded-2xl sm:rounded-3xl shadow-2xl"
          />
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-2xl sm:rounded-3xl border-4 border-emerald-500/50"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </motion.div>
      </div>

      {/* --- SONG INFO --- */}
      <div className="text-center mb-4 sm:mb-6 px-2">
        <motion.h2
          key={currentSong.title}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 truncate"
        >
          {currentSong.title}
        </motion.h2>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm sm:text-base text-zinc-400 truncate"
        >
          {currentSong.artist}
        </motion.p>
      </div>

      {/* --- CONTROLS --- */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 mb-4 sm:mb-6">
        {/* PREVIOUS BUTTON */}
        <button
          onClick={handlePrevious}
          className="p-3 sm:p-4 text-white hover:text-emerald-400 transition-all hover:scale-110 active:scale-95"
          aria-label="Previous song"
        >
          <SkipBack size={24} className="sm:w-7 sm:h-7" />
        </button>

        {/* PLAY/PAUSE */}
        <motion.button
          onClick={handlePlayPause}
          whileTap={{ scale: 0.95 }}
          className="p-4 sm:p-5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-lg hover:shadow-emerald-500/50 transition-all"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause size={28} className="sm:w-8 sm:h-8 fill-white" />
          ) : (
            <Play size={28} className="sm:w-8 sm:h-8 fill-white ml-1" />
          )}
        </motion.button>

        {/* SKIP BUTTON */}
        <button
          onClick={handleSkip}
          className="p-3 sm:p-4 text-white hover:text-emerald-400 transition-all hover:scale-110 active:scale-95"
          aria-label="Skip song"
        >
          <SkipForward size={24} className="sm:w-7 sm:h-7" />
        </button>
      </div>

      {/* Source Badge */}
      <div className="flex justify-center">
        <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-zinc-800/50 rounded-full text-[10px] sm:text-xs text-zinc-400 font-medium">
          {currentSong.youtubeId ? 'YouTube Audio' : 'Spotify'}
        </span>
      </div>
    </div>
  );
}