import React from 'react';
import { Button, RoyalIcon, RoyalIconProps } from '@/components/ui';
import { VisualTimeline } from '@/features/history/VisualTimeline';
import { HistoryEraData } from '@/core/data/historyPageData';
import strings from '@/locales/strings.json';

interface HistoryFiltersProps {
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
    statusTypeFilter: string;
    setStatusTypeFilter: (filter: string) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    processedHistoryData: HistoryEraData[];
    scrollToEra: (eraId: string) => void;
}

export const HistoryFilters: React.FC<HistoryFiltersProps> = ({
    activeFilter,
    setActiveFilter,
    statusTypeFilter,
    setStatusTypeFilter,
    searchTerm,
    setSearchTerm,
    processedHistoryData,
    scrollToEra
}) => {
    const filterOptions: { id: string; label: string; icon: RoyalIconProps['variant'] }[] = [
        { id: 'all', label: strings.history.filter_all_eras, icon: 'history' },
        { id: 'ancient', label: strings.history.filter_ancient, icon: 'pyramid' },
        { id: 'medieval', label: strings.history.filter_medieval, icon: 'swords' },
        { id: 'modern', label: strings.history.filter_modern, icon: 'rocket' },
        { id: 'future', label: strings.history.filter_future, icon: 'zap' }
    ];

    const statusTypeOptions: { id: string; label: string; icon: RoyalIconProps['variant'] }[] = [
        { id: 'all', label: strings.history.filter_all_types, icon: 'list' },
        { id: 'architecture', label: strings.history.filter_architecture, icon: 'building' },
        { id: 'luxury', label: strings.history.filter_luxury, icon: 'diamond' },
        { id: 'events', label: strings.history.filter_events, icon: 'calendar' },
        { id: 'art', label: strings.history.filter_art, icon: 'palette' },
        { id: 'technology', label: strings.history.filter_technology, icon: 'cpu' }
    ];

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-8 text-center royal-text-title">{strings.history.explore_title}</h2>
            
            {/* New Visual Timeline */}
            <VisualTimeline 
                eras={processedHistoryData} 
                onEraSelect={scrollToEra} 
            />

            {/* Enhanced Search Bar with live results count */}
            <div className="relative max-w-2xl mx-auto mb-12">
                <div className="relative">
                    <input
                        type="text"
                        aria-label="Search historical examples"
                        placeholder={strings.history.search_placeholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 pl-10 pr-10 bg-background-secondary/80 backdrop-blur-sm border border-border-primary rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/50 transition-all duration-300 shadow-inner"
                    />
                    <RoyalIcon variant="search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                            aria-label="Clear search"
                        >
                            <RoyalIcon variant="close" size={16} />
                        </button>
                    )}
                </div>
                {searchTerm && (
                    <div className="mt-2 text-center">
                        <span className="text-sm text-text-secondary">
                            {strings.history.searching_for} &quot;<span className="text-accent-primary font-medium">{searchTerm}</span>&quot;
                        </span>
                    </div>
                )}
            </div>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
                {filterOptions.map((option) => (
                    <Button
                        key={option.id}
                        variant={activeFilter === option.id ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setActiveFilter(option.id)}
                        className={`flex items-center gap-2 transition-all duration-200 hover:scale-105 ${
                            activeFilter === option.id 
                                ? 'shadow-lg shadow-accent-primary/30 ring-2 ring-accent-primary/50' 
                                : 'hover:border-accent-primary/50'
                        }`}
                    >
                        <RoyalIcon variant={option.icon} size={16} />
                        {option.label}
                        {activeFilter === option.id && (
                            <span className="ml-1 w-2 h-2 bg-accent-secondary rounded-full animate-pulse"></span>
                        )}
                    </Button>
                ))}
            </div>
            
            {/* Status Type Filter */}
            <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-4 text-center">{strings.history.filter_status_title}</h4>
                <div className="flex flex-wrap justify-center gap-3 mb-4">
                    {statusTypeOptions.map((option) => (
                        <Button
                            key={option.id}
                            variant={statusTypeFilter === option.id ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setStatusTypeFilter(option.id)}
                            className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
                        >
                            <RoyalIcon variant={option.icon} size={16} />
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>
            
            <div className="text-center">
                <p className="text-text-secondary text-sm mb-2">
                    {activeFilter === 'all' && strings.history.showing_all_eras}
                    {activeFilter === 'ancient' && strings.history.era_ancient}
                    {activeFilter === 'medieval' && strings.history.era_medieval}
                    {activeFilter === 'modern' && strings.history.era_modern}
                    {activeFilter === 'future' && strings.history.era_future}
                    {' • '}
                    {statusTypeFilter === 'all' && strings.history.type_all}
                    {statusTypeFilter === 'architecture' && strings.history.type_architecture}
                    {statusTypeFilter === 'luxury' && strings.history.type_luxury}
                    {statusTypeFilter === 'events' && strings.history.type_events}
                    {statusTypeFilter === 'art' && strings.history.type_art}
                    {statusTypeFilter === 'technology' && strings.history.type_technology}
                </p>
                {(activeFilter !== 'all' || statusTypeFilter !== 'all') && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setActiveFilter('all');
                            setStatusTypeFilter('all');
                        }}
                        className="text-accent-primary hover:text-accent-secondary"
                    >
                        <RoyalIcon variant="rotateCcw" size={14} className="mr-1" />
                        {strings.history.clear_filters}
                    </Button>
                )}
            </div>
        </div>
    );
};
