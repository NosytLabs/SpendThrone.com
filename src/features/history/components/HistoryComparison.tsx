import React from 'react';
import { EntranceAnimation, RoyalIcon, Card as RoyalCard } from '@/components/ui';
import { HistoryEraData } from '@/core/data/historyPageData';
import strings from '@/locales/strings.json';

interface HistoryComparisonProps {
    showCompareMode: boolean;
    compareEras: string[];
    processedHistoryData: HistoryEraData[];
}

export const HistoryComparison: React.FC<HistoryComparisonProps> = ({
    showCompareMode,
    compareEras,
    processedHistoryData
}) => {
    if (!showCompareMode || compareEras.length !== 2) return null;

    return (
        <EntranceAnimation delay={600} type="fade-in">
            <RoyalCard className="mt-16 p-8 bg-gradient-to-br from-background-secondary to-background-tertiary border-2 border-accent-primary/30 rounded-2xl shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <RoyalIcon variant="gitCompare" size={24} className="text-accent-primary" />
                    {strings.history.compare_title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {compareEras.map(eraId => {
                        const era = processedHistoryData.find(e => e.id === eraId);
                        if (!era) return null;
                        
                        const statusTypeBreakdown = era.cards.reduce((acc, card) => {
                            acc[card.statusType] = (acc[card.statusType] || 0) + 1;
                            return acc;
                        }, {} as Record<string, number>);
                        
                        return (
                            <div key={era.id} className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <RoyalIcon variant={era.icon} size={20} className={era.iconColor} />
                                    <h4 className={`text-xl font-bold ${era.iconColor}`}>{era.title}</h4>
                                </div>
                                <p className="text-text-secondary text-sm">{era.yearRange}</p>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-text-secondary text-sm">{strings.history.total_examples}</span>
                                        <span className="text-white font-bold">{era.cards.length}</span>
                                    </div>
                                    
                                    {Object.entries(statusTypeBreakdown).map(([type, count]) => (
                                        <div key={type} className="flex justify-between items-center">
                                            <span className="text-text-secondary text-sm capitalize">{type}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 bg-background-tertiary rounded-full h-2">
                                                    <div 
                                                        className="h-2 bg-accent-primary rounded-full"
                                                        style={{ width: `${(count / era.cards.length) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-white text-sm font-medium">{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className="mt-8 pt-6 border-t border-border-primary">
                    <h4 className="text-lg font-semibold text-white mb-4">{strings.history.key_insights}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary">
                        {compareEras.map(eraId => {
                            const era = processedHistoryData.find(e => e.id === eraId);
                            if (!era) return null;
                            
                            const mostCommonType = Object.entries(
                                era.cards.reduce((acc, card) => {
                                    acc[card.statusType] = (acc[card.statusType] || 0) + 1;
                                    return acc;
                                }, {} as Record<string, number>)
                            ).sort(([,a], [,b]) => b - a)[0];
                            
                            return (
                                <div key={era.id}>
                                    <span className="font-medium text-white">{era.title}:</span> {strings.history.insight_focused}{' '}
                                    <span className="text-accent-primary font-medium capitalize">{mostCommonType?.[0]}</span>
                                    {' '}({mostCommonType?.[1]} {strings.history.insight_examples})
                                </div>
                            );
                        })}
                    </div>
                </div>
            </RoyalCard>
        </EntranceAnimation>
    );
};
