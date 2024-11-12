import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { auth } from '../lib/firebase';
import { User } from 'firebase/auth';

interface AuthUser {
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  user: AuthUser | null;
  logoutMessage: string | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  clearLogoutMessage: () => void;
  setAuthInitialized: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isAuthInitialized: false,
      user: null,
      logoutMessage: null,
      setUser: (user) => set({ isAuthenticated: !!user, user }),
      logout: () => {
        auth.signOut();
        set({ 
          isAuthenticated: false, 
          user: null,
          logoutMessage: '¡Hasta pronto! Has cerrado sesión correctamente.'
        });
      },
      clearLogoutMessage: () => set({ logoutMessage: null }),
      setAuthInitialized: () => set({ isAuthInitialized: true }),
      initializeAuth: () => {
        auth.onAuthStateChanged((user: User | null) => {
          if (user && user.email) {
            set({
              isAuthenticated: true,
              user: {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
              }
            });
          } else {
            set({ isAuthenticated: false, user: null });
          }
          set({ isAuthInitialized: true });
        });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            ...persistedState,
            isAuthInitialized: false,
            logoutMessage: null
          };
        }
        return persistedState as AuthState;
      },
    }
  )
);