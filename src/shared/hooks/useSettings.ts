import { useState, useEffect, useRef, useCallback } from 'react';
import { startIntervalWhenVisible } from '@/shared/utils/visibility';
import { useWallet } from '@solana/wallet-adapter-react';
import { getTierFromAmount } from '../utils/tierSystem';
// import { swapService } from '../utils/swapService'; // Not currently used
import { UserStats, DepositHistoryItem, PremiumFeaturesData } from '../utils/types';
import { statsService } from '@/core/services/statsService';
import { getDepositHistory } from '@/core/services/depositService';
import { logError } from '../utils/logger';

export const useSettings = () => {
    const { connected, publicKey } = useWallet();
    // const wallet = useWallet(); // Temporarily commented out - not currently used
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
            // Mock data for deposits since methods don't exist
            type DepositLite = { usdValue?: number; walletAddress?: string };
            const userDeposits: DepositLite[] = [];
            const allDeposits: DepositLite[] = [];
            const userDepositData: DepositLite[] = userDeposits || [];
            const totalDeposits = userDepositData.length;
            const totalUsdValue = userDepositData.reduce((sum: number, deposit: DepositLite) => sum + (deposit.usdValue || 0), 0);

            const allUsers: DepositLite[] = [...userDeposits, ...allDeposits];
            const userTotals: Record<string, number> = {};
            
            allUsers.forEach((deposit: DepositLite) => {
                if (deposit.walletAddress) {
                  if (!userTotals[deposit.walletAddress]) {
                      userTotals[deposit.walletAddress] = 0;
                  }
                  userTotals[deposit.walletAddress] += deposit.usdValue || 0;
                }
            });

            const sortedUsers = Object.entries(userTotals).sort(([,a], [,b]) => (b as number) - (a as number));
            const userRank = sortedUsers.findIndex(([wallet]) => wallet === walletAddress) + 1;
            
            setUserStats({
                totalDeposits,
                totalUsdValue: Math.round(totalUsdValue),
                rank: userRank > 0 ? userRank : null,
                tier: getTierFromAmount(totalUsdValue).name
            });
        } catch (error) {
            logError('Error loading user stats:', error);
        }
    }, [publicKey]);

    const loadWalletBalance = useCallback(async () => {
        if (!publicKey) return;
        
        try {
            // const balance = await apiService.getWalletBalance(publicKey.toString()); // Method doesn't exist
            // setWalletBalance(balance); // Temporarily commented out - method doesn't exist
        } catch (error) {
            logError('Error loading wallet balance:', error);
            setWalletBalance(null);
        }
    }, [publicKey]);

    const loadTokenBalances = useCallback(async () => {
        if (!publicKey) return;
        
        try {
            const tokens = ['USDC', 'RAY', 'BONK', 'WIF', 'JUP'];
            const balances: Record<string, number> = {};
            
            for (const token of tokens) {
                try {
                    // const balance = await apiService.getWalletBalance(publicKey.toString()); // Method doesn't exist
                    // Mock balance value since getWalletBalance doesn't exist
                    const mockBalance = Math.random() * 100; // Placeholder
                    if (mockBalance > 0) {
                        balances[token] = mockBalance;
                    }
                } catch (err) {
                    logError(`Error loading ${token} balance:`, err);
                }
            }
            
            setTokenBalances(balances);
        } catch (error) {
            logError('Error loading token balances:', error);
        }
    }, [publicKey]);

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
            const [userData, historyData] = await Promise.all([
                statsService.getSettings(walletAddress),
                getDepositHistory(walletAddress),
                // apiService.getWalletBalance(walletAddress), // Method doesn't exist - using placeholder
                // apiService.getTokenBalances(walletAddress), // Temporarily commented out - method doesn't exist
            ]);

            setDisplayName(userData.displayName as string);
            setUserStats(userData.userStats as UserStats);
            setDepositHistory(historyData as DepositHistoryItem[]);
            // setWalletBalance(balanceData?.balance); // Temporarily commented out - method doesn't exist
            // setTokenBalances(tokensData); // Temporarily commented out - method doesn't exist

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            logError(new Error(errorMessage));
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [publicKey]);

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