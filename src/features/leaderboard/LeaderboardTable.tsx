import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LeaderboardEntry } from '@/shared/utils/types';
import { formatCurrency } from '@/shared/utils/formatting/currency';
import { getRankMedal } from '@/shared/utils/gamification';
import { RoyalIcon } from '@/components/ui';
import { useToast } from '@/components/ui/use-toast';
import styles from './LeaderboardTable.module.css';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  selectedFilter?: string;
  userRank?: number | null;
  onOvertake?: (amount: number) => void;
}

const getRankIcon = (rank: number) => {
  if (rank === 1) return <RoyalIcon variant="crown" size={14} className="text-accent-primary" />;
  if (rank === 2) return <RoyalIcon variant="trophy" size={14} className="text-accent-secondary" />;
  if (rank === 3) return <RoyalIcon variant="sparkles" size={14} className="text-primary" />;
  if (rank <= 10) return <RoyalIcon variant="barChart" size={12} className="text-secondary" />;
  return null;
};

const getTierIcon = (tier: string) => {
  const t = (tier || '').toLowerCase();
  if (t.includes('emperor')) return <RoyalIcon variant="crown" size={12} className="text-accent-primary" />;
  if (t.includes('king')) return <RoyalIcon variant="trophy" size={12} className="text-accent-primary" />;
  if (t.includes('noble')) return <RoyalIcon variant="sparkles" size={12} className="text-secondary" />;
  if (t.includes('peasant')) return <RoyalIcon variant="wallet" size={12} />;
  if (t.includes('knight')) return <RoyalIcon variant="barChart" size={12} className="text-secondary" />;
  return <RoyalIcon variant="barChart" size={12} />;
};

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries = [], selectedFilter = 'all', userRank, onOvertake }) => {
  const safeEntries = useMemo(() => (Array.isArray(entries) ? entries : []), [entries]);
  const safeFilteredEntries = useMemo(() => {
    if (selectedFilter === 'all') return safeEntries;
    const filter = (selectedFilter || '').toLowerCase();
    return safeEntries.filter((entry) => (entry.tier || '').toLowerCase().includes(filter));
  }, [safeEntries, selectedFilter]);

  return (
    <div className={styles.tableContainer}>
      <div className="overflow-x-auto">
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>
                <div className={styles.headerCell}>
                  <RoyalIcon variant="trophy" size={12} className="text-accent-primary" />
                  Rank
                </div>
              </th>
              <th className={styles.th}>
                <div className={styles.headerCell}>
                  <RoyalIcon variant="crown" size={12} className="text-secondary" />
                  Noble
                </div>
              </th>
              <th className={`${styles.th} ${styles.textRight}`}>
                <div className={`${styles.headerCell} justify-end`}>
            <RoyalIcon variant="wallet" size={12} className="text-accent-secondary" />
            Tribute (USD)
          </div>
              </th>
              <th className={`${styles.th} ${styles.textCenter} hidden md:table-cell`}>
                <div className={`${styles.headerCell} justify-center`}>
                  <RoyalIcon variant="sparkles" size={12} className="text-accent-primary" />
                  Tier
                </div>
              </th>
              <th className={`${styles.th} ${styles.textCenter} hidden lg:table-cell`}>
                <div className={`${styles.headerCell} justify-center`}>
                  <RoyalIcon variant="externalLink" size={12} className="text-secondary" />
                  Link
                </div>
              </th>
              <th className={`${styles.th} ${styles.textRight} hidden lg:table-cell`}>
                <div className={`${styles.headerCell} justify-end`}>
                  <RoyalIcon variant="barChart" size={12} className="text-primary" />
                  Tributes
                </div>
              </th>
              <th className={`${styles.th} ${styles.textRight} hidden xl:table-cell`}>
                <div className={`${styles.headerCell} justify-end`}>
                   <RoyalIcon variant="clock" size={12} className="text-text-muted" />
                   Active
                </div>
              </th>
              <th className={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {safeFilteredEntries.length === 0 ? (
              <tr>
                <td className={styles.td} colSpan={8}>
                  <div className={styles.emptyState}>
                    <RoyalIcon variant="crown" size={32} className="text-accent-primary mb-3 animate-pulse" />
                    <span className="royal-text-subtitle text-text-secondary mb-1">The throne awaits...</span>
                    <span className="text-sm text-text-muted">Make your first deposit to claim your noble title</span>
                  </div>
                </td>
              </tr>
            ) : (
              safeFilteredEntries.map((entry) => (
                <tr 
                  key={entry.rank} 
                  className={`${styles.tr} hover:bg-white/5 transition-all duration-300 ${entry.rank === 1 ? styles.king : ''} ${entry.rank === userRank ? styles.highlight : ''} group`}
                ><Row entry={entry} userRank={userRank} onOvertake={onOvertake} /></tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Row = memo(({ entry, onOvertake }: { entry: LeaderboardEntry; userRank?: number | null; onOvertake?: (amount: number) => void }) => {
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

  return (
    <>
      <td className={styles.td}>
        <div className={styles.rankCell}>
          {getRankIcon(entry.rank)}
          <span className={styles.rankNumber}>#{entry.rank}</span>
          {getRankMedal(entry.rank)}
        </div>
      </td>
      <td className={styles.td}>
        <div className={styles.nobleCell}>
          <div className="relative w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center overflow-hidden shrink-0">
             <RoyalIcon variant="user" size={16} className="text-text-muted opacity-70" />
          </div>
          <div className="flex flex-col items-start gap-0.5 min-w-0">
            <div className="flex items-center gap-1.5">
              <Link 
                to={`/profile/${entry.walletAddress}`}
                className="font-medium truncate max-w-[100px] md:max-w-[140px] hover:text-accent-primary transition-colors"
              >
                {entry.displayName || 'Anonymous'}
              </Link>
              <button 
                  onClick={copyAddress}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-accent-primary focus:opacity-100"
                  title="Copy Wallet Address"
                  aria-label="Copy Wallet Address"
              >
                  <RoyalIcon variant="copy" size={12} />
              </button>
            </div>
            {entry.message && (
              <span className="text-[10px] text-text-secondary/80 italic max-w-[120px] md:max-w-[200px] truncate" title={entry.message}>
                &ldquo;{entry.message}&rdquo;
              </span>
            )}
          </div>
        </div>
      </td>
      <td className={`${styles.td} ${styles.textRight}`}>
        <div className={styles.valueCell}>
          <RoyalIcon variant="wallet" size={12} className="text-accent-secondary" />
          {formatCurrency(entry.totalUsdValue)}
        </div>
      </td>
      <td className={`${styles.td} ${styles.textCenter} hidden md:table-cell`}>
        <div className={styles.tierCell}>
          {getTierIcon(entry.tier)}
          <span className={styles.tierBadge}>{entry.tier}</span>
        </div>
      </td>
      <td className={`${styles.td} ${styles.textCenter} hidden lg:table-cell`}>
        <div className="flex justify-center items-center h-full">
          {entry.link ? (
            <a
              href={entry.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent-primary transition-colors inline-flex justify-center items-center opacity-70 hover:opacity-100"
              title={entry.link}
              onClick={(e) => e.stopPropagation()}
            >
              <RoyalIcon variant="externalLink" size={14} />
            </a>
          ) : (
            <span className="text-text-muted/40 select-none" title="No link provided">—</span>
          )}
        </div>
      </td>
      <td className={`${styles.td} ${styles.textRight} hidden lg:table-cell`}>
        <div className={styles.countCell}>
          <RoyalIcon variant="barChart" size={12} className="text-primary" />
          {entry.transactionCount}
        </div>
      </td>
      <td className={`${styles.td} ${styles.textRight} hidden xl:table-cell`}>{entry.timeAgo}</td>
      <td className={`${styles.td} w-[1%] whitespace-nowrap`}>
        <div className="flex items-center justify-end gap-2">
          <Link 
            to={`/profile/${entry.walletAddress}`}
            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-white/10 text-text-secondary hover:text-text-primary"
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
                  className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-accent-primary/20 text-accent-primary"
                  title={entry.rank === 1 
                    ? `Dethrone the King (Pay ${formatCurrency(entry.totalUsdValue + 1)})`
                    : `Overtake Rank #${entry.rank} (Pay ${formatCurrency(entry.totalUsdValue + 1)})`
                  }
              >
                  {entry.rank === 1 ? (
                    <RoyalIcon variant="swords" size={16} className="text-accent-primary" />
                  ) : (
                    <RoyalIcon variant="trend" size={16} />
                  )}</button>
          )}
        </div>
      </td>
    </>
  );
});
Row.displayName = 'LeaderboardRow';