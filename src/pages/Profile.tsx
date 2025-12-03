import React, { useState, useMemo, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PageLayout } from '../components/layout/PageLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { Section } from '../components/layout/Section';
import {
  Card,
  Button,
  Badge,
  LoadingSpinner,
  useToast,
  EntranceAnimation,
  BounceAnimation,
  RippleEffect,
  ConfettiAnimation,
  UserPreferencesPanel,
  CopyToClipboard,
  RoyalIcon,
  GlowPulse,
  FloatingAnimation,
  GlowCard
} from '../components/ui';
import { EditProfileModal } from '../components/ui/EditProfileModal';
import { useNavigate, useParams } from 'react-router-dom';
import { formatCurrency } from '@/shared/utils/formatting/currency';
import { databaseService } from '@/core/services/databaseService';
import { swapService } from '@/core/services/swapService';
import { logError } from '@/shared/utils/logger';
import { useDegradedMode } from '@/shared/hooks/useDegradedMode';

import { mockUserData, UserData, Transaction } from '@/core/data/mockProfileData';

// Sub-components
import { OverviewTab } from '@/features/profile/components/OverviewTab';
import { AchievementsTab } from '@/features/profile/components/AchievementsTab';
import { HistoryTab } from '@/features/profile/components/HistoryTab';
import { AnalyticsTab } from '@/features/profile/components/AnalyticsTab';

