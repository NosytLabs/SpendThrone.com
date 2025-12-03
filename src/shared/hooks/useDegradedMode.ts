import { useContext } from 'react';
import { DegradedModeContext } from '@/core/contexts/DegradedModeContext';

export const useDegradedMode = () => {
  const context = useContext(DegradedModeContext);
  if (context === undefined) {
    throw new Error('useDegradedMode must be used within a DegradedModeProvider');
  }
  return context;
};