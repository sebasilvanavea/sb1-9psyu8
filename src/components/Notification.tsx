import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, XCircle, Info } from 'lucide-react';
import { cn } from '../lib/utils';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  type: NotificationType;
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertCircle,
};

const styles = {
  success: 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200',
  error: 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200',
  info: 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
  warning: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
};

export function Notification({ 
  type, 
  message, 
  show, 
  onClose, 
  duration = 5000 
}: NotificationProps) {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const Icon = icons[type];

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-md',
          styles[type]
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-auto p-1 hover:opacity-70 transition-opacity"
          aria-label="Cerrar notificación"
        >
          <XCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}