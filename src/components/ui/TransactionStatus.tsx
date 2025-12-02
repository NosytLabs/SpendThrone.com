import React from 'react';
import { RoyalIcon } from './RoyalIcon';
import { GlowPulse } from './AnimationUtilities';

type Props = {
  status?: string | null;
  signature?: string | null;
  error?: string | null;
};

export const TransactionStatus: React.FC<Props> = ({ status, signature, error }) => {
  if (!status && !error) return null;
  
  const isError = !!error;
  const isSuccess = !!signature;
  const isLoading = status && !signature && !error;

  return (
    <div className={`rounded-lg border p-4 mt-4 backdrop-blur-sm transition-all duration-300 ${
      isError 
        ? 'border-error/30 bg-error/10 shadow-[0_0_15px_rgba(239,68,68,0.15)]' 
        : isSuccess 
          ? 'border-success/30 bg-success/10 shadow-[0_0_15px_rgba(34,197,94,0.15)]' 
          : 'border-accent-primary/30 bg-accent-primary/10 shadow-[0_0_15px_rgba(234,179,8,0.15)]'
    }`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {isLoading && (
            <RoyalIcon variant="refresh" className="animate-spin text-accent-primary" size={20} />
          )}
          {isSuccess && (
            <GlowPulse color="green" intensity="strong">
              <RoyalIcon variant="check" className="text-success" size={20} />
            </GlowPulse>
          )}
          {isError && (
             <RoyalIcon variant="close" className="text-error" size={20} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          {status && (
            <div className={`font-medium text-sm mb-1 ${
              isError ? 'text-error' : isSuccess ? 'text-success' : 'text-accent-primary'
            }`}>
              {status}
            </div>
          )}
          
          {signature && (
            <div className="text-xs text-text-secondary mt-2 bg-black/20 p-2 rounded border border-white/5">
              <span className="uppercase tracking-wider text-[10px] text-text-muted block mb-1">Transaction Signature</span>
              <a 
                href={`https://solscan.io/tx/${signature}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-mono hover:text-accent-primary transition-colors break-all flex items-center gap-1 group"
              >
                {signature}
                <RoyalIcon variant="externalLink" size={10} className="opacity-50 group-hover:opacity-100" />
              </a>
            </div>
          )}
          
          {error && <div className="text-sm text-error/90 mt-1">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default TransactionStatus;