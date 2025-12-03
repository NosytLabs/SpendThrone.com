import { useCallback, useEffect, useRef } from 'react';
import { useUserPreferences } from '@/shared/hooks/useUserPreferences';

export type SoundType = 
  | 'click'
  | 'success'
  | 'error'
  | 'warning'
  | 'notification'
  | 'tribute'
  | 'achievement'
  | 'hover'
  | 'toggle';

interface SoundConfig {
  frequency: number;
  duration: number;
  type: 'sine' | 'square' | 'sawtooth' | 'triangle';
  volume: number;
}

const soundConfigs: Record<SoundType, SoundConfig> = {
  click: { frequency: 800, duration: 0.1, type: 'sine', volume: 0.1 },
  success: { frequency: 1200, duration: 0.2, type: 'sine', volume: 0.15 },
  error: { frequency: 300, duration: 0.3, type: 'sawtooth', volume: 0.1 },
  warning: { frequency: 400, duration: 0.2, type: 'square', volume: 0.1 },
  notification: { frequency: 1000, duration: 0.15, type: 'sine', volume: 0.12 },
  tribute: { frequency: 1500, duration: 0.4, type: 'sine', volume: 0.2 },
  achievement: { frequency: 2000, duration: 0.5, type: 'sine', volume: 0.25 },
  hover: { frequency: 600, duration: 0.08, type: 'sine', volume: 0.08 },
  toggle: { frequency: 900, duration: 0.12, type: 'sine', volume: 0.1 },
};

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled = true;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    if (typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      } catch (error) {
        // Web Audio API not supported
      }
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled && this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    } else if (enabled && !this.audioContext) {
      this.initAudioContext();
    }
  }

  async playSound(type: SoundType) {
    if (!this.enabled || !this.audioContext) return;

    try {
      // Resume context if suspended (required by some browsers)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const config = soundConfigs[type];
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(config.frequency, this.audioContext.currentTime);
      oscillator.type = config.type;
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(config.volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + config.duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + config.duration);
    } catch (error) {
      // Failed to play sound
    }
  }

  playSequence(sounds: Array<{ type: SoundType; delay?: number }>) {
    sounds.forEach(({ type, delay = 0 }) => {
      setTimeout(() => this.playSound(type), delay * 1000);
    });
  }
}

let soundManager: SoundManager | null = null;

const getSoundManager = () => {
  if (!soundManager) {
    soundManager = new SoundManager();
  }
  return soundManager;
};

export const useSoundEffects = () => {
  const { preferences } = useUserPreferences();
  const soundManagerRef = useRef<SoundManager | null>(null);

  useEffect(() => {
    soundManagerRef.current = getSoundManager();
    soundManagerRef.current.setEnabled(preferences.sounds);
  }, [preferences.sounds]);

  const playSound = useCallback((type: SoundType) => {
    if (soundManagerRef.current && preferences.sounds) {
      soundManagerRef.current.playSound(type);
    }
  }, [preferences.sounds]);

  const playSequence = useCallback((sounds: Array<{ type: SoundType; delay?: number }>) => {
    if (soundManagerRef.current && preferences.sounds) {
      soundManagerRef.current.playSequence(sounds);
    }
  }, [preferences.sounds]);

  return { playSound, playSequence };
};

// Haptic feedback hook
export const useHapticFeedback = () => {
  const { preferences } = useUserPreferences();

  const triggerHaptic = useCallback((style: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!preferences.haptics) return;

    if (typeof window !== 'undefined' && 'vibrate' in window.navigator) {
      const patterns = {
        light: 10,
        medium: 20,
        heavy: 30,
      };
      window.navigator.vibrate(patterns[style]);
    }

    // Support for the Vibration API (some browsers)
    if (typeof window !== 'undefined' && 'webkitVibrate' in window.navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
      };
      (window.navigator as unknown as { webkitVibrate?: (pattern: number[]) => boolean }).webkitVibrate?.(patterns[style]);
    }
  }, [preferences.haptics]);

  return { triggerHaptic };
};

// Combined feedback hook
export const useUserFeedback = () => {
  const { playSound } = useSoundEffects();
  const { triggerHaptic } = useHapticFeedback();

  const provideFeedback = useCallback((type: 'success' | 'error' | 'warning' | 'info') => {
    const soundMap = {
      success: 'success' as SoundType,
      error: 'error' as SoundType,
      warning: 'warning' as SoundType,
      info: 'notification' as SoundType,
    };

    playSound(soundMap[type]);
    triggerHaptic(type === 'error' ? 'heavy' : type === 'success' ? 'medium' : 'light');
  }, [playSound, triggerHaptic]);

  return { provideFeedback, playSuccess: () => provideFeedback('success') };
};