import React from 'react';
import { RoyalIcon } from '@/components/ui';

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
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex gap-3 min-w-max py-1">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            disabled={disabled}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap border
              ${selectedFilter === filter.value 
                ? 'text-accent-primary bg-accent-primary/10 border-accent-primary/30 hover:bg-accent-primary/15 hover:border-accent-primary/40' 
                : 'text-text-secondary bg-surface border-border-primary hover:text-text-primary hover:bg-surface-hover hover:border-border-hover hover:-translate-y-[1px]'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed hover:transform-none' : 'cursor-pointer'}
            `}
          >
            <RoyalIcon variant={filter.icon} size={16} />
            <span>{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};