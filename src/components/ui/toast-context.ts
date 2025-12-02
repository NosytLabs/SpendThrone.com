import { createContext } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'royal';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastContextType {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export interface EnhancedToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'royal';
  title: string;
  description?: string;
  duration?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  showIcon?: boolean;
  showProgress?: boolean;
  animation?: 'bounce' | 'slide' | 'fade' | 'scale';
  soundEffect?: boolean;
  onClose?: () => void;
  className?: string;
}

export interface EnhancedToastContainerProps {
  toasts: EnhancedToastProps[];
  onRemoveToast: (id: string) => void;
  position?: EnhancedToastProps['position'];
  maxToasts?: number;
}
