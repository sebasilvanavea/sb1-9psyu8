import { useState, useEffect } from 'react';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Sidebar } from '../components/Sidebar';
import { useSearchStore } from '../store/search-store';
import { useAuthStore } from '../store/auth-store';

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const searchQuery = useSearchStore((state) => state.searchQuery);
  const { logoutMessage, clearLogoutMessage } = useAuthStore();

  useEffect(() => {
    if (logoutMessage) {
      const timer = setTimeout(() => {
        clearLogoutMessage();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [logoutMessage, clearLogoutMessage]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
    
    if (!searchQuery) return matchesCategory;

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {logoutMessage && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {logoutMessage}
        </div>
      )}
      
      <Sidebar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <main className="flex-1 bg-gray-50 dark:bg-zinc-950 transition-colors w-full">
        <div className="max-w-[2000px] mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
              Bienvenido a La Botillería
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Descubre nuestra selección premium de bebidas cuidadosamente seleccionadas para ti
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                No se encontraron productos que coincidan con tu búsqueda
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}