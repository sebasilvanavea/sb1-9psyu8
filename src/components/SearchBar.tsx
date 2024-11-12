import { Search } from 'lucide-react';
import { useState } from 'react';
import { useSearchStore } from '../store/search-store';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const setSearchQuery = useSearchStore((state) => state.setSearchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(query);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSearchQuery(newQuery); // Actualizar la búsqueda en tiempo real
  };

  return (
    <div className="flex justify-center items-center w-full">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Buscar productos por nombre, categoría o descripción..."
            className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 dark:text-white bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </form>
    </div>
  );
}