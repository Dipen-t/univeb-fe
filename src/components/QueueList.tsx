'use client';

import { useStore } from '@/store/useStore';
import { Trash2, BarChart3, Play, ListMusic, X, ChevronDown } from 'lucide-react';
import { useWebSocket } from '@/context/WebSocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function QueueList() {
  const { queue } = useStore(); 
  const { sendMessage } = useWebSocket();
  const [isOpen, setIsOpen] = useState(false); // Controls the Drawer
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size to switch modes
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleRemove = (e: React.MouseEvent, queueId: number) => {
    e.stopPropagation();
    if (!queueId) return;
    sendMessage("REMOVE_SONG", queueId);
  };

  const handleJump = (queueId: number) => {
    if (!queueId) return;
    sendMessage("JUMP_TO_SONG", queueId);
    if (isMobile) setIsOpen(false); // Close drawer after clicking on mobile
  };

  // --- THE LIST COMPONENT (Shared between Mobile & Desktop) ---
  const PlaylistContent = () => (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      <AnimatePresence mode="popLayout">
        {queue.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-zinc-600 text-sm text-center py-10 italic"
          >
            Queue is empty. Add some bangers!
          </motion.div>
        ) : (
          queue.map((song: any, index: number) => {
            const isPlaying = song.status === 'playing';
            const isPlayed = song.status === 'played';

            return (
              <motion.div
                key={song.queueId || index}
                layout
                onClick={() => handleJump(song.queueId)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isPlayed ? 0.5 : 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`group flex items-center space-x-3 p-3 rounded-xl transition cursor-pointer border border-transparent
                  ${isPlaying 
                    ? 'bg-emerald-900/20 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                    : 'bg-zinc-900/50 hover:bg-zinc-800 active:bg-zinc-800'
                  }
                `}
              >
                {/* Cover Art */}
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={song.coverUrl} 
                    alt={song.title} 
                    className={`w-full h-full object-cover ${isPlaying ? 'opacity-80' : ''}`}
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <BarChart3 className="text-emerald-400 w-6 h-6 animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium truncate text-sm ${isPlaying ? 'text-emerald-400 font-bold' : 'text-white'}`}>
                    {song.title}
                  </h4>
                  <p className={`text-xs truncate ${isPlaying ? 'text-emerald-600/80' : 'text-zinc-500'}`}>
                    {song.artist}
                  </p>
                </div>

                {/* Remove Button */}
                {song.queueId && (
                    <button
                      onClick={(e) => handleRemove(e, song.queueId)}
                      className={`p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all flex-shrink-0
                        ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} 
                      `}
                    >
                      <Trash2 size={18} />
                    </button>
                )}
              </motion.div>
            );
          })
        )}
      </AnimatePresence>
    </div>
  );

  // --- RENDER LOGIC ---

  // 1. MOBILE VIEW (Floating Button + Drawer)
  if (isMobile) {
    return (
      <>
        {/* Floating Toggle Button (Bottom Left) */}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 left-8 z-40 w-14 h-14 bg-zinc-800/80 backdrop-blur-md border border-zinc-700 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition"
        >
          <ListMusic size={24} />
          {/* Notification Badge */}
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-black">
            {queue.filter((s:any) => s.status !== 'played').length}
          </span>
        </button>

        {/* The Drawer Overlay */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
              />

              {/* Drawer Content */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-x-0 bottom-0 h-[80vh] bg-zinc-950 border-t border-zinc-800 rounded-t-3xl shadow-2xl z-[70] flex flex-col"
              >
                {/* Drawer Handle / Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50">
                   <div className="flex items-center gap-2">
                      <ListMusic className="text-emerald-500" size={20} />
                      <h3 className="text-white font-bold text-lg">Current Playlist</h3>
                   </div>
                   <button 
                     onClick={() => setIsOpen(false)}
                     className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white"
                   >
                     <ChevronDown size={24} />
                   </button>
                </div>

                {/* List Content */}
                <PlaylistContent />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // 2. DESKTOP VIEW (Standard List)
  return (
    <div className="h-full flex flex-col bg-zinc-950/30 border-l border-zinc-800/50">
       <div className="px-6 py-4 border-b border-zinc-800/30 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
          <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <ListMusic size={14} /> Playlist
          </h3>
       </div>
       <PlaylistContent />
    </div>
  );
}