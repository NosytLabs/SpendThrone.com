import React from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { Section } from '../components/layout/Section';
import strings from '@/locales/strings.json';

import { useHistoryPage } from '@/features/history/hooks/useHistoryPage';
import { HistoryNavigation } from '@/features/history/components/HistoryNavigation';
import { HistoryFilters } from '@/features/history/components/HistoryFilters';
import { HistoryTimeline } from '@/features/history/components/HistoryTimeline';
import { HistoryComparison } from '@/features/history/components/HistoryComparison';
import { HistoryConclusion } from '@/features/history/components/HistoryConclusion';
import { HistoryFurtherReading } from '@/features/history/components/HistoryFurtherReading';

const History: React.FC = () => {
    const {
        isDegraded,
        reason,
        navigateTo,
        activeFilter,
        setActiveFilter,
        statusTypeFilter,
        setStatusTypeFilter,
        searchTerm,
        setSearchTerm,
        showJumpToEra,
        setShowJumpToEra,
        randomFact,
        generateRandomFact,
        showCompareMode,
        setShowCompareMode,
        compareEras,
        toggleEraComparison,
        eraRefs,
        scrollToEra,
        processedHistoryData,
        statistics
    } = useHistoryPage();

    return (
        <PageLayout maxWidth="full" showBackgroundEffects={true}>
            <PageHeader
                title={strings.history.page_title}
                subtitle={strings.history.page_subtitle}
                icon="history"
                variant="default"
            />

            <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <HistoryNavigation
                    showJumpToEra={showJumpToEra}
                    setShowJumpToEra={setShowJumpToEra}
                    showCompareMode={showCompareMode}
                    setShowCompareMode={setShowCompareMode}
                    generateRandomFact={generateRandomFact}
                    processedHistoryData={processedHistoryData}
                    scrollToEra={scrollToEra}
                    randomFact={randomFact}
                    statistics={statistics}
                    isDegraded={isDegraded}
                    reason={reason || null}
                />

                <HistoryFilters
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    statusTypeFilter={statusTypeFilter}
                    setStatusTypeFilter={setStatusTypeFilter}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    processedHistoryData={processedHistoryData}
                    scrollToEra={scrollToEra}
                />

                <HistoryTimeline
                    processedHistoryData={processedHistoryData}
                    activeFilter={activeFilter}
                    statusTypeFilter={statusTypeFilter}
                    searchTerm={searchTerm}
                    showCompareMode={showCompareMode}
                    compareEras={compareEras}
                    toggleEraComparison={toggleEraComparison}
                    eraRefs={eraRefs}
                />

                <HistoryComparison
                    showCompareMode={showCompareMode}
                    compareEras={compareEras}
                    processedHistoryData={processedHistoryData}
                />

                <HistoryConclusion
                    onClaim={() => navigateTo('/leaderboard')}
                />

                <HistoryFurtherReading
                    historyData={processedHistoryData}
                />
            </Section>
        </PageLayout>
    );
};

export default History;
