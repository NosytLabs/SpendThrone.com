import React from 'react';
import { Button, RoyalIcon, EntranceAnimation, Card as RoyalCard } from '@/components/ui';
import strings from '@/locales/strings.json';

interface HistoryConclusionProps {
    onClaim: () => void;
}

export const HistoryConclusion: React.FC<HistoryConclusionProps> = ({ onClaim }) => {
    return (
        <EntranceAnimation delay={500} type="fade-in">
            <RoyalCard className="mt-12 p-6 md:p-12 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-2xl border-4 border-yellow-300 text-center shadow-[0_0_40px_rgba(234,179,8,0.4)] relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                 <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-extrabold text-black mb-6 drop-shadow-md font-cinzel">
                    {strings.history.conclusion_title}
                </h2>
                <div className="max-w-4xl mx-auto space-y-6 text-black text-base md:text-lg font-medium">
                    <p>
                        {strings.history.conclusion_text_1}
                    </p>
                    <p className="flex flex-wrap justify-center gap-3 items-center text-xl font-bold">
                        <span>Pyramids</span> <RoyalIcon variant="arrowDown" size={20} className="rotate-[-90deg]" /> <span>Versailles</span> <RoyalIcon variant="arrowDown" size={20} className="rotate-[-90deg]" /> <span>Yachts</span> <RoyalIcon variant="arrowDown" size={20} className="rotate-[-90deg]" /> <span>NFTs</span> <RoyalIcon variant="arrowDown" size={20} className="rotate-[-90deg]" /> <span className="text-2xl md:text-3xl text-white drop-shadow-lg font-cinzel">SpendThrone</span>
                    </p>
                    <p className="text-lg md:text-xl italic opacity-90">
                        {strings.history.conclusion_text_2}
                    </p>
                </div>
                <Button
                    onClick={onClaim}
                    className="mt-10 px-10 py-5 bg-black text-accent-primary rounded-xl font-bold text-xl hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-black/50 flex items-center gap-3 mx-auto border-2 border-yellow-400/30 font-cinzel h-auto"
                >
                    <RoyalIcon variant="crown" size={28} className="text-yellow-500" />
                    {strings.history.cta_claim}
                </Button>
                </div>
            </RoyalCard>
        </EntranceAnimation>
    );
};
