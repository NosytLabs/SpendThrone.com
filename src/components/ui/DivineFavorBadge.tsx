import React from 'react';
import { RoyalIcon } from './RoyalIcon';
import { useWallet } from '@solana/wallet-adapter-react';
import { useProfileData } from '@/features/profile/hooks/useProfileData';

interface DivineFavorBadgeProps {
  className?: string;
  showLabel?: boolean;
}

export const DivineFavorBadge: React.FC<DivineFavorBadgeProps> = ({ 
  className = '', 
  showLabel = true 
}) => {
  const { publicKey } = useWallet();
  const { userData } = useProfileData(publicKey?.toString());

  if (!publicKey || !userData) return null;

  // Calculate Divine Favor: (Total USD * 10) + (Tx Count * 50)
  // This is a simplified "Score" that drives behavior.
  const score = Math.floor((userData.totalContributed * 10) + (userData.totalTransactions * 50));

  return (
    <div 
      className={`relative group flex items-center gap-2 bg-accent-primary/10 border border-accent-primary/30 rounded-full px-3 py-1 cursor-help hover:bg-accent-primary/20 transition-colors ${className}`}
      title="Divine Favor Points"
    >
      <RoyalIcon variant="sparkles" size={14} className="text-accent-primary" />
      <span className="text-accent-primary font-bold font-mono text-sm">
        {score.toLocaleString()}
      </span>
      {showLabel && (
        <span className="text-accent-primary/60 text-xs uppercase font-bold tracking-wider hidden sm:inline">Favor</span>
      )}

      {/* Tooltip */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-black/90 backdrop-blur-md border border-accent-primary/20 rounded-lg p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        <p className="text-xs text-text-secondary">
          <strong className="text-accent-primary block mb-1">Divine Favor</strong>
          Earned through acts of loyalty and recruiting subjects. The Gods are watching.
          <br/>
          <span className="italic text-text-muted text-[10px] mt-1 block">&quot;Rewards are metaphysical... probably.&quot;</span>
        </p>
      </div>
    </div>
  );
};
