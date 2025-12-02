import { useState } from 'react';
import { EnhancedToastProps } from './toast-context';

export const useEnhancedToast = () => {
  const [toasts, setToasts] = useState<EnhancedToastProps[]>([]);

  const addToast = (toast: Omit<EnhancedToastProps, 'id'> & { message?: string }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: EnhancedToastProps = {
      ...toast,
      description: toast.description || toast.message,
      id
    };
    
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts
  };
};
