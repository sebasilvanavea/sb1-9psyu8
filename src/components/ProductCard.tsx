import { ShoppingCart, Star, Info, Check } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../store/cart-store';
import { cn } from '../lib/utils';
import { FavoriteButton } from './FavoriteButton';
import { ProductDetails } from './ProductDetails';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  rating?: number;
  category: string;
}

export function ProductCard({ id, name, price, image, description, rating = 4.5, category }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
  };

  const handleAddToCart = () => {
    if (isAdded) return;
    addItem({ id, name, price, image });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <>
      <div
        className="group relative bg-white dark:bg-zinc-900 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative pt-[100%] bg-gray-100 dark:bg-zinc-800">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={cn(
                "absolute inset-0 bg-gray-200 dark:bg-zinc-700 transition-opacity duration-300",
                imageLoaded ? "opacity-0" : "opacity-100"
              )}
            />
            
            <img
              src={image}
              alt={name}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-all duration-500",
                imageLoaded ? "opacity-100" : "opacity-0",
                isHovered ? "scale-110" : "scale-100"
              )}
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <FavoriteButton productId={id} />
          
          <button
            onClick={() => setShowDetails(true)}
            className="absolute bottom-2 right-2 p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Ver detalles"
          >
            <Info className="h-5 w-5 text-purple-500" />
          </button>

          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200">
              {category}
            </span>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {name}
          </h3>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                {rating}
              </span>
            </div>
          </div>

          <p className="text-lg font-bold text-purple-500 mb-4">
            {formatPrice(price)}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={cn(
              "mt-auto w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-full transition-all duration-300",
              isAdded
                ? "bg-green-500 text-white"
                : "bg-purple-500 hover:bg-purple-600 text-white"
            )}
          >
            {isAdded ? (
              <>
                <Check className="h-5 w-5" />
                <span>¡Agregado!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                <span>Agregar al Carrito</span>
              </>
            )}
          </button>
        </div>
      </div>

      <ProductDetails
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        product={{ id, name, price, image, description, rating, category }}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}