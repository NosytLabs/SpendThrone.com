import React from 'react';
import { RoyalIcon } from '@/components/ui/RoyalIcon';
import { Card } from '@/components/ui/Card';
import { HistoryCardData } from '@/core/data/historyPageData';
import { escapeRegExp } from '@/shared/utils/utils';

interface TimelineItemProps {
  card: HistoryCardData;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ card }) => {
  // Function to highlight text
  const getHighlightedText = (text: string, highlights?: string[]) => {
    if (!highlights || highlights.length === 0) return { __html: text };
    
    const pattern = new RegExp(`(${highlights.map(escapeRegExp).join('|')})`, 'g');
    return {
      __html: text.replace(pattern, '<strong class="text-white">$1</strong>')
    };
  };

  return (
    <Card variant="glass" className={`p-6 border-l-4 ${card.borderColor} hover:border-opacity-80 transition-colors duration-300 h-full flex flex-col`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-full bg-white/5 ${card.borderColor.replace('border', 'bg').replace('600', '500').replace('500', '500')}/10`}>
            <RoyalIcon variant={card.icon} className={card.iconColor} size={24} />
        </div>
        <h3 className="text-xl font-bold text-white">{card.title}</h3>
      </div>
      
      <p 
        className="text-text-secondary mb-4 leading-relaxed flex-grow" 
        dangerouslySetInnerHTML={getHighlightedText(card.description, card.highlightText)} 
      />
      
      <div className="mt-auto space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
            {card.tags.map((tag, i) => (
                <span key={i} className={`px-2 py-1 text-xs font-medium rounded border border-white/5 ${tag.colorClass}`}>
                    {tag.label}
                </span>
            ))}
        </div>

        {/* Extra Content (e.g. List of items) */}
        {card.extraContent && (
            <div className={`bg-background-tertiary/50 p-4 rounded-lg border ${card.extraContent.borderColor}`}>
                <h4 className="font-bold text-white text-sm uppercase mb-2">{card.extraContent.title}</h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                    {card.extraContent.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                            <RoyalIcon variant={item.icon} size={14} className={item.iconColor} />
                            <span>{item.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {/* Links / Sources */}
        {card.links.length > 0 && (
            <div className="pt-3 border-t border-white/10 flex flex-wrap gap-4">
                {card.links.map((link, i) => (
                    <a 
                        key={i} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-accent-primary text-sm hover:text-accent-secondary hover:underline flex items-center gap-1 transition-colors"
                    >
                        <RoyalIcon variant="externalLink" size={14} /> 
                        {link.label}
                    </a>
                ))}
            </div>
        )}
      </div>
    </Card>
  );
};

export default TimelineItem;
