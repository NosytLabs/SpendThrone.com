import React, { useState, useEffect } from 'react';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button, RoyalIcon, TransactionStatus } from '@/components/ui';
import { GlowPulse, EntranceAnimation, ConfettiAnimation } from '@/components/ui/AnimationUtilities';
import { getOpportunityCost } from '@/shared/utils/opportunityCost';

interface SuccessViewProps {
  txSignature: string;
  onClose: () => void;
  amountUsd?: number;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ txSignature, onClose, amountUsd = 0 }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="py-8 text-center space-y-6 relative overflow-hidden">
      <ConfettiAnimation isActive={showConfetti} />
      
      <DialogHeader>
        <EntranceAnimation type="scale" duration={600}>
          <DialogTitle className="text-2xl font-bold flex flex-col items-center gap-4 text-success">
            <div className="relative">
              <GlowPulse color="gold" intensity="strong" duration={1500}>
                <div className="w-24 h-24 rounded-full bg-gradient-to-b from-yellow-400/20 to-orange-600/20 flex items-center justify-center border-4 border-accent-primary shadow-[0_0_30px_rgba(234,179,8,0.4)]">
                  <RoyalIcon variant="fire" size={48} className="text-orange-500 animate-pulse filter drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                </div>
              </GlowPulse>
              <div className="absolute -bottom-2 -right-2 bg-black rounded-full p-2 border-2 border-success shadow-lg">
                <RoyalIcon variant="check" size={20} className="text-success" />
              </div>
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 font-cinzel text-3xl drop-shadow-sm">
              WEALTH BURNED
            </span>
          </DialogTitle>
        </EntranceAnimation>
        <DialogDescription className="text-text-secondary text-lg mt-2">
          Your offering has been consumed by the protocol. <br/>
          <span className="text-accent-primary font-bold">You have ascended.</span>
        </DialogDescription>
      </DialogHeader>

      <TransactionStatus 
        signature={txSignature} 
        status="success" 
      />

      <div className="p-4 bg-background-primary rounded-lg border border-border-primary mx-4">
        <p className="text-sm text-text-secondary mb-2 font-bold text-red-400">🔥 OPPORTUNITY COST ANALYSIS</p>
        <p className="text-sm text-text-muted italic mb-4">
          &quot;You just burned enough money to buy <span className="text-white font-bold">{getOpportunityCost(amountUsd)}</span>. Instead, you bought... pixels.&quot;
        </p>
        
        <p className="text-sm text-text-secondary mb-2">Transaction Signature</p>
        <div className="flex items-center justify-between bg-background-secondary p-2 rounded border border-border-primary">
          <code className="text-xs text-accent-primary font-mono truncate max-w-[200px]">
            {txSignature}
          </code>
          <a 
            href={`https://solscan.io/tx/${txSignature}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-text-muted hover:text-white flex items-center gap-1"
          >
            View <RoyalIcon variant="externalLink" size={12} />
          </a>
        </div>
      </div>

      <DialogFooter className="sm:justify-center gap-3 px-4">
        <Button 
          variant="outline" 
          onClick={() => {
            const text = `I just USURPED the throne on SpendThrone! 👑\n\nWitness my ascension (and try to beat me): ${window.location.origin}\n\n#Solana #SpendThrone #Status`;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
          }}
          className="w-full sm:w-auto border-accent-primary/50 text-accent-primary hover:bg-accent-primary hover:text-black"
        >
          <RoyalIcon variant="twitter" className="mr-2" />
          Flaunt Status (Twitter)
        </Button>
        <Button 
          variant="primary" 
          onClick={onClose}
          className="w-full sm:w-auto bg-success hover:bg-success/90 text-white"
        >
          Close
        </Button>
      </DialogFooter>
    </div>
  );
};
