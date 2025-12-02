import React from 'react';
import { RoyalIcon } from '@/components/ui';
import styles from './LeaderboardFilters.module.css';

interface LeaderboardFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  disabled?: boolean;
}

const filters = [
  { value: 'all', label: 'All Nobles', icon: 'crown' as const },
  { value: 'emperor', label: 'Emperors', icon: 'crown' as const },
  { value: 'king', label: 'Kings', icon: 'trophy' as const },
  { value: 'noble', label: 'Nobles', icon: 'sparkles' as const },
  { value: 'knight', label: 'Knights', icon: 'barChart' as const },
  { value: 'peasant', label: 'Peasants', icon: 'wallet' as const },
];

export const LeaderboardFilters: React.FC<LeaderboardFiltersProps> = ({ 
  selectedFilter, 
  onFilterChange, 
  disabled = false 
}) => {
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filtersScroll}>
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            disabled={disabled}
            className={`${styles.filterButton} ${
              selectedFilter === filter.value ? styles.active : ''
            } ${disabled ? styles.disabled : ''}`}
          >
            <RoyalIcon variant={filter.icon} size={16} />
            <span>{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};