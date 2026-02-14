'use client';

import { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWebSocket } from "@/context/WebSocketContext"; // <--- Correct Import

export default function SearchOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { sendMessage } = useWebSocket();

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsSearching(true);
    
    console.log("🔍 Sending Search:", query);
    sendMessage("SEARCH", query);

    // Reset UI
    setTimeout(() => {
      setIsOpen(false);
      setIsSearching(false);
      setQuery('');
    }, 500);
  };

  return (
    <>
      {/* --- THE BUTTON (High Z-Index) --- */}
      <button
        onClick={() => {
            console.log("➕ Plus Clicked!"); // Debug Log
            setIsOpen(true);
        }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full shadow-2xl flex items-center justify-center z-[100] transition-transform hover:scale-110 active:scale-95"
      >
        <Plus size={32} strokeWidth={2.5} />
      </button>

      {/* --- THE OVERLAY --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[101]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 h-[85vh] bg-zinc-900 border-t border-zinc-800 rounded-t-3xl shadow-2xl z-[102] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 flex items-center justify-between border-b border-zinc-800">
                <h2 className="text-2xl font-bold text-white tracking-tight">Add to Queue</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Search Input */}
              <div className="p-6">
                <div className="relative group">
                  <Search
                    className="absolute left-4 top-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors"
                    size={24}
                  />
                  <input
                    type="text"
                    placeholder="Search for a song..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full bg-zinc-950 text-white pl-14 pr-4 py-4 rounded-2xl border border-zinc-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-lg placeholder:text-zinc-600 transition-all shadow-inner"
                    autoFocus
                  />
                </div>
              </div>

              {/* Results Area (Placeholder) */}
              <div className="flex-1 p-6 flex flex-col items-center justify-center text-zinc-500 space-y-4">
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500"></div>
                    <p className="animate-pulse">Searching the universe...</p>
                  </>
                ) : (
                  <>
                    <Search size={48} className="opacity-20" />
                    <p>Type a song name and hit Enter</p>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}