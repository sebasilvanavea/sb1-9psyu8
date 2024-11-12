import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavoritesStore } from '../store/favorites-store';
import { useAuthStore } from '../store/auth-store';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export function Favorites() {
  const { favorites } = useFavoritesStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const favoriteProducts = products.filter((product) =>
    favorites.includes(product.id)
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-8">
          Mis Favoritos
        </h1>

        {favoriteProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No tienes productos favoritos aún
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}