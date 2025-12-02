import React, { useEffect, useState } from 'react';
import { cn } from '@/shared/utils/utils';

interface GlowPulseProps {
  children: React.ReactNode;
  color?: 'gold' | 'purple' | 'blue' | 'green';
  intensity?: 'subtle' | 'medium' | 'strong';
  duration?: number;
  className?: string;
}

export const GlowPulse: React.FC<GlowPulseProps> = ({ 
  children, 
  color = 'gold', 
  intensity = 'medium',
  duration = 2000,
  className 
}) => {
  const colorMap = {
    gold: 'shadow-accent-primary/50',
    purple: 'shadow-accent-secondary/50',
    blue: 'shadow-blue-500/50',
    green: 'shadow-green-500/50'
  };

  const intensityMap = {
    subtle: 'shadow-md',
    medium: 'shadow-lg',
    strong: 'shadow-xl'
  };

  return (
    <div 
      className={cn(
        "relative",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-inherit animate-pulse will-change-[opacity,box-shadow]",
          colorMap[color],
          intensityMap[intensity]
        )}
        style={{ animationDuration: `${duration}ms`, zIndex: -1 }}
      />
      {children}
    </div>
  );
};

interface EntranceAnimationProps {
  children: React.ReactNode;
  type?: 'fade-in' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale';
  delay?: number;
  duration?: number;
  className?: string;
  trigger?: 'immediate' | 'in-view';
  as?: React.ElementType;
}

export const EntranceAnimation: React.FC<EntranceAnimationProps> = ({ 
  children, 
  type = 'fade-in',
  delay = 0,
  duration = 600,
  className,
  trigger = 'in-view',
  as: Component = 'div'
}) => {
  const [isVisible, setIsVisible] = useState(trigger === 'immediate');
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (trigger === 'in-view' && ref) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(ref);

      return () => {
        if (ref) {
          observer.unobserve(ref);
        }
      };
    }
  }, [ref, trigger]);

  const animationMap = {
    'fade-in': 'animate-fade-in',
    'slide-up': 'animate-slide-up',
    'slide-down': 'animate-slide-down',
    'slide-left': 'animate-slide-left',
    'slide-right': 'animate-slide-right',
    'scale': 'animate-scale'
  };

  const style = {
    animationDelay: `${delay}ms`,
    animationDuration: `${duration}ms`,
    animationFillMode: 'both',
    willChange: 'opacity, transform'
  } as React.CSSProperties;

  return (
    <Component 
      ref={trigger === 'in-view' ? setRef : undefined}
      className={cn(
        isVisible ? animationMap[type] : 'opacity-0',
        className
      )}
      style={style}
    >
      {children}
    </Component>
  );
};

interface ShimmerEffectProps {
  children: React.ReactNode;
  className?: string;
  speed?: 'slow' | 'medium' | 'fast';
}

export const ShimmerEffect: React.FC<ShimmerEffectProps> = ({ 
  children, 
  className,
  speed = 'medium'
}) => {
  const speedMap = {
    slow: 'animate-shimmer-slow',
    medium: 'animate-shimmer',
    fast: 'animate-shimmer-fast'
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className={cn("absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent", speedMap[speed])} />
      {children}
    </div>
  );
};

interface FloatingAnimationProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  delay?: number;
  className?: string;
}

export const FloatingAnimation: React.FC<FloatingAnimationProps> = ({ 
  children, 
  direction = 'up',
  distance = 10,
  duration = 3000,
  delay = 0,
  className
}) => {
  const directionMap = {
    up: 'animate-float-up',
    down: 'animate-float-down',
    left: 'animate-float-left',
    right: 'animate-float-right'
  };

  const style = {
    '--float-distance': `${distance}px`,
    animationDuration: `${duration}ms`,
    animationDelay: `${delay}ms`,
    willChange: 'transform'
  } as React.CSSProperties;

  return (
    <div 
      className={cn(directionMap[direction], className)}
      style={style}
    >
      {children}
    </div>
  );
};

interface TextGradientAnimationProps {
  children: string;
  colors?: string[];
  className?: string;
  speed?: 'slow' | 'medium' | 'fast';
}

