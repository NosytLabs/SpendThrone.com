import React, { memo, useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LeaderboardEntry } from '@/shared/utils/types';
import { formatCurrency } from '@/shared/utils/formatting/currency';
import { RoyalIcon, RoyalCard } from '@/components/ui';
import { useToast } from '@/components/ui/use-toast';
import { Analytics, EVENTS } from '@/shared/services/analytics';
import { cn } from '@/shared/utils/utils';

// Track previous entries for rank change detection
const useRankChanges = (entries: LeaderboardEntry[]) => {
  const [prevEntries, setPrevEntries] = useState<LeaderboardEntry[]>([]);
  const [rankChanges, setRankChanges] = useState<Map<number, { type: 'up' | 'down' | 'new'; amount?: number }>>(new Map());

  useEffect(() => {
    if (prevEntries.length === 0) {
      setPrevEntries(entries);
      return;
    }

    const newRankChanges = new Map<number, { type: 'up' | 'down' | 'new'; amount?: number }>();
    
    // Create a map of previous ranks for quick lookup
    const prevRankMap = new Map<string, number>();
    prevEntries.forEach(entry => {
      if (entry.walletAddress) {
        prevRankMap.set(entry.walletAddress, entry.rank);
      }
    });

    // Check for rank changes
    entries.forEach(entry => {
      if (!entry.walletAddress) return;
      
      const prevRank = prevRankMap.get(entry.walletAddress);
      
      if (prevRank === undefined) {
        // New entry
        newRankChanges.set(entry.rank, { type: 'new' });
      } else if (prevRank !== entry.rank) {
        // Rank changed
        const changeAmount = prevRank - entry.rank;
        newRankChanges.set(entry.rank, { 
          type: changeAmount > 0 ? 'up' : 'down', 
          amount: Math.abs(changeAmount) 
        });
      }
    });

    setRankChanges(newRankChanges);
    setPrevEntries(entries);
  }, [entries, prevEntries]);

  return rankChanges;
};

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  selectedFilter?: string;
  userRank?: number | null;
  onOvertake?: (amount: number) => void;
}

const getRankIcon = (rank: number) => {
  if (rank === 1) return <RoyalIcon variant="crown" size={16} className="text-gold-500 animate-pulse-slow" />;
  if (rank === 2) return <RoyalIcon variant="trophy" size={16} className="text-gray-300" />;
  if (rank === 3) return <RoyalIcon variant="sparkles" size={16} className="text-amber-700" />;
  if (rank <= 10) return <RoyalIcon variant="barChart" size={14} className="text-accent-secondary" />;
  return null;
};

