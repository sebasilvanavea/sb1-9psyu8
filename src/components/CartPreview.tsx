import { ShoppingBag, X, ChevronRight } from 'lucide-react';
import { useCartStore } from '../store/cart-store';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

interface CartPreviewProps {
  isOpen: boolean;
}

export function CartPreview({ isOpen }: CartPreviewProps) {
  const { items, removeItem, getTotal } = useCartStore();
  const total = getTotal();

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
  };

  if (items.length === 0) {
    return (
      <div
        className={cn(
          'fixed inset-x-0 top-[4rem] sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:w-64 mt-2 bg-white dark:bg-zinc-900 shadow-lg rounded-b-lg sm:rounded-lg transition-all transform',
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'
        )}
      >
        <div className="p-4 text-center">
          <ShoppingBag className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Tu carrito está vacío</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'fixed inset-x-0 top-[4rem] sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:w-64 mt-2 bg-white dark:bg-zinc-900 shadow-lg rounded-b-lg sm:rounded-lg transition-all transform',
        isOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'
      )}
    >
      <div className="max-h-[40vh] sm:max-h-[50vh] overflow-auto">
        <div className="p-3 space-y-2">
          {items.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center gap-2 group">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {item.name}
                </h4>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-purple-500">{formatPrice(item.price)}</p>
                  <span className="text-xs text-gray-500">x{item.quantity}</span>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Eliminar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {items.length > 2 && (
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-1">
              +{items.length - 2} productos más
            </p>
          )}
        </div>
      </div>

      <div className="p-3 border-t border-gray-100 dark:border-zinc-800">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-900 dark:text-white">Total</span>
          <span className="text-sm font-bold text-purple-500">{formatPrice(total)}</span>
        </div>
        <Link
          to="/cart"
          className="flex items-center justify-between w-full bg-purple-500 text-white px-3 py-2 rounded-full text-sm font-medium hover:bg-purple-600 transition-colors"
        >
          Ver Carrito
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}