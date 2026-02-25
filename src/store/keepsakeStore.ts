import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Quote {
  id: string;
  text: string;
  timestamp: number;
}

interface KeepsakeStore {
  quotes: Quote[];
  addQuote: (text: string) => void;
}

export const useKeepsakeStore = create<KeepsakeStore>()(
  persist(
    (set) => ({
      quotes: [],
      addQuote: (text) =>
        set((state) => ({
          quotes: [
            {
              id: crypto.randomUUID(),
              text,
              timestamp: Date.now(),
            },
            ...state.quotes,
          ],
        })),
    }),
    {
      name: 'keepsake-storage',
    }
  )
);
