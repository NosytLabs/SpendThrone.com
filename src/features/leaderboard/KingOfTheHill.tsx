import React from 'react';
import { LeaderboardEntry } from '@/shared/utils/types';
import { RoyalIcon, GlowPulse, FloatingAnimation, EntranceAnimation, Button } from '@/components/ui';
import { formatCurrency } from '@/shared/utils/formatting/currency';
import { Link } from 'react-router-dom';

interface KingOfTheHillProps {
  king: LeaderboardEntry | null;
  onDethrone?: (amount: number) => void;
}

export const KingOfTheHill: React.FC<KingOfTheHillProps> = ({ king, onDethrone }) => {
  if (!king) return null;

  return (
    <EntranceAnimation type="scale" duration={800} className="w-full mb-12">
      <div className="relative w-full max-w-3xl mx-auto">
        {/* Background Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent-primary/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-accent-primary/5 to-transparent opacity-50 pointer-events-none" />

        {/* The Throne Card */}
        <div className="relative bg-background-secondary/90 border-2 border-accent-primary rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_0_50px_-12px_rgba(234,179,8,0.3)] overflow-hidden group hover:shadow-[0_0_70px_-12px_rgba(234,179,8,0.5)] transition-all duration-500">
          
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-accent-primary rounded-tl-xl opacity-60" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-accent-primary rounded-tr-xl opacity-60" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-accent-primary rounded-bl-xl opacity-60" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-accent-primary rounded-br-xl opacity-60" />

          {/* Crown & Title */}
          <FloatingAnimation direction="up" distance={10} duration={4000}>
            <GlowPulse color="gold" intensity="strong" duration={3000}>
              <div className="relative mb-6">
                <RoyalIcon variant="crown" size={64} className="text-accent-primary filter drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent-primary rounded-full opacity-75" />
              </div>
            </GlowPulse>
          </FloatingAnimation>

          <h3 className="royal-text-title text-accent-primary mb-2 tracking-widest uppercase">
            Current Ruler
          </h3>
          
          {/* King's Name */}
          <Link 
            to={`/profile/${king.walletAddress}`}
            className="text-4xl md:text-5xl font-bold text-white mb-4 hover:text-accent-primary transition-colors font-serif tracking-tight relative z-10"
          >
            {king.displayName || 'Unknown Ruler'}
          </Link>

          {/* Message */}
          {king.message && (
            <div className="relative max-w-lg mx-auto mb-8 px-8 py-4">
              <RoyalIcon variant="quote" size={24} className="absolute top-0 left-0 text-accent-primary/40 transform -scale-x-100" />
              <p className="text-xl text-text-secondary italic font-serif leading-relaxed">
                {king.message}
              </p>
              <RoyalIcon variant="quote" size={24} className="absolute bottom-0 right-0 text-accent-primary/40" />
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-8 mb-8 w-full max-w-md">
            <div className="flex flex-col items-center p-4 bg-black/20 rounded-lg border border-accent-primary/20">
              <span className="text-text-muted text-sm uppercase tracking-wider mb-1">Total Tribute</span>
              <span className="text-2xl font-bold text-success font-mono">
                {formatCurrency(king.totalUsdValue)}
              </span>
            </div>
            <div className="flex flex-col items-center p-4 bg-black/20 rounded-lg border border-accent-primary/20">
              <span className="text-text-muted text-sm uppercase tracking-wider mb-1">Reign Time</span>
              <span className="text-2xl font-bold text-text-primary font-mono">
                {king.timeAgo ? 'Active' : 'Just now'}
              </span>
            </div>
          </div>

          {/* Call to Action */}
          {onDethrone && (
            <Button
              variant="gradient"
              size="xl"
              onClick={() => onDethrone(king.totalUsdValue + 1)}
              className="w-full max-w-sm text-xl font-bold shadow-2xl shadow-accent-primary/20 hover:shadow-accent-primary/50 border-2 border-accent-primary/50"
            >
              <span className="flex items-center gap-3">
                <RoyalIcon variant="swords" size={24} />
                USURP THE THRONE
              </span>
            </Button>
          )}
          
          <p className="mt-4 text-sm text-text-muted">
            Cost to overtake: <span className="text-accent-primary font-bold">{formatCurrency(king.totalUsdValue + 1)}</span>
          </p>

          {/* Link */}
          {king.link && (
             <a 
               href={king.link}
               target="_blank" 
               rel="noopener noreferrer"
               className="mt-6 flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors text-sm"
             >
               <RoyalIcon variant="externalLink" size={14} />
               Visit Royal Decree
             </a>
          )}
        </div>
      </div>
    </EntranceAnimation>
  );
};
