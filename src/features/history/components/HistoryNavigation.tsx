import React from 'react';
import { Button, RoyalIcon } from '@/components/ui';
import { HistoryCardData, HistoryEraData } from '@/core/data/historyPageData';
import strings from '@/locales/strings.json';

interface HistoryNavigationProps {
    showJumpToEra: boolean;
    setShowJumpToEra: (show: boolean) => void;
    showCompareMode: boolean;
    setShowCompareMode: (show: boolean) => void;
    generateRandomFact: () => void;
    processedHistoryData: HistoryEraData[];
    scrollToEra: (eraId: string) => void;
    randomFact: HistoryCardData | null;
    statistics: {
        totalCards: number;
        statusTypeCounts: Record<string, number>;
        eraCounts: { id: string; title: string; count: number }[];
        averageCardsPerEra: number;
    };
    isDegraded: boolean;
    reason: string | null;
}

export const HistoryNavigation: React.FC<HistoryNavigationProps> = ({
    showJumpToEra,
    setShowJumpToEra,
    showCompareMode,
    setShowCompareMode,
    generateRandomFact,
    processedHistoryData,
    scrollToEra,
    randomFact,
    statistics,
    isDegraded,
    reason
}) => {
    return (
        <div className="sticky top-0 z-40 mb-8 bg-background-primary/90 backdrop-blur-md border-b border-border-primary rounded-lg p-4 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowJumpToEra(!showJumpToEra)}
                        className="flex items-center gap-2"
                    >
                        <RoyalIcon variant="compass" size={16} />
                        {strings.history.nav_jump}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCompareMode(!showCompareMode)}
                        className="flex items-center gap-2"
                    >
                        <RoyalIcon variant="gitCompare" size={16} />
                        {strings.history.nav_compare}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateRandomFact()}
                        className="flex items-center gap-2"
                    >
                        <RoyalIcon variant="shuffle" size={16} />
                        {strings.history.nav_random}
                    </Button>
                </div>
                
                {/* Statistics Summary */}
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <RoyalIcon variant="database" size={14} className="text-text-muted" />
                        <span className="text-text-secondary">{statistics.totalCards} {strings.history.stats_examples}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <RoyalIcon variant="layers" size={14} className="text-text-muted" />
                        <span className="text-text-secondary">{processedHistoryData.length} {strings.history.stats_eras}</span>
                    </div>
                </div>
            </div>
            
            {/* Jump to Era Dropdown */}
            {showJumpToEra && (
                <div className="mt-4 p-4 bg-background-secondary/50 rounded-lg border border-border-primary">
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <RoyalIcon variant="compass" size={14} />
                        {strings.history.quick_nav_title}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {processedHistoryData.map(era => (
                            <Button
                                key={era.id}
                                variant="ghost"
                                size="sm"
                                onClick={() => scrollToEra(era.id)}
                                className="flex items-center gap-2 justify-start"
                            >
                                <RoyalIcon variant={era.icon} size={14} className={era.iconColor} />
                                <span className="text-xs">{era.title}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Random Fact Card */}
            {randomFact && (
                <div className="mt-4 p-4 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 rounded-lg border border-accent-primary/30">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                                <RoyalIcon variant="zap" size={14} className="text-accent-primary" />
                                {strings.history.random_fact_title}
                            </h4>
                            <p className="text-sm text-text-secondary mb-2">
                                <span className="font-medium text-white">{randomFact.title}</span> ({randomFact.year})
                            </p>
                            <p className="text-xs text-text-muted line-clamp-2">
                                {randomFact.description.substring(0, 120)}...
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                // Find the era containing this card and scroll to it
                                const era = processedHistoryData.find(e => e.cards.some(c => c.id === randomFact.id));
                                if (era) {
                                    scrollToEra(era.id);
                                }
                            }}
                            className="flex-shrink-0"
                        >
                            <RoyalIcon variant="arrowRight" size={14} />
                        </Button>
                    </div>
                </div>
            )}
            {isDegraded && (
                <div className="mt-4 rounded-md border border-warning/30 bg-warning/10 p-3 text-sm text-warning text-center">
                    <div className="flex items-center justify-center gap-2">
                        <RoyalIcon variant="warning" size={16} />
                        <span>{strings.history.degraded_msg} {reason}</span>
                    </div>
                </div>
            )}
        </div>
    );
};
