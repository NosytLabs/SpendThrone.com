import React, { useRef, MutableRefObject, useEffect } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { logError } from '@/shared/utils/logger';

export interface LottieAnimationProps {
  animationData?: unknown;
  url?: string;
  width?: number;
  height?: number;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  onComplete?: () => void;
  speed?: number;
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  url,
  width = 200,
  height = 200,
  loop = false,
  autoplay = true,
  className,
  onComplete,
  speed = 1,
}) => {
  const lottieRef: MutableRefObject<LottieRefCurrentProps | null> = useRef<LottieRefCurrentProps | null>(null);
  const [fetchedData, setFetchedData] = React.useState<unknown>(null);

  useEffect(() => {
    if (url) {
      fetch(url)
        .then(response => response.json())
        .then(data => setFetchedData(data))
        .catch(err => logError("Failed to load Lottie animation:", err));
    }
  }, [url]);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(speed);
    }
  }, [speed]);

  const dataToUse = animationData || fetchedData;

  if (!dataToUse) return null;

  return (
    <div className={className} style={{ width, height }}>
      <Lottie
        lottieRef={lottieRef}
        animationData={dataToUse}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
        onComplete={onComplete}
      />
    </div>
  );
};

export default LottieAnimation;