import React from 'react';
import { Button, RoyalIcon } from '@/components/ui';
import { TokenSelector } from '@/components/ui/TokenSelector';

export interface TokenData {
  symbol: string;
  mint: string;
  label: string;
  logoURI?: string;
  decimals: number;
}

interface TokenSelectButtonProps {
  selectedToken: { symbol: string; mint?: string };
  tokens: TokenData[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSelect: (token: TokenData) => void;
}

export const TokenSelectButton: React.FC<TokenSelectButtonProps> = ({
  selectedToken,
  tokens,
  isOpen,
  setIsOpen,
  onSelect
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-primary flex justify-between">
        <span>Select Tribute Asset</span>
        <span className="text-xs text-accent-secondary bg-accent-secondary/10 px-2 py-0.5 rounded border border-accent-secondary/30">
          Powered by Jupiter
        </span>
      </label>
      <Button
        variant="outline"
        className="w-full justify-between bg-background-primary border-border-primary text-text-primary hover:bg-background-secondary/80 h-12"
        onClick={() => setIsOpen(true)}
      >
        <span className="flex items-center gap-2">
          {selectedToken.mint ? (
            (() => {
              const t = tokens.find(tk => tk.mint === selectedToken.mint);
              return t?.logoURI ? (
                <img 
                  src={t.logoURI} 
                  alt={selectedToken.symbol} 
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : <RoyalIcon variant="coins" size={24} />;
            })()
          ) : (
            <RoyalIcon variant="coins" size={24} className="text-[#9945FF]" />
          )}
          <span className="text-lg font-bold">{selectedToken.symbol}</span>
        </span>
        <RoyalIcon variant="chevronDown" size={20} className="text-text-secondary" />
      </Button>
      
      <TokenSelector
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={(token) => {
          onSelect({
            symbol: token.symbol,
            mint: token.address,
            label: token.name,
            logoURI: token.logoURI,
            decimals: token.decimals || 9
          });
        }}
        tokens={tokens.map(t => ({
          address: t.mint,
          symbol: t.symbol,
          name: t.label,
          logoURI: t.logoURI,
          decimals: t.decimals
        }))}
      />
    </div>
  );
};
