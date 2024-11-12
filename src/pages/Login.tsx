import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Wine } from 'lucide-react';
import { signInWithGoogle, auth } from '../lib/firebase';
import { useAuthStore } from '../store/auth-store';
import { getRedirectResult } from 'firebase/auth';
import { useCartStore } from '../store/cart-store';

export function Login() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);

  // Determinar la página de redirección
  const getRedirectPath = () => {
    // Si viene de checkout, regresar ahí
    if (location.state?.from === '/checkout') {
      return '/checkout';
    }
    // Si hay items en el carrito, ir al carrito
    if (cartItems.length > 0) {
      return '/cart';
    }
    // Por defecto ir al home
    return '/';
  };

  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = getRedirectPath();
      navigate(redirectPath, { replace: true });
      return;
    }

    // Check for redirect result
    if (auth) {
      getRedirectResult(auth)
        .then((result) => {
          if (result?.user) {
            const redirectPath = getRedirectPath();
            navigate(redirectPath, { replace: true });
          }
        })
        .catch((error) => {
          console.error('Error getting redirect result:', error);
          setError('Error al iniciar sesión con Google. Por favor, intenta nuevamente.');
        });
    }
  }, [isAuthenticated, navigate, cartItems.length]);

  const handleGoogleLogin = async () => {
    if (isLoading) return;

    try {
      setError('');
      setIsLoading(true);
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con Google');
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const redirectPath = getRedirectPath();
    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Wine className="h-12 w-12 text-purple-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
          Iniciar Sesión
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {cartItems.length > 0 
            ? 'Elige cómo quieres continuar con tu compra'
            : 'Elige cómo quieres iniciar sesión'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-50 dark:bg-zinc-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-colors">
          {error && (
            <div className="mb-6 p-3 rounded bg-red-100 border border-red-400 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {isLoading ? 'Cargando...' : 'Continuar con Google'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-zinc-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 dark:bg-zinc-900 text-gray-500">
                  o
                </span>
              </div>
            </div>

            <button
              onClick={handleGuestLogin}
              className="w-full flex justify-center items-center px-4 py-3 rounded-full text-sm font-medium text-white bg-purple-500 hover:bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Continuar como Invitado
            </button>
          </div>

          {cartItems.length > 0 && (
            <div className="mt-6 bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Tienes {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} en tu carrito.
                Tu selección se mantendrá al iniciar sesión.
              </p>
            </div>
          )}

          <div className="mt-6">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Al continuar, aceptas nuestros términos y condiciones de servicio
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}