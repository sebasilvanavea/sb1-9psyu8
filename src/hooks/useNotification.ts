import { useState, useCallback } from 'react';
import { NotificationType } from '../components/Notification';

interface NotificationState {
  type: NotificationType;
  message: string;
  show: boolean;
}

export function useNotification() {
  const [notification, setNotification] = useState<NotificationState>({
    type: 'info',
    message: '',
    show: false,
  });

  const showNotification = useCallback((type: NotificationType, message: string) => {
    setNotification({ type, message, show: true });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, show: false }));
  }, []);

  return {
    notification,
    showNotification,
    hideNotification,
  };
}