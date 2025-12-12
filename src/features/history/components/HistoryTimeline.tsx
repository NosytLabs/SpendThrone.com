import React from 'react';
import { Button, RoyalIcon, EntranceAnimation } from '@/components/ui';
import { TimelineItem } from '@/features/history/TimelineItem';
import { HistoryEraData } from '@/core/data/historyPageData';

interface HistoryTimelineProps {
    processedHistoryData: HistoryEraData[];
    activeFilter: string;
    statusTypeFilter: string;
    searchTerm: string;
    showCompareMode: boolean;
    compareEras: string[];
    toggleEraComparison: (eraId: string) => void;
    eraRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({
    processedHistoryData,
    activeFilter,
    statusTypeFilter,
    searchTerm,
    showCompareMode,
    compareEras,
    toggleEraComparison,
    eraRefs
}) => {
    return (
        <div className="relative max-w-6xl mx-auto pl-4 md:pl-0">
            {/* Enhanced Vertical Timeline Line with glow effect */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-secondary via-accent-primary to-accent-secondary hidden md:block shadow-[0_0_10px_rgba(255,215,0,0.3)]"></div>
            <div className="absolute left-8 top-0 bottom-0 w-3 bg-gradient-to-b from-transparent via-accent-primary/20 to-transparent hidden md:block blur-sm"></div>
            {/* Mobile Timeline Line - Aligned to center of icons (pl-4 + w-12/2 = 1rem + 1.5rem = 2.5rem = left-10) */}
            <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-secondary via-accent-primary to-accent-secondary md:hidden shadow-[0_0_6px_rgba(255,215,0,0.2)]"></div>

            {processedHistoryData.map((era, index) => {
                if (activeFilter !== 'all' && activeFilter !== era.id) return null;

                const filteredCards = era.cards.filter(card => {
                    const matchesStatus = statusTypeFilter === 'all' || card.statusType === statusTypeFilter;
                    const matchesSearch = searchTerm === '' || 
                        card.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        card.description.toLowerCase().includes(searchTerm.toLowerCase());
                    return matchesStatus && matchesSearch;
                });

                if (filteredCards.length === 0) return null;

                return (
                <EntranceAnimation key={era.id} delay={100 * (index + 1)} type="slide-right" className="transition-all duration-500">
                    <div 
                        ref={el => {
                            if (eraRefs.current) {
                                eraRefs.current[era.id] = el;
                            }
                        }}
                        className="relative mb-24"
                    >
                            {/* Enhanced Timeline Icon with pulsing effect */}
                            <div className="hidden md:flex absolute left-8 transform -translate-x-1/2 items-center justify-center z-10">
                                <div className={`w-16 h-16 rounded-full bg-background-primary border-4 border-${era.colorClass.replace('text-', '')} flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.4)] animate-pulse`}>
                                    <RoyalIcon variant={era.icon} size={32} className={era.iconColor} />
                                </div>
                                {/* Glow ring around timeline icon */}
                                <div className={`absolute inset-0 w-16 h-16 rounded-full border-2 border-${era.colorClass.replace('text-', '')} animate-ping opacity-30`}></div>
                            </div>

                            {/* Content Wrapper */}
                            <div className="md:ml-24">
                                {/* Enhanced Mobile Header (Icon + Title) */}
                                <div className="flex items-center gap-4 mb-8 md:hidden relative">
                                    <div className={`w-12 h-12 rounded-full bg-background-primary border-2 border-${era.colorClass.replace('text-', '')} flex items-center justify-center shadow-lg flex-shrink-0 z-10 animate-pulse`}>
                                        <RoyalIcon variant={era.icon} size={24} className={era.iconColor} />
                                    </div>
                                    <div>
                                        <h2 className={`text-xl font-bold ${era.iconColor}`}>{era.title}</h2>
                                        <span className={`${era.iconColor} font-mono text-sm opacity-80`}>{era.yearRange}</span>
                                    </div>
                                </div>

                                {/* Enhanced Desktop Header with gradient background */}
                                <div className="hidden md:block mb-8 relative">
                                    <div className={`absolute inset-0 bg-gradient-to-r from-${era.colorClass.replace('text-', '')}/10 to-transparent rounded-lg blur-xl`}></div>
                                    <div className="relative flex items-start justify-between">
                                        <div>
                                            <h2 className={`royal-text-title bg-clip-text text-transparent bg-gradient-to-r from-white to-${era.colorClass.replace('text-', '')} text-4xl mb-2`}>{era.title}</h2>
                                            <span className={`${era.iconColor} font-mono text-lg inline-flex items-center gap-2`}>
                                                <RoyalIcon variant="calendar" size={16} />
                                                {era.yearRange}
                                            </span>
                                        </div>
                                        {showCompareMode && (
                                            <Button
                                                variant={compareEras.includes(era.id) ? "primary" : "outline"}
                                                size="sm"
                                                onClick={() => toggleEraComparison(era.id)}
                                                className="flex items-center gap-2"
                                            >
                                                <RoyalIcon variant="gitCompare" size={14} />
                                                {compareEras.includes(era.id) ? "Selected" : "Compare"}
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Enhanced Card Grid with better spacing */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {filteredCards.map((card, cardIndex) => (
                                        <div key={card.id} className="relative">
                                            {/* Connector line from timeline to card on desktop - connects to ml-24 (6rem) from left-8 (2rem) = 4rem gap */}
                                            <div className="hidden lg:block absolute -left-16 top-8 w-16 h-0.5 bg-gradient-to-r from-accent-primary to-transparent opacity-50"></div>
                                            <EntranceAnimation 
                                                delay={100 * (index + 1) + cardIndex * 50} 
                                                type="slide-up" 
                                                className="h-full"
                                            >
                                                <TimelineItem card={card} />
                                            </EntranceAnimation>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </EntranceAnimation>
                );
            })}
        </div>
    );
};
