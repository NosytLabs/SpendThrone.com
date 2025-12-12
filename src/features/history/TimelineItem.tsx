import React from 'react';
import { HistoryCard } from './HistoryCard';
import { HistoryCardData } from '@/core/data/historyPageData';

interface TimelineItemProps {
  card: HistoryCardData;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ card }) => {
  return (
    <div className="w-full mb-8">
      <HistoryCard card={card} />
    </div>
  );
};

export default TimelineItem;
