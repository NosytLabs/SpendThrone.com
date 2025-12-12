import React, { useState, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PageLayout } from '../components/layout/PageLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { Section } from '../components/layout/Section';
import {
  Button,
  Badge,
  LoadingSpinner,
  useToast,
  EntranceAnimation,
  BounceAnimation,
  RippleEffect,
  CopyToClipboard,
  RoyalIcon,
  GlowPulse,
  FloatingAnimation,
  GlowCard,
  RoyalCard
} from '../components/ui';
import { EditProfileModal } from '@/features/profile/components/EditProfileModal';
import { useNavigate, useParams } from 'react-router-dom';
import { formatCurrency } from '@/shared/utils/formatting/currency';

import { useDegradedMode } from '@/shared/hooks/useDegradedMode';

// Hook
import { useProfileData } from '@/features/profile/hooks/useProfileData';

// Sub-components
import { OverviewTab } from '@/features/profile/components/OverviewTab';
import { AchievementsTab } from '@/features/profile/components/AchievementsTab';
import { HistoryTab } from '@/features/profile/components/HistoryTab';
import { AnalyticsTab } from '@/features/profile/components/AnalyticsTab';
// Removed static import of RoyalWarrant to reduce bundle size
// import { RoyalWarrant, RoyalWarrantHandle } from '@/features/profile/components/RoyalWarrant'; 

