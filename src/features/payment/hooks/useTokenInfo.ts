import { useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { priceService } from '@/core/services/priceService';
import { swapService } from '@/core/services/swapService';
import { debugLog } from '@/shared/utils/logger';

interface TokenInfoParams {
    walletPublicKey: PublicKey | null;
    selectedToken: { 
        symbol: string; 
        mint?: string; 
        decimals?: number 
    };
    solPrice: number; // Fallback SOL price from parent
}

export const useTokenInfo = ({ walletPublicKey, selectedToken, solPrice }: TokenInfoParams) => {
    const [price, setPrice] = useState<number>(0);
    const [balance, setBalance] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch Price
    useEffect(() => {
        const fetchPrice = async () => {
            setLoading(true);

            if (selectedToken.symbol === 'USDC') {
                setPrice(1);
                setLoading(false);
                return;
            }

            // Use fallback SOL price immediately if available
            if (selectedToken.symbol === 'SOL' && solPrice > 0) {
                setPrice(solPrice);
            }

            try {
                // If we have a mint, fetch real price
                const mintToFetch = selectedToken.mint || (selectedToken.symbol === 'SOL' ? 'So11111111111111111111111111111111111111112' : undefined);
                if (mintToFetch) {
                    const fetched = await priceService.getTokenPrice(mintToFetch);
                    if (fetched > 0) setPrice(fetched);
                }
            } catch (e) {
                debugLog('Failed to fetch price for', selectedToken.symbol, e);
            } finally {
                setLoading(false);
            }
        };
        fetchPrice();
    }, [selectedToken, solPrice]);

    // Fetch Balance
    useEffect(() => {
        const fetchBalance = async () => {
            if (walletPublicKey) {
                try {
                    const bal = await swapService.getTokenBalance(
                        walletPublicKey, 
                        selectedToken.mint || selectedToken.symbol
                    );
                    setBalance(bal);
                } catch (e) {
                    debugLog('Failed to fetch balance', e);
                    setBalance(0);
                }
            } else {
                setBalance(0);
            }
        };
        
        fetchBalance();
        // Poll balance every 10s
        const interval = setInterval(fetchBalance, 10000);
        return () => clearInterval(interval);
    }, [walletPublicKey, selectedToken.mint, selectedToken.symbol]);

    return { price, balance, loading };
};
