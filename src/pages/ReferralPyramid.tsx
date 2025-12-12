import React, { useState, useEffect, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PageLayout } from '../components/layout/PageLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { RoyalCard, Button, RoyalIcon, useToast } from '../components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { SkeletonCard } from '../components/ui/Skeleton';
import { statsService } from '../core/services/statsService';
import { useLeaderboard } from '@/features/leaderboard/hooks/useLeaderboard';

const ReferralPyramid: React.FC = () => {
  const { publicKey } = useWallet();
  const { addToast } = useToast();
  const { leaderboard } = useLeaderboard();
  
  const [stats, setStats] = useState({
    referralCount: 0,
    totalReferralVolume: 0,
    earnings: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate User Rank & Position
  const userRank = useMemo(() => {
      if (!publicKey || !leaderboard) return null;
      const entry = leaderboard.find(e => e.walletAddress === publicKey.toString());
      return entry ? entry.rank : null;
  }, [publicKey, leaderboard]);

  const pyramidPosition = useMemo(() => {
      if (!userRank) return 'masses';
      if (userRank === 1) return 'god';
      if (userRank <= 10) return 'priests';
      if (userRank <= 50) return 'nobles';
      return 'masses';
  }, [userRank]);

  const YouAreHereMarker = () => (
    <motion.div 
      className="absolute left-1/2 top-1/2 -translate-y-1/2 ml-4 sm:ml-8 flex items-center gap-2 z-50 pointer-events-none whitespace-nowrap"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: [0, 5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="text-accent-primary font-bold text-xs sm:text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] bg-black/80 px-2 py-1 rounded border border-accent-primary/70 shadow-[0_0_10px_rgba(234,179,8,0.3)] backdrop-blur-sm">
        ← You Are Here {userRank ? `(#${userRank})` : ''}
      </span>
    </motion.div>
  );

  useEffect(() => {
    if (publicKey) {
      setLoading(true);
      setError(null);
      statsService.getReferralStats(publicKey.toString())
        .then((data) => {
          setStats({
            referralCount: data.referralCount || 0,
            totalReferralVolume: data.totalReferralVolume || 0,
            earnings: data.earnings || 0
          });
        })
        .catch(() => {
          setError('Failed to load referral statistics');
          addToast({ title: 'Error', description: 'Failed to load referral statistics', type: 'error' });
        })
        .finally(() => setLoading(false));
    }
  }, [publicKey, addToast]);

  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    if (!publicKey) return;
    const link = `${window.location.origin}/?ref=${publicKey.toString()}`;
    window.navigator.clipboard.writeText(link);
    addToast({ title: 'Success!', description: 'Referral link copied! Share this link with friends to earn rewards', type: 'success' });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const divineFavor = Math.floor((stats.referralCount * 100) + (stats.earnings * 1000));

  const ReferralSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i} className="h-48" />
      ))}
    </div>
  );

  return (
    <PageLayout maxWidth="full" showBackgroundEffects={true}>
      <PageHeader
        title="The Pyramid of Favor"
        subtitle="A social structure as old as time. Where do you stand?"
        icon="crown"
        variant="compact"
      />

      <div className="w-full max-w-7xl mx-auto">
        
        {/* Satire Warning */}
        <RoyalCard variant="glass" className="mb-12 border-accent-primary/40 bg-accent-primary/5 shadow-[0_0_30px_rgba(234,179,8,0.15)] backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-primary to-transparent opacity-50"></div>
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-accent-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-accent-primary/10 rounded-full blur-3xl"></div>
          
          <p className="relative text-accent-primary text-sm font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-3 flex-wrap text-center">
            <RoyalIcon variant="warning" size={18} className="flex-shrink-0" />
            <span className="text-sm font-semibold">Referral system is in development. Check back soon!</span>
            <RoyalIcon variant="warning" size={18} className="flex-shrink-0" />
          </p>
        </RoyalCard>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* THE PYRAMID VISUAL */}
          <div className="relative flex flex-col items-center justify-center py-12 min-h-[500px]">
            {/* ILLUMINATI EYE OVERLAY */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 opacity-30 pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                    <svg width="600" height="600" viewBox="0 0 100 100" className="w-[800px] h-[800px]">
                        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-accent-primary" strokeDasharray="1 1" />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-accent-primary" />
                        <path d="M50 2 L98 98 L2 98 Z" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-accent-primary" opacity="0.5" />
                        <path d="M50 98 L98 2 L2 2 Z" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-accent-primary" opacity="0.5" />
                    </svg>
                </motion.div>
            </div>

            {/* God Tier */}
            <div className="relative z-40">
                <motion.div 
                  className={`w-24 sm:w-32 h-16 sm:h-24 bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-700 clip-path-triangle flex items-center justify-center mb-1 shadow-[0_0_50px_var(--shadow-solana-lg)] border-b-2 border-yellow-200/30 ${pyramidPosition === 'god' ? 'brightness-125 shadow-[0_0_80px_rgba(234,179,8,0.8)] scale-105' : ''}`}
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div className="relative">
                      <RoyalIcon variant="eye" className="text-black drop-shadow-lg" size={24} />
                      <motion.div 
                        className="absolute inset-0 bg-white/50 rounded-full blur-sm"
                        animate={{ opacity: [0, 0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                  </div>
                </motion.div>
                {pyramidPosition === 'god' && <YouAreHereMarker />}
            </div>
            
            {/* High Priests */}
            <div className="relative z-30">
                <motion.div 
                  className={`w-36 sm:w-48 h-16 sm:h-24 bg-gradient-to-b from-purple-500 to-purple-900 clip-path-trapezoid mb-1 flex items-center justify-center border-t border-purple-400/30 opacity-90 hover:opacity-100 transition-opacity ${pyramidPosition === 'priests' ? 'brightness-125 shadow-[0_0_40px_rgba(168,85,247,0.6)] opacity-100 scale-105' : ''}`}
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 0.9, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                  <span className="text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest drop-shadow-md font-cinzel">High Priests</span>
                </motion.div>
                {pyramidPosition === 'priests' && <YouAreHereMarker />}
            </div>

            {/* Nobles */}
            <div className="relative z-20">
                <motion.div 
                  className={`w-48 sm:w-64 h-16 sm:h-24 bg-gradient-to-b from-blue-500 to-blue-900 clip-path-trapezoid mb-1 flex items-center justify-center border-t border-blue-400/30 opacity-80 hover:opacity-100 transition-opacity ${pyramidPosition === 'nobles' ? 'brightness-125 shadow-[0_0_40px_rgba(59,130,246,0.6)] opacity-100 scale-105' : ''}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 0.8, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                >
                  <span className="text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest drop-shadow-md font-cinzel">Nobles</span>
                </motion.div>
                {pyramidPosition === 'nobles' && <YouAreHereMarker />}
            </div>

            {/* You Are Here (Dynamic) */}
            <div className="relative z-10">
                <motion.div 
                  className={`w-60 sm:w-80 h-16 sm:h-24 bg-gradient-to-b from-stone-500 to-stone-900 clip-path-trapezoid mb-1 flex items-center justify-center border-t border-stone-400/30 opacity-70 hover:opacity-90 transition-opacity ${pyramidPosition === 'masses' && publicKey ? 'brightness-125 shadow-[0_0_30px_rgba(120,113,108,0.5)] opacity-100 scale-105' : ''}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 0.7, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                >
                  <span className="text-stone-300 font-bold text-[10px] sm:text-xs uppercase tracking-widest drop-shadow-md font-cinzel">The Masses</span>
                </motion.div>
                {pyramidPosition === 'masses' && publicKey && <YouAreHereMarker />}
            </div>

            {/* CSS for Shapes */}
            <style>{`
              .clip-path-triangle { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); }
              .clip-path-trapezoid { clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%); }
            `}</style>
          </div>

          {/* DASHBOARD */}
          <div className="space-y-6">
            <RoyalCard variant="glass" className="p-8 border-l-4 border-accent-primary shadow-xl" entranceDelay={100}>
              <h2 className="text-2xl font-bold text-white mb-2 font-cinzel">Your Empire of Dirt</h2>
              <p className="text-text-secondary mb-6">
                Recruit subjects. They pay tribute. You gain Divine Favor. <br/>
                <span className="italic text-xs opacity-60 text-accent-primary/80">*Divine Favor has no monetary value. It is purely for the soul.*</span>
              </p>

              <AnimatePresence mode="wait">
                {!publicKey ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-8 bg-black/20 rounded-lg"
                  >
                    <RoyalIcon variant="crown" size={64} className="mx-auto mb-4 text-yellow-400" />
                    <h2 className="text-2xl font-semibold mb-2">Connect Your Wallet</h2>
                    <p className="text-foreground-secondary mb-6">
                      Connect your Solana wallet to view your referral statistics
                    </p>
                  </motion.div>
                ) : loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ReferralSkeleton />
                  </motion.div>
                ) : error ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-8 bg-black/20 rounded-lg"
                  >
                    <div className="text-red-400 mb-4">
                      <RoyalIcon variant="trophy" size={64} className="mx-auto" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2 text-red-400">Error Loading Stats</h2>
                    <p className="text-foreground-secondary mb-6">{error}</p>
                    <Button
                      onClick={() => window.location.reload()}
                      variant="primary"
                    >
                      Try Again
                    </Button>
                  </motion.div>
                ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                      className="relative overflow-hidden bg-black/40 p-4 rounded-lg text-center border border-white/5 group"
                      whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.2)' }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <p className="text-text-secondary text-xs uppercase font-bold tracking-wider mb-1">Subjects Recruited</p>
                      <motion.p 
                        className="text-2xl sm:text-3xl font-bold text-white font-cinzel"
                        key={stats.referralCount}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        {stats.referralCount}
                      </motion.p>
                    </motion.div>
                    <motion.div 
                      className="relative overflow-hidden bg-black/40 p-4 rounded-lg text-center border border-accent-primary/20 group"
                      whileHover={{ scale: 1.02, borderColor: 'rgba(234,179,8,0.4)' }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-accent-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <p className="text-accent-primary/80 text-xs uppercase font-bold tracking-wider mb-1">Divine Favor</p>
                      <motion.p 
                        className="text-2xl sm:text-3xl font-bold text-accent-primary font-cinzel drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]"
                        key={divineFavor}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        {divineFavor}
                      </motion.p>
                    </motion.div>
                  </div>

                  <div className="relative bg-gradient-to-br from-accent-primary/10 to-black/40 p-6 rounded-xl border border-accent-primary/30 shadow-[0_0_20px_rgba(234,179,8,0.05)]">
                    <div className="absolute top-0 right-0 p-3 opacity-20">
                      <RoyalIcon variant="share" size={40} className="text-accent-primary" />
                    </div>
                    <h3 className="font-bold text-white mb-2 font-cinzel text-lg">Grow Your Downline</h3>
                    <p className="text-sm text-text-secondary mb-6 relative z-10">
                      Share this Blink on X. When users pay tribute through it, you are credited as their Gateway to Salvation.
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        variant="primary" 
                        onClick={copyLink}
                        className="w-full font-bold py-4 text-base shadow-lg shadow-accent-primary/20 hover:shadow-accent-primary/40"
                        disabled={copied}
                      >
                        <AnimatePresence mode="wait">
                          {copied ? (
                            <motion.div
                              key="copied"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center justify-center"
                            >
                              <RoyalIcon variant="check" className="mr-2" />
                              Link Copied!
                            </motion.div>
                          ) : (
                            <motion.div
                              key="copy"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center justify-center"
                            >
                              <RoyalIcon variant="share" className="mr-2" />
                              Copy Recruitment Blink
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </motion.div>
                  </div>
                </div>
                )}
              </AnimatePresence>
            </RoyalCard>

            <RoyalCard variant="glass" className="p-6" entranceDelay={200}>
              <h3 className="font-bold text-white mb-6 flex items-center gap-3 text-lg font-cinzel border-b border-white/10 pb-4">
                <RoyalIcon variant="info" size={24} className="text-accent-primary" />
                How It Works (The Ponzi of Soul)
              </h3>
              <ul className="space-y-5">
                <li className="flex gap-4 items-start group">
                  <div className="bg-accent-primary/10 p-2 rounded-full border border-accent-primary/20 group-hover:border-accent-primary/50 transition-colors">
                    <RoyalIcon variant="share" size={16} className="text-accent-primary" />
                  </div>
                  <span className="text-text-secondary text-sm leading-relaxed pt-1">
                    <strong className="text-white block mb-0.5">Share the Light</strong>
                    You share your unique Blink link with aspiring subjects.
                  </span>
                </li>
                <li className="flex gap-4 items-start group">
                  <div className="bg-accent-primary/10 p-2 rounded-full border border-accent-primary/20 group-hover:border-accent-primary/50 transition-colors">
                    <RoyalIcon variant="coins" size={16} className="text-accent-primary" />
                  </div>
                  <span className="text-text-secondary text-sm leading-relaxed pt-1">
                    <strong className="text-white block mb-0.5">Recruit Subjects</strong>
                    A new subject pays tribute to the Throne using your link.
                  </span>
                </li>
                <li className="flex gap-4 items-start group">
                  <div className="bg-accent-primary/10 p-2 rounded-full border border-accent-primary/20 group-hover:border-accent-primary/50 transition-colors">
                    <RoyalIcon variant="lock" size={16} className="text-accent-primary" />
                  </div>
                  <span className="text-text-secondary text-sm leading-relaxed pt-1">
                    <strong className="text-white block mb-0.5">The Protocol Keeps All</strong>
                    The Protocol (God) keeps <strong className="text-accent-primary">100%</strong> of the SOL. You get $0.
                  </span>
                </li>
                <li className="flex gap-4 items-start group">
                  <div className="bg-accent-primary/10 p-2 rounded-full border border-accent-primary/20 group-hover:border-accent-primary/50 transition-colors">
                    <RoyalIcon variant="star" size={16} className="text-accent-primary" />
                  </div>
                  <span className="text-text-secondary text-sm leading-relaxed pt-1">
                    <strong className="text-white block mb-0.5">Eternal Glory</strong>
                    You receive &quot;Divine Favor&quot;. The fastest way to earn favor is by building a large downline of loyal subjects.
                  </span>
                </li>
              </ul>
            </RoyalCard>
          </div>

        </div>
      </div>
    </PageLayout>
  );
};

export default ReferralPyramid;