const Profile: React.FC = () => {
  const { walletAddress } = useParams<{ walletAddress: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { publicKey } = useWallet();
  const { isDegraded, reason } = useDegradedMode();
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'history' | 'analytics'>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Warrant Logic
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const warrantRef = React.useRef<any>(null);
  const [generatedWarrant, setGeneratedWarrant] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Lazy load Warrant component only when needed to reduce initial bundle size
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [RoyalWarrantComponent, setRoyalWarrantComponent] = useState<React.ComponentType<any> | null>(null);

  React.useEffect(() => {
    // Prefetch Warrant component
    import('@/features/profile/components/RoyalWarrant').then(module => {
      setRoyalWarrantComponent(() => module.RoyalWarrant);
    });
  }, []);
  

  const { userData, loading, updateProfile } = useProfileData(walletAddress);

  const tierColors = {
    common: 'bg-tier-common',
    rare: 'bg-tier-rare',
    epic: 'bg-tier-epic',
    legendary: 'bg-tier-legendary',
    mythic: 'bg-tier-mythic'
  };

  const handleShareProfile = async () => {
    setIsGenerating(true);
    addToast({ title: 'Forging Royal Warrant...', description: 'Please wait while we inscribe your status.', duration: 2000, type: 'info' });
    
    try {
      if (warrantRef.current) {
        const imageUrl = await warrantRef.current.generateImage();
        if (imageUrl) {
            setGeneratedWarrant(imageUrl);
            addToast({ title: 'Warrant Forged!', description: 'Download it and flaunt your power.', type: 'success', duration: 3000 });
        } else {
            throw new Error("Failed to generate image");
        }
      }
    } catch (err) {
      // debugLog('Error generating warrant', err); // Use debugLog instead of console
      // Fallback to old behavior if image fails
      const profileUrl = `${window.location.origin}/profile/${userData?.walletAddress || walletAddress || publicKey?.toString()}`;
      const shareText = `I hold Rank #${userData?.rank || '???'} on SpendThrone. 👑 ${profileUrl}`;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      window.open(twitterUrl, '_blank');
      addToast({ title: 'Image Generation Failed', description: 'Opening Twitter without image.', type: 'error' });
    } finally {
        setIsGenerating(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

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
          icon={<RoyalIcon variant="scroll" size={48} />}
          variant="compact"
        />
        <Section className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <LoadingSpinner size={60} variant="crown" message="Consulting the Royal Archives..." showMessage={true} />
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
            <RoyalCard variant="glass" className="p-10 border-l-4 border-accent-primary shadow-[0_0_30px_rgba(234,179,8,0.1)]">
              <RoyalIcon variant="lock" size={64} className="mx-auto mb-6 text-accent-primary animate-pulse-slow" />
              <h3 className="royal-text-title text-white mb-4 text-2xl">Access Restricted</h3>
              <p className="text-text-secondary mb-8 text-lg font-light leading-relaxed">
                The Royal Archives are sealed to the unverified. <br/>
                Connect your wallet to prove your lineage.
              </p>
              <div className="p-4 bg-background-secondary/50 rounded-lg border border-border-primary/50 backdrop-blur-sm">
                <p className="text-sm text-text-muted flex items-center justify-center gap-2">
                  <RoyalIcon variant="wallet" size={14} />
                  Click &quot;Select Wallet&quot; in the top right corner
                </p>
              </div>
            </RoyalCard>
          </div>
        </Section>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="full" showBackgroundEffects={true}>
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
            {/* Website Link */}
            {userData.link && (
              <a 
                href={userData.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-background-secondary/50 hover:bg-background-tertiary text-white rounded-lg transition-colors text-sm font-medium border border-border-primary/50 h-10 backdrop-blur-sm hover:border-accent-primary/50"
              >
                <RoyalIcon variant="externalLink" size={16} />
                Website
              </a>
            )}
            
            {/* Custom Links */}
            {userData.customLinks && userData.customLinks.map((link, idx) => (
              <a 
                key={idx}
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-background-secondary/50 hover:bg-background-tertiary text-white rounded-lg transition-colors text-sm font-medium border border-border-primary/50 h-10 backdrop-blur-sm hover:border-accent-primary/50"
              >
                <RoyalIcon variant="externalLink" size={16} />
                {link.label}
              </a>
            ))}

            <RippleEffect>
              <GlowPulse>
                <Button
                  variant="outline"
                  onClick={handleShareProfile}
                  disabled={isGenerating}
                  className="royal-shimmer-btn border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-black transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                >
                  {isGenerating ? <LoadingSpinner size={16} /> : <RoyalIcon variant="share" className="mr-2" />}
                  {isGenerating ? 'Forging...' : 'Flaunt Status'}
                </Button>
              </GlowPulse>
            </RippleEffect>
            
            {publicKey && userData.walletAddress === publicKey.toString() && (
              <RippleEffect>
                <Button
                  variant="outline"
                  onClick={handleEditProfile}
                  className="border-2 border-accent-secondary text-accent-secondary hover:bg-accent-secondary hover:text-black backdrop-blur-sm"
                >
                  <RoyalIcon variant="settings" className="mr-2" />
                  Edit Profile
                </Button>
              </RippleEffect>
            )}

            <RippleEffect>
              <Button
                variant="primary"
                onClick={() => navigate('/')}
                className="bg-accent-primary text-black hover:scale-105 shadow-xl shadow-accent-primary/20"
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
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-8 backdrop-blur-md">
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
              avatar: userData.avatar,
              message: userData.message,
              link: userData.link,
              customLinks: userData.customLinks,
              customSections: userData.customSections
            }}
            onUpdate={updateProfile}
          />
        )}

        {/* Dynamic Offer Generator */}
        {userData && RoyalWarrantComponent && <RoyalWarrantComponent ref={warrantRef} userData={{...userData, rank: userData.rank || 0}} />}

        {/* Warrant Display Modal - Replaced with Royal Dialog essentially */}
        {generatedWarrant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-background-primary/95 border border-accent-primary/30 p-8 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col items-center gap-8 relative shadow-[0_0_50px_rgba(234,179,8,0.15)]">
              <button 
                onClick={() => setGeneratedWarrant(null)}
                className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors hover:rotate-90 duration-300"
              >
                <RoyalIcon variant="close" size={24} />
              </button>
              
              <div className="text-center space-y-3">
                <RoyalIcon variant="scroll" size={48} className="text-accent-primary mx-auto mb-2" />
                <h2 className="text-3xl font-bold text-white uppercase tracking-wider font-serif">Royal Warrant Forged</h2>
                <p className="text-text-secondary">Your proof of nobility is ready for display.</p>
              </div>
              
              <div className="relative group border-8 border-black shadow-2xl cursor-pointer transition-transform hover:scale-[1.01]" onClick={() => window.open(generatedWarrant, '_blank')}>
                 <img src={generatedWarrant} alt="Royal Warrant" className="max-w-full h-auto" />
                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold backdrop-blur-sm">
                   <div className="flex flex-col items-center gap-2">
                     <RoyalIcon variant="eye" size={32} />
                     <span>View Full Size</span>
                   </div>
                 </div>
              </div>
              
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center w-full">
                <a 
                  href={generatedWarrant} 
                  download={`SpendThrone_Warrant_${userData.rank}.png`}
                  className="px-8 py-4 bg-white text-black font-bold uppercase tracking-wide rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 min-w-[200px]"
                >
                  <RoyalIcon variant="download" size={20} />
                  Download Warrant
                </a>
                <button
                   onClick={() => {
                     const profileUrl = `${window.location.origin}/profile/${userData.walletAddress}`;
                     const shareText = userData.rank === 1
                      ? `I am the EMPEROR of SpendThrone. Come and try to Usurp me. 👑 ${profileUrl}`
                      : `I hold Rank #${userData.rank} on SpendThrone. I am overtaking the weak. ⚔️ ${profileUrl}`;
                     const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
                     window.open(twitterUrl, '_blank');
                   }}
                   className="px-8 py-4 bg-[#1DA1F2] text-white font-bold uppercase tracking-wide rounded hover:bg-[#1a91da] transition-colors flex items-center justify-center gap-2 min-w-[200px]"
                >
                  <RoyalIcon variant="share" size={20} />
                  Post to X
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <EntranceAnimation type="slide-up" delay={400}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <GlowCard glowOnHover={true} borderAnimation="glow" className="p-6 text-center group bg-black/40 backdrop-blur-sm">
              <FloatingAnimation delay={0}>
                <RoyalIcon variant="coins" size={32} className="text-accent-primary mx-auto mb-3" />
              </FloatingAnimation>
              <div className="text-3xl font-bold text-white group-hover:text-accent-primary transition-colors duration-300 font-mono tracking-tight">{formatCurrency(userData.totalContributed)}</div>
              <div className="text-sm text-text-secondary uppercase tracking-wider mt-1">Total Tribute</div>
            </GlowCard>
            
            <GlowCard glowOnHover={true} borderAnimation="pulse" className="p-6 text-center group bg-black/40 backdrop-blur-sm">
              <FloatingAnimation delay={200}>
                <RoyalIcon variant="trend" size={32} className="text-accent-secondary mx-auto mb-3" />
              </FloatingAnimation>
              <div className="text-3xl font-bold text-white group-hover:text-accent-secondary transition-colors duration-300 font-mono tracking-tight">#{userData.rank}</div>
              <div className="text-sm text-text-secondary uppercase tracking-wider mt-1">Global Rank</div>
            </GlowCard>
            
            <GlowCard glowOnHover={true} className="p-6 text-center group bg-black/40 backdrop-blur-sm">
              <FloatingAnimation delay={400}>
                <RoyalIcon variant="calendar" size={32} className="text-success mx-auto mb-3" />
              </FloatingAnimation>
              <div className="text-3xl font-bold text-white group-hover:text-success transition-colors duration-300 font-mono tracking-tight">{userData.stats.currentStreak}</div>
              <div className="text-sm text-text-secondary uppercase tracking-wider mt-1">Day Streak</div>
            </GlowCard>
            
            <GlowCard glowOnHover={true} className="p-6 text-center group bg-black/40 backdrop-blur-sm">
              <FloatingAnimation delay={600}>
                <RoyalIcon variant="medal" size={32} className="text-purple-500 mx-auto mb-3" />
              </FloatingAnimation>
              <div className="text-3xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300 font-mono tracking-tight">{userData.achievements.length}</div>
              <div className="text-sm text-text-secondary uppercase tracking-wider mt-1">Achievements</div>
            </GlowCard>
          </div>
        </EntranceAnimation>

        {/* Navigation Tabs */}
        <EntranceAnimation type="fade-in" delay={600}>
          <div className="flex flex-wrap gap-2 mb-8 p-1.5 bg-background-secondary/80 backdrop-blur-md rounded-xl border border-white/5 shadow-lg">
            {([
              { id: 'overview', label: 'Overview', icon: 'user' },
              { id: 'achievements', label: 'Achievements', icon: 'medal' },
              { id: 'history', label: 'History', icon: 'history' },
              { id: 'analytics', label: 'Analytics', icon: 'trend' }
            ] as const).map((tab) => (
              <RippleEffect key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-accent-primary text-black shadow-lg shadow-accent-primary/20 scale-100'
                      : 'text-text-secondary hover:text-white hover:bg-white/5 scale-95 hover:scale-100'
                  }`}
                >
                  <BounceAnimation intensity="subtle" trigger={activeTab === tab.id ? 'always' : 'hover'}>
                    <RoyalIcon variant={tab.icon} size={18} />
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
      </div>
    </PageLayout>
  );
};

export default Profile;
