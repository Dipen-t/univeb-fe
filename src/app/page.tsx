'use client';

import Player from '@/components/Player';
import SearchOverlay from '@/components/SearchOverlay';
import YouTubePlayer from '@/components/YouTubePlayer';
import { useWebSocket } from '@/hooks/useWebSocket';
export default function Home() {
  useWebSocket(); // Initialize WebSocket connection at the top level
  return (
    <main className="fixed inset-0 bg-black text-white overflow-hidden flex flex-col">
      
      {/* 1. BACKGROUND LAYERS */}
      {/* A subtle gradient mesh to make it look alive */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[100px]" />

      {/* 2. THE INVISIBLE ENGINE */}
      <YouTubePlayer />

      {/* 3. THE MAIN STAGE */}
      <div className="flex-1 relative z-10 flex flex-col">
        {/* Header */}
        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-zinc-500">LIVE SYNC</span>
          </div>
          <div className="text-xs font-mono text-zinc-600">ROOM: DEMO_1</div>
        </div>

        {/* The Player UI */}
        <div className="flex-1">
          <Player />
        </div>
      </div>

      {/* 4. THE INTERACTION LAYER */}
      <SearchOverlay />
      
    </main>
  );
}