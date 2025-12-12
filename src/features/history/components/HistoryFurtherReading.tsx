import React from 'react';
import { RoyalIcon, Card as RoyalCard } from '@/components/ui';
import { HistoryEraData } from '@/core/data/historyPageData';
import strings from '@/locales/strings.json';

interface HistoryFurtherReadingProps {
    historyData: HistoryEraData[];
}

export const HistoryFurtherReading: React.FC<HistoryFurtherReadingProps> = ({ historyData }) => {
    return (
        <div className="mt-24 border-t border-border-primary pt-12">
            <h3 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center gap-2">
                <RoyalIcon variant="book" className="text-accent-secondary" />
                {strings.history.further_reading}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <a href="https://en.wikipedia.org/wiki/The_Theory_of_the_Leisure_Class" target="_blank" rel="noopener noreferrer" className="group">
                    <RoyalCard variant="glass" className="p-6 h-full hover:border-accent-primary/50 transition-colors">
                        <h4 className="font-bold text-lg text-white mb-2 group-hover:text-accent-primary transition-colors">The Theory of the Leisure Class</h4>
                        <p className="text-sm text-text-secondary italic mb-2">Thorstein Veblen (1899)</p>
                        <p className="text-sm text-text-secondary">The foundational text on &quot;Conspicuous Consumption&quot; and why we buy things we don&apos;t need.</p>
                    </RoyalCard>
                </a>
                <a href="https://en.wikipedia.org/wiki/Status_Anxiety" target="_blank" rel="noopener noreferrer" className="group">
                    <RoyalCard variant="glass" className="p-6 h-full hover:border-accent-primary/50 transition-colors">
                        <h4 className="font-bold text-lg text-white mb-2 group-hover:text-accent-primary transition-colors">Status Anxiety</h4>
                        <p className="text-sm text-text-secondary italic mb-2">Alain de Botton (2004)</p>
                        <p className="text-sm text-text-secondary">An exploration of why we care so much about what others think of us and our standing.</p>
                    </RoyalCard>
                </a>
                <a href="https://en.wikipedia.org/wiki/Signalling_theory" target="_blank" rel="noopener noreferrer" className="group">
                    <RoyalCard variant="glass" className="p-6 h-full hover:border-accent-primary/50 transition-colors">
                        <h4 className="font-bold text-lg text-white mb-2 group-hover:text-accent-primary transition-colors">Signaling Theory</h4>
                        <p className="text-sm text-text-secondary italic mb-2">Evolutionary Biology</p>
                        <p className="text-sm text-text-secondary">The science behind why peacocks have tails and humans buy luxury cars: Costly Signaling.</p>
                    </RoyalCard>
                </a>
                <a href="https://www.amazon.com/Status-Game-On-Business-Life/dp/0008350640" target="_blank" rel="noopener noreferrer" className="group">
                    <RoyalCard variant="glass" className="p-6 h-full hover:border-accent-primary/50 transition-colors">
                        <h4 className="font-bold text-lg text-white mb-2 group-hover:text-accent-primary transition-colors">The Status Game</h4>
                        <p className="text-sm text-text-secondary italic mb-2">Will Storr (2021)</p>
                        <p className="text-sm text-text-secondary">A deep dive into how our desire for status drives everything we do, from religion to social media.</p>
                    </RoyalCard>
                </a>
                <a href="https://en.wikipedia.org/wiki/Veblen_good" target="_blank" rel="noopener noreferrer" className="group">
                    <RoyalCard variant="glass" className="p-6 h-full hover:border-accent-primary/50 transition-colors">
                        <h4 className="font-bold text-lg text-white mb-2 group-hover:text-accent-primary transition-colors">Veblen Goods</h4>
                        <p className="text-sm text-text-secondary italic mb-2">Economic Concept</p>
                        <p className="text-sm text-text-secondary">Goods for which demand increases as the price increases, because of their exclusive nature and status appeal.</p>
                    </RoyalCard>
                </a>
                <a href="https://www.investopedia.com/terms/p/posh-goods.asp" target="_blank" rel="noopener noreferrer" className="group">
                    <RoyalCard variant="glass" className="p-6 h-full hover:border-accent-primary/50 transition-colors">
                        <h4 className="font-bold text-lg text-white mb-2 group-hover:text-accent-primary transition-colors">Positional Goods</h4>
                        <p className="text-sm text-text-secondary italic mb-2">Fred Hirsch (1976)</p>
                        <p className="text-sm text-text-secondary">Things that are valuable specifically because they are scarce and others cannot have them.</p>
                    </RoyalCard>
                </a>
            </div>

            {/* Detailed Sources List */}
            <div className="bg-background-tertiary/30 rounded-xl p-6 border border-border-primary">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <RoyalIcon variant="list" size={16} />
                    {strings.history.source_index}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {historyData.flatMap(era => 
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
    );
};
