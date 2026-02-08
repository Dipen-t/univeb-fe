"use client";

import { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function SearchOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { setSong } = useStore();
  const { sendMessage } = useWebSocket();

const handleSearch = () => {
    if (!query) return;
    setIsSearching(true);
    
    // SEND TO GO BACKEND
    sendMessage("SEARCH", query);

    // Reset UI immediately (Result will come back via WebSocket later)
    setTimeout(() => {
      setIsOpen(false);
      setIsSearching(false);
      setQuery('');
    }, 500);
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full shadow-lg flex items-center justify-center z-50 transition-transform hover:scale-110 active:scale-90"
      >
        <Plus size={28} />
      </button>

      {/* The Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed inset-x-0 bottom-0 h-[80vh] bg-zinc-900 border-t border-zinc-800 rounded-t-3xl shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white">Add to Queue</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-zinc-800 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4">
              <div className="relative">
                <Search
                  className="absolute left-4 top-4 text-zinc-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search for a song..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full bg-zinc-800 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg placeholder:text-zinc-600"
                  autoFocus
                />
              </div>
            </div>

            {/* Results Area (Placeholder) */}
            <div className="flex-1 p-4 flex items-center justify-center text-zinc-500">
              {isSearching ? (
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
              ) : (
                <p>Type a song name and hit Enter</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