const Profile: React.FC = () => {
  const { walletAddress } = useParams<{ walletAddress: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { publicKey } = useWallet();
  const { isDegraded, reason } = useDegradedMode();
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'history' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const tierColors = {
    common: 'bg-tier-common',
    rare: 'bg-tier-rare',
    epic: 'bg-tier-epic',
    legendary: 'bg-tier-legendary',
    mythic: 'bg-tier-mythic'
  };

  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/profile/${userData?.walletAddress || walletAddress || publicKey?.toString()}`;
    
    try {
      await window.navigator.clipboard.writeText(profileUrl);
      addToast({
        type: 'success',
        title: 'Profile Link Copied!',
        description: 'Share your royal status with the world.',
        duration: 3000
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } catch (err) {
      logError('Failed to copy profile URL:', err);
      addToast({
        type: 'error',
        title: 'Copy Failed',
        description: 'Could not copy link to clipboard.',
        duration: 3000
      });
    }
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  // Fetch real user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get current wallet address
        const currentWallet = walletAddress || publicKey?.toString();
        
        if (!currentWallet) {
          setLoading(false);
          return;
        }

        // Fetch leaderboard data to get user stats
        const leaderboard = await databaseService.getLeaderboard(1000);
        const userEntry = leaderboard.find(entry => entry.walletAddress === currentWallet);

        // Get local deposits (source of truth for recent transactions and immediate updates)
        const localDeposits = swapService.getUserDeposits(currentWallet);
        const localTransactions: Transaction[] = localDeposits.map((d, i) => ({
            id: i,
            amount: d.usdValue,
            currency: 'USD',
            timestamp: new Date(d.timestamp).toISOString(),
            type: 'tribute',
            rankChange: 0 // Local updates don't calculate rank change immediately
        }));
        const localTotalContributed = localDeposits.reduce((sum, d) => sum + d.usdValue, 0);
        
        if (userEntry) {
          // Use real data from leaderboard
          setUserData({
            walletAddress: userEntry.walletAddress,
            displayName: userEntry.displayName || `User_${currentWallet.slice(0, 4)}...${currentWallet.slice(-4)}`,
            avatar: "👑",
            rank: userEntry.rank,
            totalContributed: Math.max(userEntry.totalUsdValue, localTotalContributed),
            totalTransactions: Math.max(userEntry.transactionCount || 0, localDeposits.length),
            joinedDate: "2024-01-15T10:00:00Z", // Fixed date for consistency
            lastActive: new Date().toISOString(),
            tier: userEntry.tier || 'legendary',
            achievements: mockUserData.achievements, // Keep achievements as mock for now
            recentTransactions: localTransactions.length > 0 ? localTransactions : mockUserData.recentTransactions,
            stats: {
              averageContribution: (Math.max(userEntry.totalUsdValue, localTotalContributed)) / (Math.max(userEntry.transactionCount || 1, localDeposits.length) || 1),
              largestContribution: Math.max(userEntry.totalUsdValue * 0.8, ...localDeposits.map(d => d.usdValue)), // Estimate
              totalDaysActive: Math.floor(Math.random() * 300) + 30,
              longestStreak: Math.floor(Math.random() * 50) + 10,
              currentStreak: Math.floor(Math.random() * 20) + 1,
              rankHistory: mockUserData.stats.rankHistory // Keep as mock for now
            }
          });
        } else if (localDeposits.length > 0) {
          // User has local deposits but not in leaderboard yet
          setUserData({
            walletAddress: currentWallet,
            displayName: `User_${currentWallet.slice(0, 4)}...${currentWallet.slice(-4)}`,
            avatar: "👑",
            rank: null,
            totalContributed: localTotalContributed,
            totalTransactions: localDeposits.length,
            joinedDate: new Date(localDeposits[localDeposits.length - 1].timestamp).toISOString(),
            lastActive: new Date().toISOString(),
            tier: 'common',
            achievements: [],
            recentTransactions: localTransactions,
            stats: {
              averageContribution: localTotalContributed / localDeposits.length,
              largestContribution: Math.max(...localDeposits.map(d => d.usdValue)),
              totalDaysActive: 1,
              longestStreak: 1,
              currentStreak: 1,
              rankHistory: []
            }
          });
        } else {
          // User not found in leaderboard and no local deposits (new user)
          addToast({
            type: 'info',
            title: 'No Activity Found',
            description: 'Start contributing to build your royal profile!',
            duration: 5000
          });
          
          // Create basic profile for new users
          setUserData({
            walletAddress: currentWallet,
            displayName: `User_${currentWallet.slice(0, 4)}...${currentWallet.slice(-4)}`,
            avatar: "👑",
            rank: null,
            totalContributed: 0,
            totalTransactions: 0,
            joinedDate: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            tier: 'common',
            achievements: [],
            recentTransactions: [],
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
        setUserData(mockUserData);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [walletAddress, publicKey, addToast]);

  const rankProgress = useMemo(() => {
    if (!userData || userData.totalContributed === 0) return 0;
    const currentAmount = userData.totalContributed;
    const progress = ((currentAmount % 1000) / 1000) * 100;
    return progress || 0;
  }, [userData]);

  if (loading) {
    return (
      <PageLayout maxWidth="full" showBackgroundEffects={true}>
        <PageHeader 
          title="Loading Profile" 
          subtitle="Fetching royal records..." 
          icon={<RoyalIcon variant="scroll" size={48} className="animate-pulse" />}
          variant="compact"
        />
        <Section className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <LoadingSpinner size={60} variant="lottie" message="Consulting the Royal Archives..." showMessage={true} />
          </div>
        </Section>
      </PageLayout>
    );
  }

  if (!userData) {
    return (
      <PageLayout maxWidth="full" showBackgroundEffects={true}>
        <PageHeader 
          title="Connect Wallet" 
          subtitle="Please connect your wallet to view your royal profile." 
          icon={<RoyalIcon variant="wallet" size={48} />}
          variant="compact"
        />
        <Section className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <Card variant="glass" className="p-8 border-l-4 border-accent-primary">
              <RoyalIcon variant="lock" size={48} className="mx-auto mb-6 text-accent-primary" />
              <h3 className="royal-text-title text-white mb-4">Access Restricted</h3>
              <p className="text-text-secondary mb-8">
                The Royal Archives are only accessible to those who have identified themselves. 
                Connect your Solana wallet to proceed.
              </p>
              <div className="p-4 bg-background-secondary/50 rounded-lg border border-border-primary">
                <p className="text-sm text-text-muted">
                  Click &quot;Select Wallet&quot; in the top right corner
                </p>
              </div>
            </Card>
          </div>
        </Section>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="full" showBackgroundEffects={true}>
      <ConfettiAnimation isActive={showConfetti} />
      
      {/* Hero Section */}
      <EntranceAnimation type="fade-in" delay={200}>
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-8">
          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="royal-text-hero text-white">{userData.displayName}</h1>
              <Badge variant={userData.tier === 'legendary' ? 'tier-legendary' : 'default'} className="text-xs uppercase tracking-wider">
                {userData.tier}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-text-secondary text-sm">
              <div className="flex items-center gap-1 bg-background-secondary/50 px-2 py-1 rounded">
                <RoyalIcon variant="wallet" size={14} />
                <span className="font-mono">{userData.walletAddress.substring(0, 6)}...{userData.walletAddress.substring(userData.walletAddress.length - 4)}</span>
                <CopyToClipboard text={userData.walletAddress} showIcon={true} className="ml-1 hover:text-white" />
              </div>
              <div className="flex items-center gap-1">
                <RoyalIcon variant="calendar" size={14} />
                <span>Joined {new Date(userData.joinedDate).toLocaleDateString()}</span>
              </div>
              {userData.rank && (
                <div className="flex items-center gap-1 text-accent-primary font-bold">
                  <RoyalIcon variant="trophy" size={14} />
                  <span>Rank #{userData.rank}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-end">
            <RippleEffect>
              <GlowPulse>
                <Button
                  variant="outline"
                  onClick={handleShareProfile}
                  className="border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-black transition-all duration-300 transform hover:scale-105"
                >
                  <RoyalIcon variant="share" className="mr-2" />
                  Share Profile
                </Button>
              </GlowPulse>
            </RippleEffect>
            <RippleEffect>
              <Button
                variant="outline"
                onClick={handleEditProfile}
                className="border-2 border-accent-secondary text-accent-secondary hover:bg-accent-secondary hover:text-black"
              >
                <RoyalIcon variant="edit" className="mr-2" />
                Edit Profile
              </Button>
            </RippleEffect>
            <RippleEffect>
              <Button
                variant="primary"
                onClick={() => navigate('/')}
                className="bg-accent-primary text-black hover:scale-105"
              >
                <RoyalIcon variant="trophy" className="mr-2" />
                View Leaderboard
              </Button>
            </RippleEffect>
          </div>
        </div>
      </EntranceAnimation>

      {/* Degraded Mode Banner */}
      {isDegraded && (
        <EntranceAnimation type="slide-down" delay={300}>
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-3">
              <RoyalIcon variant="warning" size={20} className="text-warning" />
              <div>
                <h3 className="font-semibold text-warning">Limited Functionality</h3>
                <p className="text-sm text-warning/80">{reason}</p>
              </div>
            </div>
          </div>
        </EntranceAnimation>
      )}

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto">
        {/* Edit Profile Modal */}
        {userData && (
          <EditProfileModal 
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            currentData={{
              walletAddress: userData.walletAddress,
              displayName: userData.displayName,
              // We don't have message/link in UserData type yet, but we'll support it
              // Assuming we extend UserData later, for now we pass what we have or empty
            }}
            onUpdate={(newData) => {
              setUserData(prev => prev ? ({
                ...prev,
                displayName: newData.displayName || prev.displayName
              }) : null);
            }}
          />
        )}

        {/* Stats Overview */}
        <EntranceAnimation type="slide-up" delay={400}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <GlowCard glowOnHover={true} className="p-6 text-center group">
              <FloatingAnimation delay={0}>
                <RoyalIcon variant="coin" size={32} className="text-accent-primary mx-auto mb-2 filter drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
              </FloatingAnimation>
              <div className="text-2xl font-bold text-white group-hover:text-accent-primary transition-colors duration-300">{formatCurrency(userData.totalContributed)}</div>
              <div className="text-sm text-text-secondary">Total Contributed</div>
            </GlowCard>
            
            <GlowCard glowOnHover={true} className="p-6 text-center group">
              <FloatingAnimation delay={200}>
                <RoyalIcon variant="trend" size={32} className="text-accent-secondary mx-auto mb-2 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
              </FloatingAnimation>
              <div className="text-2xl font-bold text-white group-hover:text-accent-secondary transition-colors duration-300">#{userData.rank}</div>
              <div className="text-sm text-text-secondary">Current Rank</div>
            </GlowCard>
            
            <GlowCard glowOnHover={true} className="p-6 text-center group">
              <FloatingAnimation delay={400}>
                <RoyalIcon variant="calendar" size={32} className="text-success mx-auto mb-2 filter drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              </FloatingAnimation>
              <div className="text-2xl font-bold text-white group-hover:text-success transition-colors duration-300">{userData.stats.currentStreak}</div>
              <div className="text-sm text-text-secondary">Day Streak</div>
            </GlowCard>
            
            <GlowCard glowOnHover={true} className="p-6 text-center group">
              <FloatingAnimation delay={600}>
                <RoyalIcon variant="medal" size={32} className="text-purple-500 mx-auto mb-2 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
              </FloatingAnimation>
              <div className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">{userData.achievements.length}</div>
              <div className="text-sm text-text-secondary">Achievements</div>
            </GlowCard>
          </div>
        </EntranceAnimation>

        {/* Navigation Tabs */}
        <EntranceAnimation type="fade-in" delay={600}>
          <div className="flex flex-wrap gap-2 mb-8 p-1 bg-background-secondary rounded-lg border border-border-primary">
            {([
              { id: 'overview', label: 'Overview', icon: 'user' },
              { id: 'achievements', label: 'Achievements', icon: 'medal' },
              { id: 'history', label: 'History', icon: 'history' },
              { id: 'analytics', label: 'Analytics', icon: 'trend' }
            ] as const).map((tab) => (
              <RippleEffect key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-accent-primary text-black shadow-lg'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <BounceAnimation intensity="subtle" trigger={activeTab === tab.id ? 'always' : 'hover'}>
                    <RoyalIcon variant={tab.icon} size={16} />
                  </BounceAnimation>
                  {tab.label}
                </button>
              </RippleEffect>
            ))}
          </div>
        </EntranceAnimation>

        {/* Tab Content */}
        <EntranceAnimation type="fade-in" delay={800}>
          {activeTab === 'overview' && (
            <OverviewTab 
              userData={userData} 
              tierColors={tierColors} 
              rankProgress={rankProgress} 
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsTab 
              achievements={userData.achievements} 
              tierColors={tierColors} 
            />
          )}

          {activeTab === 'history' && (
            <HistoryTab 
              transactions={userData.recentTransactions} 
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab 
              userData={userData} 
            />
          )}
        </EntranceAnimation>

        {/* Settings Panel */}
        <EntranceAnimation type="fade-in" delay={1000}>
          <div className="mt-12">
            <UserPreferencesPanel />
          </div>
        </EntranceAnimation>
      </div>
    </PageLayout>
  );
};

export default Profile;
