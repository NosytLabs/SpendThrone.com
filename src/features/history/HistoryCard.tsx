import React from 'react';
import { Card, RoyalIcon } from '@/components/ui';
import { HistoryCardData } from '@/core/data/historyPageData';

interface HistoryCardProps {
  card: HistoryCardData;
  compact?: boolean;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ card, compact = false }) => {
  return (
    <Card 
      variant="glass" 
      className={`
        group relative overflow-hidden transition-all duration-300 hover:border-accent-primary/50 hover:translate-y-[-4px]
        ${compact ? 'p-4' : 'p-6'}
      `}
    >
      {/* Image/Icon Header */}
      <div className={`
        relative mb-4 rounded-lg overflow-hidden bg-black/40 flex items-center justify-center
        ${compact ? 'h-32' : 'h-48'}
      `}>
        {card.imageUrl ? (
          <img 
            src={card.imageUrl} 
            alt={card.title} 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
          />
        ) : (
          <RoyalIcon 
            variant={card.icon} 
            size={compact ? 32 : 48} 
            className={`${card.iconColor} group-hover:text-accent-primary transition-colors`}
          />
        )}
        
        {/* Type Badge */}
        <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] uppercase tracking-wider text-white font-medium">
          {card.statusType}
        </div>
      </div>

      {/* Content */}
      <div>
        <div className="flex justify-between items-start mb-2">
          <h4 className={`font-bold text-white group-hover:text-accent-primary transition-colors ${compact ? 'text-sm' : 'text-lg'}`}>
            {card.title}
          </h4>
          <span className="text-xs text-text-muted font-mono bg-white/5 px-1.5 py-0.5 rounded">
            {card.year}
          </span>
        </div>
        
        <p className={`text-text-secondary leading-relaxed ${compact ? 'text-xs line-clamp-3' : 'text-sm'}`}>
          {card.description}
        </p>

        {/* Cost Tag */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
          <RoyalIcon variant="coins" size={14} className="text-accent-secondary" />
          <span className="text-sm font-bold text-accent-secondary">
            {card.cost}
          </span>
        </div>
      </div>
    </Card>
  );
};
