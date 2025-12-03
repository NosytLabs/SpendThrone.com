import React, { useState, useEffect, useMemo } from 'react';
import { RoyalIcon, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Skeleton } from '@/components/ui';

interface TokenInfo {
    address: string;
    symbol: string;
    name: string;
    logoURI?: string;
    decimals: number;
}

interface TokenSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (token: TokenInfo) => void;
    tokens: TokenInfo[];
    isLoading?: boolean;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({ isOpen, onClose, onSelect, tokens, isLoading }) => {
    const [search, setSearch] = useState('');
    const [displayLimit, setDisplayLimit] = useState(20);

    // Reset display limit when search changes
    useEffect(() => {
        setDisplayLimit(20);
    }, [search]);

    const filteredTokens = useMemo(() => {
        if (!search) return tokens;
        const lower = search.toLowerCase();
        return tokens.filter(t => 
            t.symbol.toLowerCase().includes(lower) || 
            t.name.toLowerCase().includes(lower) ||
            t.address === lower
        );
    }, [tokens, search]);

    const displayTokens = filteredTokens.slice(0, displayLimit);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight * 1.5) {
            setDisplayLimit(prev => Math.min(prev + 20, filteredTokens.length));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] h-[80vh] flex flex-col p-0 gap-0 bg-background-secondary border-2 border-accent-primary/30 shadow-2xl shadow-accent-primary/10 overflow-hidden">
                <DialogHeader className="p-4 border-b border-border-primary bg-background-secondary/95 backdrop-blur-sm">
                    <DialogTitle className="text-xl font-bold text-center text-accent-primary flex items-center justify-center gap-2">
                        <RoyalIcon variant="coins" size={20} />
                        Select Tribute Asset
                    </DialogTitle>
                    <div className="relative mt-4">
                        <RoyalIcon variant="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-primary/60" />
                        <Input
                            placeholder="Search by name or address"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 bg-background-primary/50 border-border-primary text-white placeholder-text-muted focus:ring-accent-primary focus:border-accent-primary transition-all"
                            autoFocus
                        />
                    </div>
                </DialogHeader>

                <div 
                    className="flex-1 overflow-y-auto p-2 space-y-1 bg-background-primary/30"
                    onScroll={handleScroll}
                >
                    {isLoading ? (
                        <div className="space-y-2 p-2">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-2">
                                    <Skeleton variant="circular" className="w-10 h-10" animated={true} />
                                    <div className="flex-1">
                                        <Skeleton variant="text" width="40%" height={16} animated={true} />
                                        <Skeleton variant="text" width="60%" height={12} animated={true} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : displayTokens.length === 0 ? (
                        <div className="text-center py-12 text-text-muted flex flex-col items-center gap-3">
                            <div className="bg-white/5 p-4 rounded-full">
                                <RoyalIcon variant="search" size={32} className="opacity-20" />
                            </div>
                            <span className="text-text-secondary">No matching assets found in the realm.</span>
                        </div>
                    ) : (
                        displayTokens.map((token) => (
                            <TokenItem 
                                key={token.address} 
                                token={token} 
                                onSelect={() => {
                                    onSelect(token);
                                    onClose();
                                }} 
                            />
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

const TokenItem = React.memo(({ token, onSelect }: { token: TokenInfo; onSelect: () => void }) => {
    const [hasError, setHasError] = useState(false);

    return (
        <button
            onClick={onSelect}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-accent-primary/20 transition-all group active:scale-[0.99]"
        >
            <div className="w-10 h-10 rounded-full bg-background-tertiary overflow-hidden flex-shrink-0 border border-border-primary group-hover:border-accent-primary group-hover:shadow-[0_0_10px_rgba(234,179,8,0.2)] transition-all relative">
                {token.logoURI && !hasError ? (
                    <img 
                        src={token.logoURI} 
                        alt={token.symbol} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={() => setHasError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accent-primary/10 text-accent-primary font-bold text-xs">
                        {token.symbol.slice(0, 2)}
                    </div>
                )}
            </div>
            <div className="flex flex-col items-start flex-1 min-w-0">
                <div className="flex items-center gap-2 w-full">
                    <span className="font-bold text-text-primary truncate group-hover:text-accent-primary transition-colors">{token.symbol}</span>
                    {token.symbol === 'SOL' && <span className="text-[10px] bg-accent-primary/20 text-accent-primary px-1.5 rounded border border-accent-primary/30">Native</span>}
                    {token.symbol === 'USDC' && <span className="text-[10px] bg-tier-rare/20 text-tier-rare px-1.5 rounded border border-tier-rare/30">Stable</span>}
                </div>
                <span className="text-xs text-text-muted truncate w-full text-left group-hover:text-text-secondary transition-colors">{token.name}</span>
            </div>
            {token.symbol === 'SOL' && <RoyalIcon variant="crown" size={14} className="text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity" />}
        </button>
    );
});

TokenItem.displayName = 'TokenItem';
