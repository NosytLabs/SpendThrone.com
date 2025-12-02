import React, { createContext, useMemo } from 'react';
import { isRpcEnabled } from '@/core/constants/endpoints';

type DegradedModeContextValue = {
  isDegraded: boolean;
  reason?: string;
};

const DegradedModeContext = createContext<DegradedModeContextValue>({ isDegraded: false });

export { DegradedModeContext };

export const DegradedModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useMemo<DegradedModeContextValue>(() => {
    const enabled = isRpcEnabled();
    return {
      isDegraded: !enabled,
      reason: enabled ? undefined : 'Blockchain interactions are temporarily disabled.',
    };
  }, []);

  return (
    <DegradedModeContext.Provider value={value}>
      {children}
    </DegradedModeContext.Provider>
  );
};

