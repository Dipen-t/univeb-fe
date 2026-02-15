import { create } from 'zustand';

interface Song {
  queueId: number | string;
  title: string;
  artist: string;
  youtubeId: string;
  spotifyId?: string;
  coverUrl?: string;
  status?: 'playing' | 'waiting' | 'played';
}

interface StoreState {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  
  setSong: (song: Song) => void;
  addToQueue: (song: Song) => void;
  setQueue: (songs: Song[]) => void; // <--- MUST BE HERE
  removeFromQueue: () => void;
  setIsPlaying: (playing: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  currentSong: null,
  queue: [],
  isPlaying: false,

  setSong: (song) => set({ currentSong: song, isPlaying: true }),
  
  addToQueue: (song) => set((state) => ({ 
    queue: [...state.queue, song] 
  })),

  // <--- THIS FUNCTION IS REQUIRED FOR REFRESH TO WORK
  setQueue: (songs) => set({ queue: songs }),

  removeFromQueue: () => set((state) => ({
    queue: state.queue.slice(1) 
  })),

  setIsPlaying: (playing) => set({ isPlaying: playing }),
}));