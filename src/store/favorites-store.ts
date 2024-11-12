import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[];
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (productId) =>
        set((state) => ({
          favorites: [...state.favorites, productId],
        })),
      removeFavorite: (productId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== productId),
        })),
      isFavorite: (productId) => get().favorites.includes(productId),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migración desde versión 0 a 1
          return {
            ...persistedState,
            favorites: persistedState.favorites || []
          };
        }
        return persistedState as FavoritesState;
      },
    }
  )
);