import { useState, useEffect, useRef, useCallback } from 'react';
import { startIntervalWhenVisible } from '@/shared/utils/visibility';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { UserStats, DepositHistoryItem, PremiumFeaturesData } from '../utils/types';
import { statsService } from '@/core/services/statsService';
import { getDepositHistory } from '@/core/services/depositService';
import { logError } from '../utils/logger';

export const useSettings = () => {
    const { connected, publicKey } = useWallet();
    const { connection } = useConnection();
    const [displayName, setDisplayName] = useState<string>('');
    const [userStats, setUserStats] = useState<UserStats>({
        totalDeposits: 0,
        totalUsdValue: 0,
        rank: null,
        tier: 'Degen Peasant'
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState<number | null>(null);
    const [tokenBalances, setTokenBalances] = useState<Record<string, number>>({});
    const [realTimeMode, setRealTimeMode] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<boolean>(true);
    const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
    const [theme, setTheme] = useState<string>('dark');
    const [depositHistory, setDepositHistory] = useState<DepositHistoryItem[]>([]);
    const [premiumFeatures] = useState<PremiumFeaturesData>({
        realTimeQuotes: true,
        advancedAnalytics: true,
        prioritySupport: true
    });
    
    const updateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const visibilityHandlerRef = useRef<(() => void) | null>(null);
    
    // Define all callback functions first to avoid circular dependencies
    const loadUserStats = useCallback(async () => {
        if (!publicKey) return;
        
        try {
            const walletAddress = publicKey.toString();
            const stats = await statsService.getUserStats(walletAddress);
            
            setUserStats({
                totalDeposits: stats.totalDeposits || 0,
                totalUsdValue: stats.totalUsdValue || 0,
                rank: stats.globalRank || null,
                tier: stats.tier || 'Degen Peasant'
            });
        } catch (error) {
            logError('Error loading user stats:', error);
        }
    }, [publicKey]);

    const loadWalletBalance = useCallback(async () => {
        if (!publicKey || !connection) return;
        
        try {
            const balance = await connection.getBalance(publicKey);
            setWalletBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
            logError('Error loading wallet balance:', error);
            setWalletBalance(null);
        }
    }, [publicKey, connection]);

    const loadTokenBalances = useCallback(async () => {
        // Token balance loading temporarily disabled to reduce RPC load
        // Can be implemented using connection.getParsedTokenAccountsByOwner
        setTokenBalances({});
    }, []);

    const startRealTimeUpdates = useCallback(() => {
        const REFRESH_MS = import.meta.env.DEV ? 30000 : 60000;
        const gate = startIntervalWhenVisible(() => {
            if (connected && publicKey) {
                loadUserStats();
                loadWalletBalance();
                loadTokenBalances();
            }
        }, REFRESH_MS);
        visibilityHandlerRef.current = () => gate.stop();
    }, [connected, publicKey, loadUserStats, loadWalletBalance, loadTokenBalances]);

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

    const initializeSettings = useCallback(async () => {
        if (!publicKey) return;

        setLoading(true);
        setError(null);

        try {
            const walletAddress = publicKey.toBase58();
            const [settingsData, historyData] = await Promise.all([
                statsService.getSettings(walletAddress),
                getDepositHistory(walletAddress),
            ]);

            if (settingsData.displayName) {
                setDisplayName(settingsData.displayName as string);
            }
            
            if (settingsData.userStats) {
                 setUserStats(settingsData.userStats as UserStats);
            } else {
                // If getSettings didn't return stats, try loading them explicitly
                await loadUserStats();
            }

            setDepositHistory(historyData as DepositHistoryItem[]);
            await loadWalletBalance();

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            logError(new Error(errorMessage));
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [publicKey, loadUserStats, loadWalletBalance]);

    useEffect(() => {
        if (connected && publicKey) {
            initializeSettings();
        }
        
        return () => {
            if (updateIntervalRef.current) {
                clearInterval(updateIntervalRef.current);
            }
        };
    }, [connected, publicKey, initializeSettings]);

    useEffect(() => {
        if (realTimeMode && connected) {
            startRealTimeUpdates();
        } else {
            stopRealTimeUpdates();
        }
    }, [realTimeMode, connected, startRealTimeUpdates, stopRealTimeUpdates]);



    return {
        connected,
        publicKey,
        displayName,
        setDisplayName,
        userStats,
        loading,
        error,
        walletBalance,
        tokenBalances,
        realTimeMode,
        setRealTimeMode,
        notifications,
        setNotifications,
        autoRefresh,
        setAutoRefresh,
        theme,
        setTheme,
        depositHistory,
        premiumFeatures,
        initializeSettings
    };
};
