import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button, RoyalIcon, TransactionStatus } from '@/components/ui';
import { GlowPulse, EntranceAnimation } from '@/components/ui/AnimationUtilities';

interface SuccessViewProps {
  txSignature: string;
  onClose: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ txSignature, onClose }) => {
  return (
    <div className="py-8 text-center space-y-6">
      <DialogHeader>
        <EntranceAnimation type="scale" duration={600}>
          <DialogTitle className="text-2xl font-bold flex flex-col items-center gap-4 text-success">
            <div className="relative">
              <GlowPulse color="green" intensity="strong" duration={2000}>
                <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center border-2 border-success">
                  <RoyalIcon variant="crown" size={40} className="text-success" />
                </div>
              </GlowPulse>
              <div className="absolute -bottom-2 -right-2 bg-background-primary rounded-full p-1 border border-border-primary">
                <RoyalIcon variant="check" size={20} className="text-success" />
              </div>
            </div>
            Tribute Accepted
          </DialogTitle>
        </EntranceAnimation>
        <DialogDescription className="text-text-secondary">
          Your offering has been recorded in the eternal ledger.
        </DialogDescription>
      </DialogHeader>

      <TransactionStatus 
        signature={txSignature} 
        status="success" 
      />

      <div className="p-4 bg-background-primary rounded-lg border border-border-primary mx-4">
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
            const text = `I just paid tribute to claim my throne on SpendThrone! 👑\n\nCompete for status: ${window.location.origin}`;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
          }}
          className="w-full sm:w-auto border-accent-primary/50 text-accent-primary hover:bg-accent-primary hover:text-black"
        >
          <RoyalIcon variant="twitter" className="mr-2" />
          Share Glory
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
