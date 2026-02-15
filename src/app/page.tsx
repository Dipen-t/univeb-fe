'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Music, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = async () => {
    setIsLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      const res = await fetch(`${backendUrl}/create-room`, { method: "POST" });
      const data = await res.json();
      
      if (data.code) {
        router.push(`/room/${data.code}`);
      }
    } catch (e) {
      console.error("Failed to create room", e);
      setIsLoading(false);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.length === 4) {
       router.push(`/room/${joinCode.toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 max-w-md w-full space-y-12 text-center"
      >
        {/* Logo */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20">
            <Music size={40} className="text-black" strokeWidth={2.5} />
          </div>
          <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            UnIvibe
          </h1>
          <p className="text-zinc-500">Listen together. In sync.</p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          
          {/* Create Button */}
          <button
            onClick={handleCreateRoom}
            disabled={isLoading}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl text-lg hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Create a Room"}
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-zinc-600">Or join existing</span>
            </div>
          </div>

          {/* Join Input */}
          <form onSubmit={handleJoin} className="relative group">
            <input 
              type="text" 
              placeholder="Enter 4-letter code"
              maxLength={4}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 text-center text-lg tracking-[0.5em] font-mono focus:outline-none focus:border-emerald-500 transition-colors uppercase placeholder:normal-case placeholder:tracking-normal"
            />
            <button 
              type="submit"
              disabled={joinCode.length !== 4}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center disabled:opacity-0 disabled:scale-50 transition-all hover:bg-emerald-500 hover:text-black"
            >
              <ArrowRight size={20} />
            </button>
          </form>
        </div>

      </motion.div>
    </div>
  );
}