import { useAuthStore } from '../store/auth-store';
import { OrderHistory } from '../components/OrderHistory';
import { useLocation } from 'react-router-dom';

export function Profile() {
  const { user } = useAuthStore();
  const location = useLocation();
  const message = location.state?.message;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {message && (
          <div className="mb-8 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
            {message}
          </div>
        )}

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Mi Perfil
            </h1>
            <div className="flex items-center space-x-4">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Foto de perfil"
                  className="h-16 w-16 rounded-full border-2 border-purple-500"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-purple-500 flex items-center justify-center text-white text-xl">
                  {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user?.displayName || user?.email?.split('@')[0]}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Historial de Pedidos
            </h2>
            <OrderHistory />
          </div>
        </div>
      </div>
    </div>
  );
}