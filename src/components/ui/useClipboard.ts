import { useState, useCallback } from 'react';

export const useClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    if (typeof window === 'undefined') return false;
    
    try {
      await window.navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  return { copy, isCopied };
};