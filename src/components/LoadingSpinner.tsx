import { FC } from 'react';

export const LoadingSpinner: FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm z-50">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-purple-200 dark:border-purple-900 animate-spin border-t-purple-500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <p className="text-purple-500 font-medium text-sm">Procesando...</p>
        </div>
      </div>
    </div>
  );
};