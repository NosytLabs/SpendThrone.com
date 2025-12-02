import React, { useState, useEffect } from 'react';
import { LottieAnimation } from './LottieAnimation';
import { cn } from '@/shared/utils/utils';

// Success celebration animation data (from LottieFiles - free to use)
const successAnimationData = {
  "v": "5.5.7",
  "fr": 60,
  "ip": 0,
  "op": 100,
  "w": 300,
  "h": 300,
  "nm": "Success celebration",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Circle",
      "sr": 1,
      "ks": {
        "o": { "a": 0, "k": 100 },
        "r": { "a": 0, "k": 0 },
        "p": { "a": 0, "k": [150, 150, 0] },
        "a": { "a": 0, "k": [0, 0, 0] },
        "s": { 
          "a": 1,
          "k": [
            { "i": { "x": [0.667], "y": [1] }, "o": { "x": [0.333], "y": [0] }, "t": 0, "s": [0, 0, 100] },
            { "i": { "x": [0.667], "y": [1] }, "o": { "x": [0.333], "y": [0] }, "t": 20, "s": [120, 120, 100] },
            { "t": 40, "s": [100, 100, 100] }
          ]
        }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "d": 1,
              "ty": "el",
              "s": { "a": 0, "k": [80, 80] },
              "p": { "a": 0, "k": [0, 0] },
              "nm": "Ellipse Path 1"
            },
            {
              "ty": "st",
              "c": { "a": 0, "k": [0.921, 0.0, 0.553, 1] },
              "o": { "a": 0, "k": 100 },
              "w": { "a": 0, "k": 4 },
              "lc": 2,
              "lj": 2,
              "nm": "Stroke 1"
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [0.0, 0.459, 0.922, 1] },
              "o": { "a": 0, "k": 100 },
              "r": 1,
              "nm": "Fill 1"
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [0, 0] },
              "a": { "a": 0, "k": [0, 0] },
              "s": { "a": 0, "k": [100, 100] },
              "r": { "a": 0, "k": 0 },
              "o": { "a": 0, "k": 100 },
              "sk": { "a": 0, "k": 0 },
              "sa": { "a": 0, "k": 0 },
              "nm": "Transform"
            }
          ],
          "nm": "Ellipse 1"
        }
      ],
      "ip": 0,
      "op": 100,
      "st": 0,
      "bm": 0
    }
  ],
  "markers": []
};

export interface SuccessAnimationProps {
  show: boolean;
  onComplete?: () => void;
  size?: 'sm' | 'md' | 'lg';
  position?: 'center' | 'top' | 'bottom';
  className?: string;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  show,
  onComplete,
  size = 'md',
  position = 'center',
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      // Delay hiding to allow animation to complete
      const timer = setTimeout(() => setIsVisible(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const sizeMap = {
    sm: { width: 100, height: 100 },
    md: { width: 200, height: 200 },
    lg: { width: 300, height: 300 },
  };

  const positionClasses = {
    center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    top: 'top-20 left-1/2 transform -translate-x-1/2',
    bottom: 'bottom-20 left-1/2 transform -translate-x-1/2',
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed z-50 pointer-events-none transition-all duration-500',
        positionClasses[position],
        show ? 'opacity-100 scale-100' : 'opacity-0 scale-150',
        className
      )}
    >
      <LottieAnimation
        animationData={successAnimationData}
        width={sizeMap[size].width}
        height={sizeMap[size].height}
        loop={false}
        autoplay={show}
        onComplete={onComplete}
      />
    </div>
  );
};

export default SuccessAnimation;