export const TextGradientAnimation: React.FC<TextGradientAnimationProps> = ({ 
  children, 
  colors = ['var(--color-gold-400)', 'var(--color-purple-500)', 'var(--color-tier-diamond)'],
  className,
  speed = 'medium'
}) => {
  const speedMap = {
    slow: '8s',
    medium: '4s',
    fast: '2s'
  };

  const gradientStyle = {
    background: `linear-gradient(45deg, ${colors.join(', ')})`,
    backgroundSize: '300% 300%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: `gradient-shift ${speedMap[speed]} ease infinite`
  } as React.CSSProperties;

  return (
    <span className={className} style={gradientStyle}>
      {children}
    </span>
  );
};

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'gold' | 'purple' | 'blue' | 'green' | 'red';
  animated?: boolean;
  className?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max = 100,
  color = 'gold',
  animated = true,
  className,
  showPercentage = false
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorMap = {
    gold: 'bg-accent-primary',
    purple: 'bg-accent-secondary',
    blue: 'bg-tier-rare',
    green: 'bg-success',
    red: 'bg-error'
  };

  return (
    <div className={cn("w-full bg-background-tertiary rounded-full h-2 overflow-hidden", className)}>
      <div 
        className={cn(
          "h-full transition-all duration-300 ease-out",
          colorMap[color],
          animated && "animate-pulse"
        )}
        style={{ width: `${percentage}%` }}
      />
      {showPercentage && (
        <div className="text-xs text-text-secondary mt-1">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

interface BounceAnimationProps {
  children: React.ReactNode;
  intensity?: 'subtle' | 'medium' | 'strong';
  trigger?: 'hover' | 'click' | 'always';
  className?: string;
}

export const BounceAnimation: React.FC<BounceAnimationProps> = ({ 
  children, 
  intensity = 'medium',
  trigger = 'hover',
  className
}) => {
  const intensityMap = {
    subtle: 'hover:scale-105',
    medium: 'hover:scale-110',
    strong: 'hover:scale-115'
  };

  const triggerMap = {
    hover: 'transition-transform duration-200 ease-out will-change-transform ' + intensityMap[intensity],
    click: 'active:scale-95 transition-transform duration-150 will-change-transform',
    always: 'animate-bounce'
  };

  return (
    <div className={cn(triggerMap[trigger], className)}>
      {children}
    </div>
  );
};

interface RippleEffectProps {
  children: React.ReactNode;
  color?: 'gold' | 'purple' | 'blue' | 'green';
  className?: string;
}

export const RippleEffect: React.FC<RippleEffectProps> = ({ 
  children, 
  color = 'gold',
  className
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { id, x, y }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
  };

  const colorMap = {
    gold: 'bg-accent-primary',
    purple: 'bg-accent-secondary',
    blue: 'bg-tier-rare',
    green: 'bg-success'
  };

  return (
    <div 
      className={cn("relative overflow-hidden cursor-pointer", className)}
      onClick={handleClick}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className={cn(
            "absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ripple",
            colorMap[color]
          )}
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '20px',
            height: '20px'
          }}
        />
      ))}
    </div>
  );
};

interface ConfettiAnimationProps {
  isActive: boolean;
  duration?: number;
  className?: string;
}

export const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({ 
  isActive, 
  duration = 3000,
  className
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; style: React.CSSProperties }>>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${Math.random() * 1 + 1}s`,
          backgroundColor: ['var(--color-gold-400)', 'var(--color-purple-500)', 'var(--color-tier-diamond)', 'var(--color-success)'][Math.floor(Math.random() * 4)]
        }
      }));

      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [isActive, duration]);

  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full animate-confetti"
          style={particle.style}
        />
      ))}
    </div>
  );
};

interface MagneticCursorProps {
  children: React.ReactNode;
  attractionRadius?: number;
  className?: string;
}

export const MagneticCursor: React.FC<MagneticCursorProps> = ({ 
  children, 
  attractionRadius = 100,
  className
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const rectRef = React.useRef<DOMRect | null>(null);

  // Update rect on scroll/resize to avoid layout thrashing in mousemove
  useEffect(() => {
    const updateRect = () => {
      if (elementRef.current) {
        rectRef.current = elementRef.current.getBoundingClientRect();
      }
    };

    // Initial measurement
    updateRect();

    window.addEventListener('scroll', updateRect, { passive: true });
    window.addEventListener('resize', updateRect, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateRect);
      window.removeEventListener('resize', updateRect);
    };
  }, []);

  useEffect(() => {
    let frameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      // Use cached rect
      const rect = rectRef.current;
      if (!rect) return;

      // Simple optimization: if mouse is too far, don't calculate precise distance
      // We use the cached rect, so this is fast (no reflow)
      if (
        e.clientX < rect.left - attractionRadius ||
        e.clientX > rect.right + attractionRadius ||
        e.clientY < rect.top - attractionRadius ||
        e.clientY > rect.bottom + attractionRadius
      ) {
        if (isHovered) {
           setPosition({ x: 0, y: 0 });
           setIsHovered(false);
        }
        return;
      }

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );

      if (distance < attractionRadius) {
        const attraction = 1 - distance / attractionRadius;
        // Use requestAnimationFrame for smoother updates
        cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(() => {
          setPosition({
            x: (e.clientX - centerX) * attraction * 0.1,
            y: (e.clientY - centerY) * attraction * 0.1
          });
          setIsHovered(true);
        });
      } else {
         if (isHovered) {
           setPosition({ x: 0, y: 0 });
           setIsHovered(false);
         }
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, [attractionRadius, isHovered]);

  return (
    <div
      ref={elementRef}
      className={cn("transition-transform duration-200 ease-out", className)}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isHovered ? 1.05 : 1})`, // Use translate3d for GPU acceleration
        willChange: isHovered ? 'transform' : 'auto' // Optimize will-change usage
      }}
    >
      {children}
    </div>
  );
};

interface TiltEffectProps {
  children: React.ReactNode;
  maxRotation?: number;
  className?: string;
}

export const TiltEffect: React.FC<TiltEffectProps> = ({ 
  children, 
  maxRotation = 15,
  className
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const elementRef = React.useRef<HTMLDivElement>(null);
  const frameIdRef = React.useRef<number>();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Use RAF for performance
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      
      frameIdRef.current = requestAnimationFrame(() => {
        const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -maxRotation;
        const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * maxRotation;
        setRotation({ x: rotateX, y: rotateY });
      });
    }
  };

  const handleMouseLeave = () => {
    if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
    setRotation({ x: 0, y: 0 });
  };

  useEffect(() => {
    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={cn("transition-transform duration-200 ease-out will-change-transform", className)}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};