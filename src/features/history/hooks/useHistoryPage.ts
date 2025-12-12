import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { historyPageData, HistoryCardData, HistoryEraData } from '@/core/data/historyPageData';
import { useAppNavigation } from '@/shared/utils/navigation';
import { useDegradedMode } from '@/shared/hooks/useDegradedMode';

// Helper function to parse year string and convert to a number for sorting
const parseYear = (yearStr: string): number => {
  const trimmed = yearStr.trim();
  if (trimmed.includes('BC')) {
    const year = parseInt(trimmed.replace(/[^\d]/g, ''), 10);
    return -year; // BC years are negative for chronological sorting
  } else if (trimmed.includes('AD')) {
    const year = parseInt(trimmed.replace(/[^\d]/g, ''), 10);
    return year; // AD years are positive
  } else {
    // If no BC/AD marker, assume AD
    return parseInt(trimmed.replace(/[^\d]/g, ''), 10);
  }
};

// Helper function to remove duplicate cards based on title and ID
const removeDuplicates = (cards: HistoryCardData[]): HistoryCardData[] => {
  const seenTitles = new Set<string>();
  const seenIds = new Set<string>();
  
  return cards.filter(card => {
    // Check ID
    if (seenIds.has(card.id)) return false;
    seenIds.add(card.id);

    // Normalize title for comparison (lowercase, remove extra spaces)
    const normalizedTitle = card.title.toLowerCase().trim().replace(/\s+/g, ' ');
    if (seenTitles.has(normalizedTitle)) {
      return false; // Skip duplicate
    }
    seenTitles.add(normalizedTitle);
    return true;
  });
};

// Process history data to sort cards chronologically and remove duplicates
const processHistoryData = (data: HistoryEraData[]): HistoryEraData[] => {
  return data.map(era => ({
    ...era,
    cards: removeDuplicates(
      era.cards.sort((a, b) => parseYear(a.year) - parseYear(b.year))
    )
  }));
};

export const useHistoryPage = () => {
    const { navigateTo } = useAppNavigation();
    const { isDegraded, reason } = useDegradedMode();
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize state from URL params
    const [activeFilter, setActiveFilter] = useState<string>(searchParams.get('filter') || 'all');
    const [statusTypeFilter, setStatusTypeFilter] = useState<string>(searchParams.get('type') || 'all');
    const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('search') || '');

    const [showJumpToEra, setShowJumpToEra] = useState<boolean>(false);
    const [randomFact, setRandomFact] = useState<HistoryCardData | null>(null);
    const [showCompareMode, setShowCompareMode] = useState<boolean>(false);
    const [compareEras, setCompareEras] = useState<string[]>([]);
    const eraRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    
    // Sync state to URL
    useEffect(() => {
        const params: Record<string, string> = {};
        if (activeFilter !== 'all') params.filter = activeFilter;
        if (statusTypeFilter !== 'all') params.type = statusTypeFilter;
        if (searchTerm) params.search = searchTerm;
        setSearchParams(params, { replace: true });
    }, [activeFilter, statusTypeFilter, searchTerm, setSearchParams]);
    
    // Process history data to sort chronologically and remove duplicates
    const processedHistoryData = useMemo(() => processHistoryData(historyPageData.eras), []);
    
    // Get all cards for random fact feature
    const allCards = useMemo(() => 
        processedHistoryData.reduce((acc, era) => [...acc, ...era.cards], [] as HistoryCardData[]),
        [processedHistoryData]
    );
    
    // Generate random fact on component mount and when requested
    const generateRandomFact = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * allCards.length);
        setRandomFact(allCards[randomIndex]);
    }, [allCards]);
    
    // Initialize random fact on mount
    useEffect(() => {
        generateRandomFact();
    }, [generateRandomFact]);
    
    // Smooth scroll to era
    const scrollToEra = (eraId: string) => {
        eraRefs.current[eraId]?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        setShowJumpToEra(false);
    };
    
    // Toggle era comparison
    const toggleEraComparison = (eraId: string) => {
        setCompareEras(prev => 
            prev.includes(eraId) 
                ? prev.filter(id => id !== eraId)
                : [...prev, eraId].slice(0, 2) // Max 2 eras for comparison
        );
    };
    
    // Calculate statistics
    const statistics = useMemo(() => {
        const totalCards = allCards.length;
        const statusTypeCounts = allCards.reduce((acc, card) => {
            acc[card.statusType] = (acc[card.statusType] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        const eraCounts = processedHistoryData.map(era => ({
            id: era.id,
            title: era.title,
            count: era.cards.length
        }));
        
        return {
            totalCards,
            statusTypeCounts,
            eraCounts,
            averageCardsPerEra: Math.round(totalCards / processedHistoryData.length)
        };
    }, [allCards, processedHistoryData]);

    return {
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
    };
};
