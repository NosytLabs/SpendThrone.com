import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RoyalIcon } from '@/components/ui';
import { statsService } from '@/core/services/statsService';
import { LeaderboardEntry } from '@/shared/utils/types';
import { formatAmount } from '@/shared/utils/formatting/currency';

export const CurrentEmperorBanner = () => {
  const [emperor, setEmperor] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    // Poll for the current king every 30s to keep it fresh
    const fetchKing = async () => {
      try {
        const top = await statsService.getTopEmperor();
        if (top) setEmperor(top);
      } catch (e) {
        // Silently fail on banner
      }
    };
    
    fetchKing();
    const interval = setInterval(fetchKing, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!emperor) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 text-black py-1.5 px-4 overflow-hidden relative z-[45] shadow-lg shadow-yellow-500/20 animate-fade-in-down">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-bold font-cinzel">
        <RoyalIcon variant="crown" size={16} className="text-black animate-pulse" />
        <span className="uppercase tracking-wider">Current Ruler:</span>
        <span className="bg-black/10 px-2 py-0.5 rounded text-black font-extrabold truncate max-w-[120px] sm:max-w-none">
          {emperor.displayName || `${emperor.walletAddress.slice(0, 4)}...${emperor.walletAddress.slice(-4)}`}
        </span>
        <span className="hidden sm:inline opacity-80">-</span>
        <span className="bg-black/10 px-2 py-0.5 rounded family-mono">
          {formatAmount(emperor.totalUsdValue)}
        </span>
        <Link 
          to="/leaderboard" 
          className="ml-3 bg-black/20 hover:bg-black/30 text-black px-3 py-0.5 rounded-md transition-all font-bold border border-black/10 hover:scale-105 inline-flex items-center gap-1 shadow-sm"
        >
          Usurp Them <RoyalIcon variant="sword" size={12} />
        </Link>
      </div>
      
      {/* Shine effect */}
      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 animate-shine" />
    </div>
  );
};
