import { X, Star, ShoppingCart, Check } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { products } from '../data/products';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  rating?: number;
  category: string;
}

interface ProductDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onAddToCart: () => void;
}

export function ProductDetails({ isOpen, onClose, product: initialProduct, onAddToCart }: ProductDetailsProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(initialProduct);

  // Actualizar el producto actual cuando cambia el producto inicial
  useEffect(() => {
    setCurrentProduct(initialProduct);
    setIsAdded(false);
  }, [initialProduct]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
  };

  const handleAddToCart = () => {
    if (isAdded) return;
    onAddToCart();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Obtener productos relacionados de la misma categoría
  const relatedProducts = products
    .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
    .slice(0, 3);

  const handleChangeProduct = (newProduct: Product) => {
    setCurrentProduct(newProduct);
    setIsAdded(false);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white dark:bg-zinc-900 rounded-xl shadow-xl overflow-hidden">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-purple-500 text-white text-sm font-medium rounded-full">
                  {currentProduct.category}
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {currentProduct.name}
                  </h2>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-5 w-5",
                            star <= (currentProduct.rating || 4.5)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({currentProduct.rating || 4.5} / 5)
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                      {formatPrice(currentProduct.price)}
                    </span>
                  </div>

                  <div className="prose prose-sm dark:prose-invert mb-6">
                    <p className="text-gray-600 dark:text-gray-400">
                      {currentProduct.description}
                    </p>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={cn(
                      "w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 text-white font-medium",
                      isAdded
                        ? "bg-green-500"
                        : "bg-purple-500 hover:bg-purple-600 transform hover:scale-[1.02]"
                    )}
                  >
                    {isAdded ? (
                      <>
                        <Check className="h-5 w-5 animate-bounce" />
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
            </div>

            {relatedProducts.length > 0 && (
              <div className="p-6 border-t border-gray-200 dark:border-zinc-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Productos Relacionados
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {relatedProducts.map((relatedProduct) => (
                    <button
                      key={relatedProduct.id}
                      onClick={() => handleChangeProduct(relatedProduct)}
                      className="group relative bg-gray-50 dark:bg-zinc-800 rounded-lg p-2 transition-transform hover:scale-105"
                    >
                      <div className="aspect-square rounded-md overflow-hidden">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {relatedProduct.name}
                        </h4>
                        <p className="text-sm text-purple-500 font-medium">
                          {formatPrice(relatedProduct.price)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}