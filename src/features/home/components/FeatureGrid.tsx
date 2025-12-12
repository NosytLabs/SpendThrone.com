import React from 'react';
import { RoyalIcon } from '@/components/ui';

export const FeatureGrid: React.FC = () => {
    return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="royal-glass p-6 rounded-xl royal-border-glow royal-hover-scale transition-all duration-300 group">
                <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <RoyalIcon variant="trophy" size={24} className="text-accent-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 royal-heading">Compete</h3>
                <p className="text-text-secondary">Battle for the top spot in a transparent, immutable display of wealth.</p>
            </div>
            <div className="royal-glass p-6 rounded-xl royal-border-glow royal-hover-scale transition-all duration-300 group">
                <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <RoyalIcon variant="scroll" size={24} className="text-accent-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 royal-heading">History</h3>
                <p className="text-text-secondary">Join the ranks of historical figures who burned resources for status.</p>
            </div>
            <div className="royal-glass p-6 rounded-xl royal-border-glow royal-hover-scale transition-all duration-300 group">
                <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <RoyalIcon variant="shield" size={24} className="text-accent-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 royal-heading">Immutable</h3>
                <p className="text-text-secondary">Powered by Solana. Fast, secure, and forever etched on the blockchain.</p>
            </div>
        </div>
    );
};
