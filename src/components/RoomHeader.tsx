'use client';

import { useState } from 'react';
import { Copy, Check, Share2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RoomHeader({ roomCode }: { roomCode: string }) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleCopy = () => {
    // Creates a full URL like: http://localhost:3000/room/ABCD
    const url = `${window.location.origin}/room/${roomCode}`;
    navigator.clipboard.writeText(url);
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = () => {
    router.push('/');
  };

  return (
    <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
      
      {/* Room Info Badge */}
      <div className="pointer-events-auto flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-full p-1 pr-4 shadow-xl">
        <div className="w-8 h-8 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
            <Share2 size={14} className="text-emerald-500" />
        </div>
        
        <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase leading-none">
                Room Code
            </span>
            <span className="text-sm font-mono font-bold text-white tracking-widest leading-none">
                {roomCode}
            </span>
        </div>

        <div className="w-px h-6 bg-zinc-800 mx-2" />

        <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
        >
            {copied ? (
                <>
                    <Check size={14} className="text-emerald-500" />
                    <span className="text-emerald-500">Copied!</span>
                </>
            ) : (
                <>
                    <Copy size={14} />
                    <span>Copy Link</span>
                </>
            )}
        </button>
      </div>

      {/* Leave Button */}
      <button 
        onClick={handleLeave}
        className="pointer-events-auto p-2 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-full text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-all shadow-xl"
        title="Leave Room"
      >
        <LogOut size={18} />
      </button>

    </div>
  );
}