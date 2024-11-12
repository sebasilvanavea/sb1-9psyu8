import { Wine, Beer, GlassWater, Sparkles, ChevronRight, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const categories: Category[] = [
  { id: 'todos', name: 'Todos los Productos', icon: <Wine className="h-5 w-5" /> },
  { id: 'vinos', name: 'Vinos', icon: <Wine className="h-5 w-5" /> },
  { id: 'cervezas', name: 'Cervezas', icon: <Beer className="h-5 w-5" /> },
  { id: 'destilados', name: 'Destilados', icon: <GlassWater className="h-5 w-5" /> },
  { id: 'espumantes', name: 'Espumantes', icon: <Sparkles className="h-5 w-5" /> },
];

interface SidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function Sidebar({ selectedCategory, onSelectCategory }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  return (
    <>
      {/* Botón de menú móvil */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed bottom-4 right-4 z-50 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition-colors flex items-center space-x-2 pr-4 pl-3 py-3"
      >
        <Menu className="h-6 w-6" />
        <span className="text-sm font-medium">
          {currentCategory?.name || 'Categorías'}
        </span>
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 transition-all duration-300',
          'fixed md:sticky md:top-20 h-full md:h-[calc(100vh-5rem)] z-40',
          isCollapsed ? 'w-16' : 'w-64',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Botón de colapso escritorio */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:block absolute -right-3 top-6 bg-purple-500 rounded-full p-1 text-white hover:bg-purple-600 transition-colors"
        >
          <ChevronRight
            className={cn('h-4 w-4 transition-transform', 
              isCollapsed ? '' : 'rotate-180'
            )}
          />
        </button>

        {/* Lista de categorías */}
        <div className="p-4">
          <div className={cn('space-y-2', isCollapsed ? 'items-center' : '')}>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onSelectCategory(category.id);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  'w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  selectedCategory === category.id
                    ? 'bg-purple-500 text-white shadow-md transform scale-[1.02]'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white',
                  isCollapsed ? 'justify-center relative group' : ''
                )}
              >
                <div className={cn(
                  'flex items-center',
                  !isCollapsed && 'space-x-3'
                )}>
                  {category.icon}
                  {!isCollapsed && <span>{category.name}</span>}
                </div>
                
                {/* Tooltip */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 hidden group-hover:block">
                    <div className="bg-gray-900 text-white text-sm px-2 py-1 rounded whitespace-nowrap">
                      {category.name}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}