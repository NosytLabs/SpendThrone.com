import { useState, useEffect, useRef, useCallback } from 'react';
import { startIntervalWhenVisible } from '@/shared/utils/visibility';
import { useWallet } from '@solana/wallet-adapter-react';
import { priceService } from '@/core/services/priceService';
import { getTransactionsForAddress, HeliusTransactionSummary } from '@/core/services/heliusService';
import { historicalEras } from '../../core/data/historicalEras';
import { logError } from '../utils/logger';
import { createErrorHandler } from '../utils/errorHandler';

type EraKey = keyof typeof historicalEras;
export const useHistory = () => {
    const { connected, publicKey } = useWallet();
    const [selectedEra, setSelectedEra] = useState<EraKey>('ancient');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [realTimeMode, setRealTimeMode] = useState(false);
    const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [animationEnabled, setAnimationEnabled] = useState(true);
    const [heliusTxs, setHeliusTxs] = useState<HeliusTransactionSummary[]>([]);
    const [txLoading, setTxLoading] = useState(false);
    const [txError, setTxError] = useState<string | null>(null);
    const [fullDetails, setFullDetails] = useState(false);
    const [pageSize, setPageSize] = useState<number>(10);
    const [hasMore, setHasMore] = useState<boolean>(true);
    
    // Initialize standardized error handlers
    const errorHandler = createErrorHandler(setError, 'useHistory');
    const txErrorHandler = createErrorHandler(setTxError, 'useHistory-transactions');
    
    const updateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const visibilityHandlerRef = useRef<(() => void) | null>(null);
    const loadTxs = useCallback(async (reset: boolean = true) => {
        if (!connected || !publicKey) return;
        setTxLoading(true);
        setTxError(null);
        try {
            const before = !reset && heliusTxs.length > 0 ? heliusTxs[heliusTxs.length - 1].signature : undefined;
            const txs = await getTransactionsForAddress(publicKey.toString(), {
                limit: pageSize,
                commitment: 'finalized',
                transactionDetails: fullDetails ? 'full' : 'signatures',
                maxConcurrency: 4,
                before,
            });
            setHeliusTxs((prev) => (reset ? txs : [...prev, ...txs]));
            setHasMore(txs.length === pageSize);
        } catch (e: unknown) {
            txErrorHandler.handleError(e, {
                context: 'loadTxs',
                fallbackMessage: 'Failed to load transactions'
            });
        } finally {
            setTxLoading(false);
        }
    }, [connected, publicKey, heliusTxs, pageSize, fullDetails, txErrorHandler]);

    useEffect(() => {
        // Reset pagination on dependency changes
        setHeliusTxs([]);
        setHasMore(true);
        loadTxs(true);
    }, [connected, publicKey, fullDetails, pageSize, loadTxs]);

    const loadMoreTxs = async () => {
        if (txLoading || !hasMore) return;
        await loadTxs(false);
    };

    const initializeData = useCallback(async () => {
        setLoading(true);
        errorHandler.clearError();
        
        try {
            await loadCurrentPrices();
        } catch (err) {
            errorHandler.handleError(err, {
                context: 'initializeData',
                fallbackMessage: 'Failed to load historical data. Please refresh the page.'
            });
        } finally {
            setLoading(false);
        }
    }, [errorHandler]);

    const startRealTimeUpdates = useCallback(() => {
        const REFRESH_MS = import.meta.env.DEV ? 30000 : 60000;
        const gate = startIntervalWhenVisible(() => { loadCurrentPrices(); }, REFRESH_MS);
        visibilityHandlerRef.current = () => gate.stop();
    }, []);

    const stopRealTimeUpdates = useCallback(() => {
        if (visibilityHandlerRef.current) {
            visibilityHandlerRef.current();
            visibilityHandlerRef.current = null;
        }
        if (updateIntervalRef.current) {
            clearInterval(updateIntervalRef.current);
            updateIntervalRef.current = null;
        }
    }, []);
    const loadCurrentPrices = async () => {
        try {
            const tokens = ['SOL', 'USDC', 'RAY', 'BONK', 'WIF', 'JUP'];
            const batchPrices = await priceService.getMultipleTokenPrices(tokens);
            const prices: { [key: string]: number } = { ...batchPrices };
            prices['USDC'] = 1;
            setCurrentPrices(prices);
        } catch (error) {
            logError('Error loading current prices:', error);
        }
    };

    const handleEraClick = (era: EraKey) => {
        setSelectedEra(era);
    };

    // Initialize data on component mount
    useEffect(() => {
        initializeData();
        
        return () => {
            if (updateIntervalRef.current) {
                clearInterval(updateIntervalRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle real-time mode changes
    useEffect(() => {
        if (realTimeMode) {
            startRealTimeUpdates();
        } else {
            stopRealTimeUpdates();
        }
    }, [realTimeMode, startRealTimeUpdates, stopRealTimeUpdates]);

    return {
        selectedEra,
        loading,
        error,
        realTimeMode,
        currentPrices,
        searchTerm,
        animationEnabled,
        heliusTxs,
        txLoading,
        txError,
        fullDetails,
        setFullDetails,
        pageSize,
        setPageSize,
        hasMore,
        historicalEras,
        handleEraClick,
        setSearchTerm,
        setAnimationEnabled,
        setRealTimeMode,
        initializeData,
        reloadTxs: () => loadTxs(true),
        loadMoreTxs,
    };
};
