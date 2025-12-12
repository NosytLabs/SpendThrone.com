import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { databaseService } from '@/core/services/databaseService';
import { swapService } from '@/core/services/swapService';
import { logError } from '@/shared/utils/logger';
import { calculateAchievements } from '@/shared/utils/achievementSystem';
import { generateMockLeaderboard } from '@/core/data/mockLeaderboardData';
import { getTierByUsd } from '@/shared/utils/tierSystem';
import { UserData, Transaction, LeaderboardEntry } from '@/shared/utils/types';
import strings from '@/locales/strings.json';
import { useToast } from '@/components/ui';
import { createLoginMessage } from '@/shared/utils/signature';

const MOCK_USER_HISTORY = [
  { id: 'tx1', amount: 50, currency: 'SOL', timestamp: new Date(Date.now() - 86400000).toISOString(), type: 'tribute', rankChange: 2 },
  { id: 'tx2', amount: 25, currency: 'SOL', timestamp: new Date(Date.now() - 172800000).toISOString(), type: 'tribute', rankChange: 0 },
];

export const useProfileData = (urlWalletAddress?: string) => {
  const { publicKey, signMessage } = useWallet();
  const { addToast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get current wallet address
      const currentWallet = urlWalletAddress || publicKey?.toString();
      
      if (!currentWallet) {
        setLoading(false);
        return;
      }

      // Check local storage first (for Demo Mode persistence)
      const localProfileKey = `spendthrone_profile_${currentWallet}`;
      let localProfileData: Partial<UserData> | null = null;
      try {
        const stored = localStorage.getItem(localProfileKey);
        if (stored) localProfileData = JSON.parse(stored);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Failed to parse local profile data", e);
      }

      // Fetch specific user data directly to improve performance
      let userEntry: LeaderboardEntry | undefined;

      if (databaseService.isAvailable()) {
        try {
          const [record, rank] = await Promise.all([
            databaseService.getUserLeaderboardEntry(currentWallet),
            databaseService.getRankForUser(currentWallet)
          ]);

          if (record) {
            userEntry = {
              rank,
              walletAddress: record.wallet_address,
              displayName: record.display_name || undefined,
              totalUsdValue: record.total_usd_value,
              tier: getTierByUsd(record.total_usd_value),
              transactionCount: record.transaction_count,
              timeAgo: record.last_activity || record.created_at,
              message: record.message || undefined,
              link: record.link || undefined,
              customLinks: record.custom_links || [],
              customSections: record.custom_sections || []
            };
          }
        } catch (err) {
          logError('Error fetching specific user data:', err);
        }
      }

      // Fallback/Demo mode logic
      if (!userEntry) {
         // Only use mocks if we are in demo mode or fallback is needed
         const mockData = generateMockLeaderboard(50); // Increased to 50 to match leaderboard
         userEntry = mockData.find(entry => entry.walletAddress === currentWallet);
      }

      // Fetch real transactions from Supabase
      const realTransactions = await databaseService.getTransactions(currentWallet);
      
      // Use MOCK_USER_HISTORY if we are in demo mode (no real txs and specific wallet)
      const demoTransactions = (realTransactions.length === 0)
        ? MOCK_USER_HISTORY.map(tx => ({
          id: tx.id,
          amount: tx.amount,
          currency: 'USD',
          timestamp: tx.timestamp,
          type: tx.type,
          rankChange: tx.rankChange,
          signature: undefined
        }))
        : [];

      // Get local deposits (fallback/immediate)
      const localDeposits = swapService.getUserDeposits(currentWallet);
      const localTransactions: Transaction[] = localDeposits.map((d, i) => ({
          id: i,
          amount: d.usdValue,
          currency: 'USD',
          timestamp: new Date(d.timestamp).toISOString(),
          type: 'tribute',
          rankChange: 0
      }));

      // Merge transactions (prefer real ones, deduce local duplicates if needed)
      const displayedTransactions = realTransactions.length > 0 
        ? realTransactions 
        : [...localTransactions, ...demoTransactions];

      const localTotalContributed = localDeposits.reduce((sum, d) => sum + d.usdValue, 0);
      
      if (userEntry) {
        // Use real data from leaderboard
        // Calculate Achievements dynamically
        const localData = localProfileData || {};
        const tempUserDataForAchievements: UserData = {
          walletAddress: userEntry.walletAddress,
          displayName: localData.displayName || userEntry.displayName || `User_${currentWallet.slice(0, 4)}...${currentWallet.slice(-4)}`,
          avatar: localData.avatar || "👑",
          rank: userEntry.rank,
          totalContributed: Math.max(userEntry.totalUsdValue, localTotalContributed),
          totalTransactions: Math.max(userEntry.transactionCount || 0, localDeposits.length, realTransactions.length),
          joinedDate: displayedTransactions.length > 0 ? displayedTransactions[displayedTransactions.length - 1].timestamp : new Date().toISOString(),
          lastActive: new Date().toISOString(),
          tier: userEntry.tier || 'legendary',
          achievements: [], // Placeholder for calculation
          recentTransactions: displayedTransactions,
          message: localData.message || userEntry.message,
          link: localData.link || userEntry.link,
          customLinks: localData.customLinks || userEntry.customLinks,
          customSections: localData.customSections || userEntry.customSections,
          stats: {
            averageContribution: (Math.max(userEntry.totalUsdValue, localTotalContributed)) / (Math.max(userEntry.transactionCount || 1, localDeposits.length, realTransactions.length) || 1),
            largestContribution: Math.max(userEntry.totalUsdValue * 0.8, ...localDeposits.map(d => d.usdValue), ...realTransactions.map(t => t.amount)),
            totalDaysActive: displayedTransactions.length > 0 ? Math.ceil((new Date().getTime() - new Date(displayedTransactions[displayedTransactions.length - 1].timestamp).getTime()) / (1000 * 3600 * 24)) : 1,
            longestStreak: 1, // Placeholder until daily logic is implemented
            currentStreak: displayedTransactions.length > 0 && new Date(displayedTransactions[0].timestamp).toDateString() === new Date().toDateString() ? 1 : 0,
            rankHistory: [] 
          }
        };

        setUserData({
          ...tempUserDataForAchievements,
          achievements: calculateAchievements(tempUserDataForAchievements)
        });
        setUserData({
          ...tempUserDataForAchievements,
          achievements: calculateAchievements(tempUserDataForAchievements)
        });
      } else if (localDeposits.length > 0 || realTransactions.length > 0 || localProfileData) {
        // User has deposits OR local profile data but not in leaderboard yet
        const totalVal = Math.max(localTotalContributed, realTransactions.reduce((sum, t) => sum + t.amount, 0));
        const txCount = Math.max(localDeposits.length, realTransactions.length);
        const localData = localProfileData || {};

        const tempUserDataForAchievements: UserData = {
          walletAddress: currentWallet,
          displayName: localData.displayName || `User_${currentWallet.slice(0, 4)}...${currentWallet.slice(-4)}`,
          avatar: localData.avatar || "👑",
          rank: null,
          totalContributed: totalVal,
          totalTransactions: txCount,
          joinedDate: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          tier: 'common',
          achievements: [],
          recentTransactions: displayedTransactions,
          message: localData.message,
          link: localData.link,
          customLinks: localData.customLinks,
          customSections: localData.customSections,
          stats: {
            averageContribution: totalVal / (txCount || 1),
            largestContribution: Math.max(...localDeposits.map(d => d.usdValue), ...realTransactions.map(t => t.amount), 0),
            totalDaysActive: 1,
            longestStreak: 1,
            currentStreak: 1,
            rankHistory: []
          }
        };

        setUserData({
          ...tempUserDataForAchievements,
          achievements: calculateAchievements(tempUserDataForAchievements)
        });
      } else {
        // User not found in leaderboard and no local deposits (new user)
        addToast({
          type: 'info',
          title: strings.profile.no_activity_title,
          description: strings.profile.no_activity_msg,
          duration: 5000
        });
        
        // Create basic profile for new users
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const localData = (localProfileData || {}) as any;
        setUserData({
          walletAddress: currentWallet,
          displayName: localData.displayName || `User_${currentWallet.slice(0, 4)}...${currentWallet.slice(-4)}`,
          avatar: localData.avatar || "👑",
          rank: null,
          totalContributed: 0,
          totalTransactions: 0,
          joinedDate: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          tier: 'common',
          achievements: [],
          recentTransactions: [],
          message: localData.message,
          link: localData.link,
          customLinks: localData.customLinks,
          customSections: localData.customSections,
          stats: {
            averageContribution: 0,
            largestContribution: 0,
            totalDaysActive: 0,
            longestStreak: 0,
            currentStreak: 0,
            rankHistory: []
          }
        });
      }
    } catch (error) {
      logError('Error fetching user data:', error);
      addToast({
        type: 'error',
        title: 'Failed to Load Profile',
        description: 'Unable to fetch your profile data. Please try again.',
        duration: 5000
      });
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, [urlWalletAddress, publicKey, addToast]); // Removed signMessage as it's not used in fetchUserData

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const updateProfile = useCallback(async (newData: { 
    displayName?: string; 
    message?: string; 
    link?: string;
    avatar?: string;
    customLinks?: { label: string; url: string }[];
    customSections?: { title: string; content: string }[];
  }) => {
    if (!publicKey || !userData) return;
    
    try {
      // Try to update Supabase if available
      if (databaseService.isAvailable()) {
        // Secure flow: Sign message if wallet supports it
        if (signMessage && publicKey) {
            const timestamp = Date.now();
            const messageStr = createLoginMessage(publicKey.toString(), timestamp);
            const messageBytes = new TextEncoder().encode(messageStr);
            
            try {
                addToast({
                    type: 'info',
                    title: 'Verify Identity',
                    description: 'Please sign the message to verify you own this profile.',
                    duration: 3000
                });

                const signature = await signMessage(messageBytes);
                await databaseService.updateUserProfileSecure(userData.walletAddress, signature, timestamp, newData);
            } catch (signError) {
                // User rejected signature or wallet doesn't support it
                logError('Signature rejected or failed:', signError);
                throw new Error('You must sign the message to update your profile.');
            }
        } else {
            // Fallback for wallets without signMessage (unlikely for modern Solana wallets)
            // or if we decide to allow insecure updates (NOT RECOMMENDED)
            await databaseService.updateUserProfile(userData.walletAddress, newData);
        }
      }
      
      // Always update local storage for Demo Mode / Persistence
      const localProfileKey = `spendthrone_profile_${userData.walletAddress}`;
      const stored = localStorage.getItem(localProfileKey);
      const currentLocal = stored ? JSON.parse(stored) : {};
      const mergedData = { ...currentLocal, ...newData };
      localStorage.setItem(localProfileKey, JSON.stringify(mergedData));

      // Update local state
      setUserData(prev => prev ? ({
        ...prev,
        ...newData
      }) : null);
      
      addToast({
        type: 'success',
        title: 'Profile Updated',
        description: 'Your royal profile has been updated successfully.'
      });
    } catch (error) {
      logError('Failed to update profile:', error);
      addToast({
        type: 'error',
        title: 'Update Failed',
        description: 'Failed to update profile. Please try again.'
      });
    }
  }, [publicKey, userData, addToast, signMessage]);

  return { userData, loading, fetchUserData, updateProfile };
};
