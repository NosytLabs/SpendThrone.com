import React, { useState } from 'react';
import { useAppNavigation } from '@/shared/utils/navigation';
import { RoyalIcon, RoyalIconProps } from '../components/ui';
import { PageLayout } from '../components/layout/PageLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { Section } from '../components/layout/Section';
import { Card } from '../components/ui/Card';
import { EntranceAnimation } from '../components/ui/AnimationUtilities';
import { Button } from '../components/ui/Button';
import { TimelineItem } from '../features/history/TimelineItem';
import { historyPageData } from '@/core/data/historyPageData';
import { useDegradedMode } from '@/shared/hooks/useDegradedMode';

const History: React.FC = () => {
    const { navigateTo } = useAppNavigation();
    const { isDegraded, reason } = useDegradedMode();
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [statusTypeFilter, setStatusTypeFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const filterOptions: { id: string; label: string; icon: RoyalIconProps['variant'] }[] = [
        { id: 'all', label: 'All Eras', icon: 'history' },
        { id: 'ancient', label: 'Ancient World', icon: 'pyramid' },
        { id: 'medieval', label: 'Medieval & Renaissance', icon: 'swords' },
        { id: 'modern', label: 'Industrial & Modern', icon: 'rocket' },
        { id: 'future', label: 'Digital Age', icon: 'zap' }
    ];

    const statusTypeOptions: { id: string; label: string; icon: RoyalIconProps['variant'] }[] = [
        { id: 'all', label: 'All Types', icon: 'list' },
        { id: 'architecture', label: 'Architecture', icon: 'building' },
        { id: 'luxury', label: 'Luxury Goods', icon: 'diamond' },
        { id: 'events', label: 'Events/Games', icon: 'calendar' },
        { id: 'art', label: 'Art/Culture', icon: 'palette' },
        { id: 'technology', label: 'Technology', icon: 'cpu' }
    ];

    return (
        <PageLayout maxWidth="full" showBackgroundEffects={true}>
            <PageHeader
                title="The History of Status"
                subtitle="A timeline of how humans have burned resources to signal power."
                icon="history"
                variant="default"
            />

            <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {isDegraded && (
                    <div className="mb-6 rounded-md border border-warning/30 bg-warning/10 p-3 text-sm text-warning text-center">
                        <div className="flex items-center justify-center gap-2">
                            <RoyalIcon variant="warning" size={16} />
                            <span>Live transaction history is temporarily unavailable. {reason}</span>
                        </div>
                    </div>
                )}
                {/* FILTER SECTION */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-white mb-8 text-center royal-text-title">Explore Status Through History</h3>
                    
                    {/* Search Bar */}
                    <div className="max-w-md mx-auto mb-8">
                        <div className="relative">
                            <input
                                type="text"
                                aria-label="Search historical examples"
                                placeholder="Search historical examples..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 pl-10 bg-background-secondary border border-border-primary rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary transition-all duration-300 shadow-inner"
                            />
                            <RoyalIcon variant="search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mb-6">
                        {filterOptions.map((option) => (
                            <Button
                                key={option.id}
                                variant={activeFilter === option.id ? 'primary' : 'secondary'}
                                size="sm"
                                onClick={() => setActiveFilter(option.id)}
                                className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
                            >
                                <RoyalIcon variant={option.icon} size={16} />
                                {option.label}
                            </Button>
                        ))}
                    </div>
                    
                    {/* Status Type Filter */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-white mb-4 text-center">Filter by Status Type</h4>
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
                            {activeFilter === 'all' && 'Showing all eras'}
                            {activeFilter === 'ancient' && 'Ancient World (3000 BC - 500 AD)'}
                            {activeFilter === 'medieval' && 'Medieval & Renaissance (500 - 1800)'}
                            {activeFilter === 'modern' && 'Industrial & Modern (1800 - Present)'}
                            {activeFilter === 'future' && 'Digital Age (2000 - Future)'}
                            {' • '}
                            {statusTypeFilter === 'all' && 'all status types'}
                            {statusTypeFilter === 'architecture' && 'architectural displays'}
                            {statusTypeFilter === 'luxury' && 'luxury goods'}
                            {statusTypeFilter === 'events' && 'events & games'}
                            {statusTypeFilter === 'art' && 'art & culture'}
                            {statusTypeFilter === 'technology' && 'technological status'}
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
                                Clear filters
                            </Button>
                        )}
                    </div>
                </div>

                {/* THE TIMELINE */}
                <div className="relative max-w-5xl mx-auto pl-4 md:pl-0">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-secondary via-accent-primary to-accent-secondary hidden md:block"></div>
                    {/* Mobile Timeline Line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-secondary via-accent-primary to-accent-secondary md:hidden"></div>

                    {historyPageData.map((era, index) => {
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
                                <div className="relative mb-20">
                                    {/* Timeline Icon - Absolute on Desktop */}
                                    <div className="hidden md:flex absolute left-8 transform -translate-x-1/2 items-center justify-center z-10">
                                        <div className={`w-16 h-16 rounded-full bg-background-primary border-4 border-${era.colorClass.replace('text-', '')} flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]`}>
                                            <RoyalIcon variant={era.icon} size={32} className={era.iconColor} />
                                        </div>
                                    </div>

                                    {/* Content Wrapper */}
                                    <div className="md:ml-24">
                                        {/* Mobile Header (Icon + Title) */}
                                        <div className="flex items-center gap-4 mb-6 md:hidden relative">
                                            <div className={`w-12 h-12 rounded-full bg-background-primary border-2 border-${era.colorClass.replace('text-', '')} flex items-center justify-center shadow-lg flex-shrink-0 z-10`}>
                                                <RoyalIcon variant={era.icon} size={24} className={era.iconColor} />
                                            </div>
                                            <h2 className={`text-xl font-bold ${era.iconColor}`}>{era.dateRange}</h2>
                                        </div>

                                        {/* Desktop Header */}
                                        <div className="hidden md:block mb-6">
                                            <h2 className={`royal-text-title bg-clip-text text-transparent bg-gradient-to-r from-white to-${era.colorClass.replace('text-', '')} text-4xl`}>{era.title}</h2>
                                            <span className={`${era.iconColor} font-mono text-lg`}>{era.dateRange}</span>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {filteredCards.map(card => (
                                                <TimelineItem key={card.id} card={card} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </EntranceAnimation>
                        );
                    })}

                    {/* CONCLUSION */}
                    <EntranceAnimation delay={500} type="fade-in">
                        <Card className="mt-12 p-6 md:p-12 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-2xl border-4 border-yellow-300 text-center shadow-[0_0_40px_rgba(234,179,8,0.4)]">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-black mb-6 drop-shadow-md">
                                The Pattern is Clear
                            </h2>
                            <div className="max-w-4xl mx-auto space-y-6 text-black text-base md:text-lg font-medium">
                                <p>
                                    For <strong>5,000 years</strong>, humans have burned resources to signal status.
                                </p>
                                <p className="flex flex-wrap justify-center gap-3 items-center text-xl font-bold">
                                    <span>Pyramids</span> <RoyalIcon variant="arrowDown" size={20} className="rotate-[-90deg]" /> <span>Versailles</span> <RoyalIcon variant="arrowDown" size={20} className="rotate-[-90deg]" /> <span>Yachts</span> <RoyalIcon variant="arrowDown" size={20} className="rotate-[-90deg]" /> <span>NFTs</span> <RoyalIcon variant="arrowDown" size={20} className="rotate-[-90deg]" /> <span className="text-2xl md:text-3xl text-white drop-shadow-lg">SpendThrone</span>
                                </p>
                                <p className="text-lg md:text-xl italic opacity-90">
                                    We&apos;ve just made it efficient, transparent, and immutable.
                                </p>
                            </div>
                            <button
                                onClick={() => navigateTo('/leaderboard')}
                                className="mt-10 px-10 py-5 bg-black text-white rounded-xl font-bold text-xl hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-black/50 flex items-center gap-3 mx-auto border-2 border-yellow-400/30"
                            >
                                <RoyalIcon variant="crown" size={28} className="text-yellow-500" />
                                Claim Your Place in History
                            </button>
                        </Card>
                    </EntranceAnimation>

                    {/* FURTHER READING & SOURCES */}
                    <div className="mt-24 border-t border-border-primary pt-12">
                        <h3 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center gap-2">
                            <RoyalIcon variant="book" className="text-accent-secondary" />
                            Further Reading
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <a href="https://en.wikipedia.org/wiki/The_Theory_of_the_Leisure_Class" target="_blank" rel="noopener noreferrer" className="group">
                                <Card variant="glass" className="p-6 h-full hover:border-accent-primary/50 transition-colors">
                                    <h4 className="font-bold text-lg text-white mb-2 group-hover:text-accent-primary transition-colors">The Theory of the Leisure Class</h4>
                                    <p className="text-sm text-text-secondary italic mb-2">Thorstein Veblen (1899)</p>
                                    <p className="text-sm text-text-secondary">The foundational text on &quot;Conspicuous Consumption&quot; and why we buy things we don&apos;t need.</p>
                                </Card>
                            </a>
                            <a href="https://en.wikipedia.org/wiki/Status_Anxiety" target="_blank" rel="noopener noreferrer" className="group">
                                <Card variant="glass" className="p-6 h-full hover:border-accent-primary/50 transition-colors">
                                    <h4 className="font-bold text-lg text-white mb-2 group-hover:text-accent-primary transition-colors">Status Anxiety</h4>
                                    <p className="text-sm text-text-secondary italic mb-2">Alain de Botton (2004)</p>
                                    <p className="text-sm text-text-secondary">An exploration of why we care so much about what others think of us and our standing.</p>
                                </Card>
                            </a>
                            <a href="https://en.wikipedia.org/wiki/Signalling_theory" target="_blank" rel="noopener noreferrer" className="group">
                                <Card variant="glass" className="p-6 h-full hover:border-accent-primary/50 transition-colors">
                                    <h4 className="font-bold text-lg text-white mb-2 group-hover:text-accent-primary transition-colors">Signaling Theory</h4>
                                    <p className="text-sm text-text-secondary italic mb-2">Evolutionary Biology</p>
                                    <p className="text-sm text-text-secondary">The science behind why peacocks have tails and humans buy luxury cars: Costly Signaling.</p>
                                </Card>
                            </a>
                            <a href="https://www.amazon.com/Status-Game-On-Business-Life/dp/0008350640" target="_blank" rel="noopener noreferrer" className="group">
                                <Card variant="glass" className="p-6 h-full hover:border-accent-primary/50 transition-colors">
                                    <h4 className="font-bold text-lg text-white mb-2 group-hover:text-accent-primary transition-colors">The Status Game</h4>
                                    <p className="text-sm text-text-secondary italic mb-2">Will Storr (2021)</p>
                                    <p className="text-sm text-text-secondary">A deep dive into how our desire for status drives everything we do, from religion to social media.</p>
                                </Card>
                            </a>
                            <a href="https://en.wikipedia.org/wiki/Veblen_good" target="_blank" rel="noopener noreferrer" className="group">
                                <Card variant="glass" className="p-6 h-full hover:border-accent-primary/50 transition-colors">
                                    <h4 className="font-bold text-lg text-white mb-2 group-hover:text-accent-primary transition-colors">Veblen Goods</h4>
                                    <p className="text-sm text-text-secondary italic mb-2">Economic Concept</p>
                                    <p className="text-sm text-text-secondary">Goods for which demand increases as the price increases, because of their exclusive nature and status appeal.</p>
                                </Card>
                            </a>
                            <a href="https://www.investopedia.com/terms/p/posh-goods.asp" target="_blank" rel="noopener noreferrer" className="group">
                                <Card variant="glass" className="p-6 h-full hover:border-accent-primary/50 transition-colors">
                                    <h4 className="font-bold text-lg text-white mb-2 group-hover:text-accent-primary transition-colors">Positional Goods</h4>
                                    <p className="text-sm text-text-secondary italic mb-2">Fred Hirsch (1976)</p>
                                    <p className="text-sm text-text-secondary">Things that are valuable specifically because they are scarce and others cannot have them.</p>
                                </Card>
                            </a>
                        </div>

                        {/* Detailed Sources List */}
                        <div className="bg-background-tertiary/30 rounded-xl p-6 border border-border-primary">
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <RoyalIcon variant="list" size={16} />
                                Detailed Source Index
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {historyPageData.flatMap(era => 
                                    era.cards.map(card => (
                                        <div key={card.id} className="mb-2">
                                            <p className="text-xs font-bold text-text-secondary mb-1 truncate">{card.title}</p>
                                            <div className="flex flex-col gap-1">
                                                {card.links.map((link, i) => (
                                                    <a 
                                                        key={i} 
                                                        href={link.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="text-accent-primary text-xs hover:underline truncate flex items-center gap-1"
                                                    >
                                                        <RoyalIcon variant="externalLink" size={10} /> {link.label}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sources Footer */}
                    <div className="mt-16 text-center border-t border-border-primary/50 pt-8">
                        <p className="text-text-secondary text-xs opacity-70">
                            Historical data curated from Encyclopedia Britannica, The Metropolitan Museum of Art, and academic journals. 
                            <br />
                            Images and iconography are stylized representations.
                        </p>
                    </div>
                </div>
            </Section>
        </PageLayout>
    );
};

export default History;
