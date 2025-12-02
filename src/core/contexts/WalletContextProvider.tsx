import React, { useMemo, useState, useEffect } from 'react';
import { getRpcUrl, isRpcEnabled } from '../constants/endpoints';
import { getHealthyRpcUrl } from '../utils/connectionPool';
import { logError } from '@/shared/utils/logger';
import { Adapter } from '@solana/wallet-adapter-base';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

// Import default styles for wallet adapter UI


interface WalletContextProviderProps {
    children: React.ReactNode;
}

const WalletContextProvider: React.FC<WalletContextProviderProps> = ({ children }) => {

    // Centralized RPC endpoint resolution
    const endpoint = useMemo(() => {
        if (!isRpcEnabled()) {
            // When RPC is disabled, avoid any connection pooling and just return a stable default URL.
            return getRpcUrl();
        }
        const optimized = getHealthyRpcUrl();
        return optimized || getRpcUrl();
    }, []);

    // Lazy load wallet adapters
    const [wallets, setWallets] = useState<Adapter[]>([]);
    const [isLoadingWallets, setIsLoadingWallets] = useState(true);

    useEffect(() => {
        const loadWallets = async () => {
            try {
                if (!isRpcEnabled()) {
                    // Do not load any wallet adapters while RPC is disabled.
                    setWallets([]);
                    return;
                }
                const { PhantomWalletAdapter } = await import('@solana/wallet-adapter-wallets');
                setWallets([new PhantomWalletAdapter()]);
            } catch (error) {
                logError('Failed to load wallet adapters:', error);
                setWallets([]);
            } finally {
                setIsLoadingWallets(false);
            }
        };

        loadWallets();
    }, []);


    // Render loading state while wallets are being loaded
    if (isLoadingWallets) {
        return (
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={[]} autoConnect={false}>
                    <WalletModalProvider>
                        {children}
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        );
    }

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect={false}>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default WalletContextProvider;
