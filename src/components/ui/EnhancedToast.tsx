import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/utils/utils';
import { RoyalIcon } from './RoyalIcon';
import { BounceAnimation, GlowPulse, ShimmerEffect } from './AnimationUtilities';
import { ToastContext, ToastContextType, EnhancedToastProps, EnhancedToastContainerProps } from './toast-context';
import { useEnhancedToast } from './useEnhancedToast';

export type { EnhancedToastProps, EnhancedToastContainerProps };

const ToastIcon: React.FC<{ type: EnhancedToastProps['type'] }> = ({ type }) => {
  const iconMap = {
    success: 'check',
    error: 'error',
    warning: 'warning',
    info: 'info',
    royal: 'crown'
  } as const;

  const colorMap = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
    royal: 'text-accent-primary'
  };

  if (type === 'royal') {
    return (
      <GlowPulse color="gold" intensity="medium" duration={2000}>
        <RoyalIcon variant="crown" size={24} className="filter drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]" />
      </GlowPulse>
    );
  }

  return (
    <BounceAnimation intensity="subtle" trigger="always">
      <RoyalIcon variant={iconMap[type]} size={20} className={colorMap[type]} />
    </BounceAnimation>
  );
};

const ToastProgress: React.FC<{ duration: number; isVisible: boolean }> = ({ duration, isVisible }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      const newProgress = (remaining / duration) * 100;
      
      setProgress(newProgress);

      if (newProgress <= 0) {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [duration, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 rounded-b-lg overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export const EnhancedToast: React.FC<EnhancedToastProps> = ({
  id,
  type,
  title,
  description,
  duration = 5000,
  position = 'bottom-right',
  showIcon = true,
  showProgress = true,
  animation = 'slide',
  soundEffect,
  onClose,
  className
}) => {
  // Use the id for debugging and soundEffect for audio feedback
  const toastId = id; // Store for debugging purposes
  const shouldPlaySound = soundEffect; // Store sound effect preference
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Debug log if needed (can be toggled with env var or removed for production)
    // import { debugLog } from '@/shared/utils/logger';
    // debugLog(`[EnhancedToast] Rendering toast: ${toastId}`);

    // Play sound effect if enabled
    if (shouldPlaySound) {
      // Create a simple beep sound for notifications
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(type === 'success' ? 800 : type === 'error' ? 400 : 600, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }

    // Trigger entrance animation
    const entranceTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Auto-dismiss timer
    const dismissTimer = setTimeout(() => {
      if (!isHovered) {
        setIsVisible(false);
        setTimeout(() => {
          onClose?.();
        }, 300);
      }
    }, duration);

    return () => {
      clearTimeout(entranceTimer);
      clearTimeout(dismissTimer);
    };
  }, [duration, isHovered, onClose, shouldPlaySound, toastId, type]);

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  const animationClasses = {
    bounce: 'animate-bounce-in',
    slide: 'animate-slide-in-right',
    fade: 'animate-fade-in',
    scale: 'animate-scale-in'
  };

  const typeStyles = {
    success: 'bg-green-900/90 border-green-500/50 text-white',
    error: 'bg-red-900/90 border-red-500/50 text-white',
    warning: 'bg-yellow-900/90 border-yellow-500/50 text-white',
    info: 'bg-blue-900/90 border-blue-500/50 text-white',
    royal: 'bg-gradient-to-br from-[#2D0A4E] to-[#1A0530] border-accent-primary text-white shadow-[0_0_15px_rgba(255,215,0,0.3)]'
  };

  const content = (
    <div className={cn(
      'fixed z-50',
      positionClasses[position],
      animationClasses[animation],
      !isVisible && 'opacity-0 transform translate-x-full',
      'transition-all duration-300 ease-out'
    )}>
      <div
        className={cn(
          'relative min-w-[300px] max-w-[400px] p-4 rounded-lg border shadow-2xl backdrop-blur-sm',
          typeStyles[type],
          'hover:scale-105 transition-transform',
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ShimmerEffect>
          <div className="flex items-start gap-3">
            {showIcon && (
              <div className="flex-shrink-0 mt-0.5">
                <ToastIcon type={type} />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <GlowPulse>
                <h3 className="text-sm font-bold mb-1">
                  {title}
                </h3>
              </GlowPulse>
              
              {description && (
                <p className="text-xs opacity-90 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => {
                  onClose?.();
                }, 300);
              }}
              className="flex-shrink-0 text-white/60 hover:text-white transition-colors ml-2"
            >
              <BounceAnimation intensity="subtle" trigger="hover">
                <RoyalIcon variant="close" size={16} />
              </BounceAnimation>
            </button>
          </div>
        </ShimmerEffect>

        {showProgress && (
          <ToastProgress duration={duration} isVisible={isVisible && !isHovered} />
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export const EnhancedToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toasts, addToast, removeToast } = useEnhancedToast();

  return (
    <ToastContext.Provider value={{ addToast: addToast as unknown as ToastContextType['addToast'], removeToast }}>
      {children}
      <EnhancedToastContainer 
        toasts={toasts} 
        onRemoveToast={removeToast} 
      />
    </ToastContext.Provider>
  );
};

export const EnhancedToastContainer: React.FC<EnhancedToastContainerProps> = ({
  toasts = [],
  position = 'bottom-right',
  maxToasts = 5,
  onRemoveToast
}) => {
  // Limit the number of visible toasts
  const visibleToasts = toasts.slice(0, maxToasts);

  return (
    <>
      {visibleToasts.map((toast, index) => (
        <EnhancedToast
          key={toast.id}
          {...toast}
          position={position}
          onClose={() => onRemoveToast(toast.id)}
          animation={index === 0 ? 'slide' : 'fade'}
        />
      ))}
    </>
  );
};
