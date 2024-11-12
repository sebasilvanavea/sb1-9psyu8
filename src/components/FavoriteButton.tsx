import { Heart } from 'lucide-react';
import { useFavoritesStore } from '../store/favorites-store';
import { cn } from '../lib/utils';

interface FavoriteButtonProps {
  productId: string;
  className?: string;
}

export function FavoriteButton({ productId, className }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const isProductFavorite = isFavorite(productId);

  const toggleFavorite = () => {
    if (isProductFavorite) {
      removeFavorite(productId);
    } else {
      addFavorite(productId);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite();
      }}
      className={cn(
        'absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm transition-all duration-300 hover:scale-110',
        className
      )}
      aria-label={isProductFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Heart
        className={cn(
          'h-5 w-5 transition-colors',
          isProductFavorite
            ? 'fill-red-500 text-red-500'
            : 'text-gray-600 dark:text-gray-400'
        )}
      />
    </button>
  );
}