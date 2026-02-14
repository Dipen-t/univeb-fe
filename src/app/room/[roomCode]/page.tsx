'use client';

import { useParams } from 'next/navigation';
import { WebSocketProvider } from '@/context/WebSocketContext';
import Player from '@/components/Player';
import QueueList from '@/components/QueueList';
import SearchOverlay from '@/components/SearchOverlay';
import YouTubePlayer from '@/components/YouTubePlayer';
import RoomHeader from '@/components/RoomHeader'; // <--- Import it!

export default function RoomPage() {
  const params = useParams();
  const roomCode = params.roomCode as string;

  return (
    <WebSocketProvider roomCode={roomCode}>
      <main className="relative flex flex-col md:flex-row h-screen w-full bg-black text-white overflow-hidden">
        
        {/* ADD HEADER HERE */}
        <RoomHeader roomCode={roomCode} />

        {/* Player Section */}
        <div className="flex-1 relative z-10 flex items-center justify-center">
          <Player />
        </div>

        {/* Playlist Section */}
        <div className="w-full md:w-96 relative z-20 bg-zinc-900/30 border-l border-zinc-800/50 backdrop-blur-sm">
          <QueueList />
        </div>

        {/* Utilities */}
        <YouTubePlayer />
        <SearchOverlay />

      </main>
    </WebSocketProvider>
  );
}