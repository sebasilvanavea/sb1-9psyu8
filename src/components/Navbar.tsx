import { ShoppingCart, User, Wine, Search, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth-store';
import { useCartStore } from '../store/cart-store';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from './SearchBar';
import { useState, useEffect } from 'react';

interface User {
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const [showSearch, setShowSearch] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
  };

  const userName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0];

  return (
    <>
      {showWelcome && isAuthenticated && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 text-center">
          <p className="text-sm font-medium">
            ¡Bienvenido{userName ? `, ${userName}` : ''}! 🎉
          </p>
        </div>
      )}
      
      <div className="bg-white dark:bg-black text-gray-900 dark:text-white shadow-lg sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between h-auto py-4 md:h-20">
            <Link to="/" className="flex items-center space-x-2">
              <Wine className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                La Botillería
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                aria-label="Buscar"
              >
                <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>

              <Link
                to="/cart"
                className="group relative flex items-center"
              >
                <ShoppingCart className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors" />
                {itemCount > 0 && (
                  <>
                    <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                      {itemCount}
                    </span>
                    <div className="hidden md:flex flex-col ml-3 text-sm">
                      <span className="font-medium text-purple-500">
                        {formatPrice(total)}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                      </span>
                    </div>
                  </>
                )}
              </Link>

              {isAuthenticated && user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 hover:text-purple-500 transition-colors"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Foto de perfil"
                        className="h-8 w-8 rounded-full border-2 border-purple-500"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                        {userName?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="hidden md:block">
                      <p className="text-sm font-medium">
                        {userName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Mi Perfil
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-full text-sm font-medium transition-colors text-white"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden md:inline">Cerrar Sesión</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
                >
                  <User className="h-6 w-6" />
                  <span className="hidden md:inline text-sm font-medium">Iniciar Sesión</span>
                </Link>
              )}
            </div>
          </div>
          {showSearch && (
            <div className="py-4 border-t border-gray-200 dark:border-zinc-800">
              <SearchBar />
            </div>
          )}
        </div>
      </div>
    </>
  );
}