const getTierIcon = (tier: string) => {
  const t = (tier || '').toLowerCase();
  if (t.includes('emperor')) return <RoyalIcon variant="crown" size={14} className="text-gold-500" />;
  if (t.includes('king')) return <RoyalIcon variant="trophy" size={14} className="text-gold-400" />;
  if (t.includes('noble')) return <RoyalIcon variant="sparkles" size={14} className="text-accent-secondary" />;
  if (t.includes('peasant')) return <RoyalIcon variant="wallet" size={14} />;
  if (t.includes('knight')) return <RoyalIcon variant="barChart" size={14} className="text-accent-secondary" />;
  return <RoyalIcon variant="barChart" size={14} />;
};

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries = [], selectedFilter = 'all', userRank, onOvertake }) => {
  const safeEntries = useMemo(() => (Array.isArray(entries) ? entries : []), [entries]);
  const safeFilteredEntries = useMemo(() => {
    if (selectedFilter === 'all') return safeEntries;
    const filter = (selectedFilter || '').toLowerCase();
    return safeEntries.filter((entry) => (entry.tier || '').toLowerCase().includes(filter));
  }, [safeEntries, selectedFilter]);
  
  // Track rank changes for animations
  const rankChanges = useRankChanges(safeFilteredEntries);

  return (
    <RoyalCard variant="glass" className="overflow-hidden border border-accent-primary/20 shadow-2xl p-0 bg-black/40 backdrop-blur-xl">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse table-auto text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-4 text-left font-bold text-accent-primary bg-black/60 sticky top-0 z-10 uppercase tracking-wider font-serif backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs">
                  <RoyalIcon variant="trophy" size={12} className="text-accent-primary" />
                  Rank
                </div>
              </th>
              <th className="px-4 py-4 text-left font-bold text-secondary bg-black/60 sticky top-0 z-10 uppercase tracking-wider font-serif backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs">
                  <RoyalIcon variant="crown" size={12} className="text-secondary" />
                  Noble
                </div>
              </th>
              <th className="px-4 py-4 text-right font-bold text-accent-secondary bg-black/60 sticky top-0 z-10 uppercase tracking-wider font-serif backdrop-blur-md">
                <div className="flex items-center justify-end gap-2 text-xs">
                  <RoyalIcon variant="wallet" size={12} className="text-accent-secondary" />
                  Tribute (USD)
                </div>
              </th>
              <th className="px-4 py-4 text-center font-bold text-accent-primary bg-black/60 sticky top-0 z-10 uppercase tracking-wider font-serif backdrop-blur-md hidden md:table-cell">
                <div className="flex items-center justify-center gap-2 text-xs">
                  <RoyalIcon variant="sparkles" size={12} className="text-accent-primary" />
                  Tier
                </div>
              </th>
              <th className="px-4 py-4 text-center font-bold text-secondary bg-black/60 sticky top-0 z-10 uppercase tracking-wider font-serif backdrop-blur-md hidden lg:table-cell">
                <div className="flex items-center justify-center gap-2 text-xs">
                  <RoyalIcon variant="externalLink" size={12} className="text-secondary" />
                  Link
                </div>
              </th>
              <th className="px-4 py-4 text-right font-bold text-primary bg-black/60 sticky top-0 z-10 uppercase tracking-wider font-serif backdrop-blur-md hidden lg:table-cell">
                <div className="flex items-center justify-end gap-2 text-xs">
                  <RoyalIcon variant="barChart" size={12} className="text-primary" />
                  Tributes
                </div>
              </th>
              <th className="px-4 py-4 text-right font-bold text-text-muted bg-black/60 sticky top-0 z-10 uppercase tracking-wider font-serif backdrop-blur-md hidden xl:table-cell">
                <div className="flex items-center justify-end gap-2 text-xs">
                   <RoyalIcon variant="clock" size={12} className="text-text-muted" />
                   Active
                </div>
              </th>
              <th className="px-4 py-4 bg-black/60 sticky top-0 z-10 backdrop-blur-md"></th>
            </tr>
          </thead>
          <tbody>
            {safeFilteredEntries.length === 0 ? (
              <tr>
                <td className="px-4 py-12 text-center" colSpan={8}>
                  <div className="flex flex-col items-center gap-4 py-8 px-4 text-text-muted">
                    <div className="w-16 h-16 rounded-full bg-accent-primary/10 flex items-center justify-center mb-2 animate-pulse-slow">
                        <RoyalIcon variant="crown" size={32} className="text-accent-primary" />
                    </div>
                    <span className="font-cinzel text-xl text-white">The throne awaits...</span>
                    <span className="text-sm text-text-muted max-w-xs">Be the first to claim your noble title and etch your name in history.</span>
                  </div>
                </td>
              </tr>
            ) : (
              safeFilteredEntries.map((entry, index) => {
                const rankChange = rankChanges.get(entry.rank);
                const isUserRow = entry.rank === userRank;
                const isKing = entry.rank === 1;
                
                return (
                  <tr 
                    key={entry.rank} 
                    className={cn(
                      'transition-all duration-300 relative group border-b border-white/5 last:border-0',
                      'hover:bg-white/5 hover:shadow-lg hover:z-10 hover:-translate-y-[1px]',
                      isKing && 'bg-gradient-to-r from-gold-500/10 to-transparent border-l-4 border-l-gold-500 shadow-[inset_0_0_20px_rgba(234,179,8,0.05)]',
                      isUserRow && !isKing && 'bg-accent-primary/10 border-l-4 border-l-accent-primary shadow-[inset_0_0_15px_rgba(234,179,8,0.05)]',
                      rankChange?.type === 'up' && 'animate-highlight-success',
                      rankChange?.type === 'down' && 'animate-highlight-error',
                      rankChange?.type === 'new' && 'animate-fade-in-up'
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Row 
                      entry={entry} 
                      onOvertake={onOvertake} 
                      rankChange={rankChange}
                      isUserRow={isUserRow}
                      isKing={isKing}
                    />
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </RoyalCard>
  );
};

const Row = memo(({ 
  entry, 
  onOvertake, 
  rankChange, 
  isUserRow,
  isKing
}: { 
  entry: LeaderboardEntry; 
  onOvertake?: (amount: number) => void;
  rankChange?: { type: 'up' | 'down' | 'new'; amount?: number };
  isUserRow?: boolean;
  isKing?: boolean;
}) => {
  const { addToast } = useToast();

  const copyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (entry.walletAddress) {
      globalThis.navigator.clipboard.writeText(entry.walletAddress);
      addToast({
        type: 'info',
        title: 'Address Copied',
        description: `${entry.displayName || 'User'}'s address copied to clipboard`,
        duration: 2000,
      });
    }
  };

  const shareRank = (e: React.MouseEvent) => {
    e.stopPropagation();
    const profileUrl = `${window.location.origin}/profile/${entry.walletAddress}`;
    const shareText = `I am Rank #${entry.rank} on SpendThrone. Can you dethrone me? 👑 ${profileUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <>
      <td className="px-4 py-3 align-middle">
        <div className={cn(
            "flex items-center gap-2 font-bold font-mono text-lg",
            isKing ? "text-gold-400 drop-shadow-md" : isUserRow ? "text-accent-primary" : "text-text-secondary"
        )}>
          {getRankIcon(entry.rank)}
          
          <span className="min-w-[2rem]">#{entry.rank}</span>
          
          {rankChange && (
            <div className={cn(
                "flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 shadow-sm",
                rankChange.type === 'up' ? "bg-success/20 text-success" : 
                rankChange.type === 'down' ? "bg-error/20 text-error" : 
                "bg-accent-primary/20 text-accent-primary"
            )}>
              {rankChange.type === 'up' && '↑'}
              {rankChange.type === 'down' && '↓'}
              {rankChange.type === 'new' && '✨'}
              {rankChange.amount && rankChange.amount > 1 && rankChange.amount}
            </div>
          )}
        </div>
      </td>
      
      <td className="px-4 py-3 align-middle">
        <div className="flex items-center gap-3">
          <div className={cn(
              "relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0 border-2 transition-transform duration-300 group-hover:scale-105",
              isKing ? "border-gold-500 bg-gold-900/20 shadow-[0_0_10px_rgba(234,179,8,0.3)]" : "border-white/10 bg-white/5"
          )}>
             <RoyalIcon variant="user" size={18} className={cn("opacity-80", isKing ? "text-gold-400" : "text-text-muted")} />
          </div>
          
          <div className="flex flex-col items-start min-w-0">
            <div className="flex items-center gap-2">
              <Link 
                to={`/profile/${entry.walletAddress}`}
                className={cn(
                    "font-medium truncate max-w-[120px] md:max-w-[180px] hover:text-accent-primary transition-colors text-base",
                    isKing ? "text-gold-200" : "text-text-primary"
                )}
              >
                {entry.displayName || 'Anonymous'}
              </Link>
              <button 
                  onClick={copyAddress}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-text-muted hover:text-accent-primary p-1 hover:bg-white/10 rounded"
                  title="Copy Wallet Address"
                  aria-label="Copy Wallet Address"
              >
                  <RoyalIcon variant="copy" size={12} />
              </button>
            </div>
            
            {entry.message && (
              <span className="text-xs text-text-secondary/70 italic max-w-[140px] md:max-w-[220px] truncate" title={entry.message}>
                &ldquo;{entry.message}&rdquo;
              </span>
            )}
          </div>
        </div>
      </td>
      
      <td className="px-4 py-3 align-middle text-right">
        <div className={cn(
            "flex items-center justify-end gap-1.5 font-bold font-mono text-base transition-all duration-300",
            rankChange ? "scale-110 text-accent-primary" : "text-success"
        )}>
          {isKing && <RoyalIcon variant="diamond" size={12} className="text-gold-400 animate-pulse" />}
          {formatCurrency(entry.totalUsdValue)}
        </div>
      </td>
      
      <td className="px-4 py-3 align-middle text-center hidden md:table-cell">
        <div className="flex justify-center">
          <div className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm transition-all duration-300 group-hover:shadow-md",
              isKing ? "bg-gradient-to-r from-gold-400 to-gold-600 text-black border-gold-300" : "bg-black/40 border-white/10 text-text-secondary"
          )}>
            {getTierIcon(entry.tier)}
            {entry.tier}
          </div>
        </div>
      </td>
      
      <td className="px-4 py-3 align-middle text-center hidden lg:table-cell">
        <div className="flex justify-center items-center">
          {entry.link ? (
            <a
              href={entry.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 p-2 rounded-full transition-all duration-200"
              title={entry.link}
              onClick={(e) => {
                e.stopPropagation();
                Analytics.track(EVENTS.LEADERBOARD.LINK_CLICK, { target: entry.link, rank: entry.rank });
              }}
            >
              <RoyalIcon variant="externalLink" size={14} />
            </a>
          ) : (
            <span className="text-text-muted/20 select-none">—</span>
          )}
        </div>
      </td>
      
      <td className="px-4 py-3 align-middle text-right hidden lg:table-cell">
        <div className="flex items-center justify-end gap-1.5 text-text-secondary font-medium">
          <RoyalIcon variant="barChart" size={12} className="text-primary/70" />
          {entry.transactionCount}
        </div>
      </td>
      
      <td className="px-4 py-3 align-middle text-right hidden xl:table-cell">
        <span className="text-xs text-text-muted font-mono">{entry.timeAgo}</span>
      </td>
      
      <td className="px-4 py-3 align-middle w-[1%] whitespace-nowrap">
          <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
          
          <button
            onClick={shareRank}
            className="p-2 rounded-full hover:bg-white/10 text-text-secondary hover:text-accent-primary transition-colors"
            title="Share Rank"
          >
            <RoyalIcon variant="share" size={14} />
          </button>

          <Link 
            to={`/profile/${entry.walletAddress}`}
            className="p-2 rounded-full hover:bg-white/10 text-text-secondary hover:text-accent-primary transition-colors"
            title="View Profile"
            onClick={(e) => e.stopPropagation()}
          >
            <RoyalIcon variant="eye" size={16} />
          </Link>
          
          {onOvertake && (
              <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOvertake(entry.totalUsdValue + 1);
                  }}
                  className={cn(
                      "p-2 rounded-full transition-all duration-200 shadow-sm hover:scale-110",
                      isKing ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30" : "bg-accent-primary/10 text-accent-primary hover:bg-accent-primary hover:text-black border border-accent-primary/30"
                  )}
                  title={isKing 
                    ? `Usurp the Throne (Pay ${formatCurrency(entry.totalUsdValue + 1)})`
                    : `Overtake Rank #${entry.rank} (Pay ${formatCurrency(entry.totalUsdValue + 1)})`
                  }
              >
                  {isKing ? (
                    <RoyalIcon variant="swords" size={16} />
                  ) : (
                    <RoyalIcon variant="trend" size={16} />
                  )}
              </button>
          )}
        </div>
      </td>
    </>
  );
});
Row.displayName = 'LeaderboardRow';