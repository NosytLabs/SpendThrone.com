import React, { ReactNode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import WalletContextProvider from '@/core/contexts/WalletContextProvider';
import { DegradedModeProvider } from '@/core/contexts/DegradedModeContext';
import { ErrorBoundary } from '@/components/ui';
import { EnhancedToastProvider } from '@/components/ui/EnhancedToast';
import { UserPreferencesProvider } from '@/components/ui/UserPreferences';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <WalletContextProvider>
          <QueryClientProvider client={queryClient}>
            <EnhancedToastProvider>
              <UserPreferencesProvider>
                <DegradedModeProvider>
                  <Router>
                    {children}
                  </Router>
                </DegradedModeProvider>
              </UserPreferencesProvider>
            </EnhancedToastProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </WalletContextProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};