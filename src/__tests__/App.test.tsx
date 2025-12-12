import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Mocks
vi.mock('@solana/wallet-adapter-react', () => ({
    useWallet: () => ({
        connected: false,
        publicKey: null,
        connect: vi.fn(),
        disconnect: vi.fn(),
        select: vi.fn(),
    }),
    useConnection: () => ({
        connection: null,
    }),
    ConnectionProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    WalletProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@solana/wallet-adapter-react-ui', () => ({
    WalletModalProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock useUserPreferences to avoid provider requirement
vi.mock('@/shared/hooks/useUserPreferences', () => ({
    useUserPreferences: () => ({
        preferences: { 
            theme: 'dark',
            animations: false,
            sounds: false,
            haptics: false,
            fontSize: 'medium',
            highContrast: false,
            reducedMotion: true, // Disable motion for tests
            language: 'en'
        },
        updatePreference: vi.fn(),
        resetPreferences: vi.fn(),
    })
}));

// Mock RoyalIcon to avoid Lucide icon issues if any
vi.mock('@/components/ui/RoyalIcon', () => ({
    RoyalIcon: () => <span data-testid="royal-icon" />
}));

// Mock components that might cause issues in test env
vi.mock('@/components/ui/GoldDustEffect', () => ({
    GoldDustEffect: () => <div data-testid="gold-dust" />
}));

import { Home } from '../pages/Home';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

describe('Home Page Smoke Test', () => {
    it('renders the main call to action', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <HelmetProvider>
                    <MemoryRouter>
                        <Home />
                    </MemoryRouter>
                </HelmetProvider>
            </QueryClientProvider>
        );

        const main = screen.getByRole('main');
        expect(main).toBeTruthy();
    });
});
