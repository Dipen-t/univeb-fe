import { create } from 'zustand';

// Define the shape of a Song
interface Song {
  title: string;
  artist: string;
  youtubeId: string;
  spotifyId: string;
  coverUrl?: string;
}

// Define the Global State
interface AppState {
  roomID: string;
  currentSong: Song | null;
  isPlaying: boolean;
  role: 'HOST' | 'GUEST';
  
  // Actions
  setRoomID: (id: string) => void;
  setSong: (song: Song) => void;
  setIsPlaying: (playing: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  roomID: 'demo_room', // Default for now
  currentSong: null,
  isPlaying: false,
  role: 'HOST', // We assume everyone is a Host for the MVP

  setRoomID: (id) => set({ roomID: id }),
  setSong: (song) => set({ currentSong: song }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
}));