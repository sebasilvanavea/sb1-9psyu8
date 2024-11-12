import { X } from 'lucide-react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BannerState {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const useBannerStore = create<BannerState>()(
  persist(
    (set) => ({
      isVisible: true,
      setIsVisible: (visible) => set({ isVisible: visible }),
    }),
    {
      name: 'christmas-banner',
    }
  )
);

export function ChristmasBanner() {
  const { isVisible, setIsVisible } = useBannerStore();

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-green-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="text-base sm:text-lg font-bold whitespace-nowrap">
              🎄 ¡Ofertas Navideñas! 🎅
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-white/20 rounded-full px-3 py-1 text-sm">
                Vinos Reserva <span className="font-bold text-yellow-300">-30%</span>
              </span>
              <span className="bg-white/20 rounded-full px-3 py-1 text-sm">
                Espumantes <span className="font-bold text-yellow-300">-25%</span>
              </span>
            </div>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Cerrar banner"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}