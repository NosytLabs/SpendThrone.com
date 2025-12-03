import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RoyalIcon } from '@/components/ui/RoyalIcon';
import { formatCurrency } from '@/shared/utils/formatting/currency';

interface PaymentFormProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  inputMode: 'TOKEN' | 'USD';
  setInputMode: (mode: 'TOKEN' | 'USD') => void;
  tokenSymbol: string;
  usdAmount: number;
  tokenAmount: number;
  message: string;
  setMessage: (msg: string) => void;
  link: string;
  setLink: (link: string) => void;
  walletBalance?: number;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  inputValue,
  setInputValue,
  inputMode,
  setInputMode,
  tokenSymbol,
  usdAmount,
  tokenAmount,
  message,
  setMessage,
  link,
  setLink,
}) => {
  return (
    <>
      {/* Amount Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary flex justify-between">
          <span>Amount</span>
          <span className="text-xs text-text-secondary">
            ≈ {inputMode === 'USD' 
                ? `${tokenAmount.toFixed(4)} ${tokenSymbol}`
                : formatCurrency(usdAmount)
              }
          </span>
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold">
            {inputMode === 'USD' ? '$' : <RoyalIcon variant="coins" size={16} />}
          </div>
          <Input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="0.00"
            className="pl-8 pr-20 h-12 text-lg font-bold bg-background-primary border-border-primary focus:border-accent-primary"
            min="0"
            step="any"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className={`h-8 px-2 text-xs ${inputMode === 'USD' ? 'text-accent-primary bg-accent-primary/10' : 'text-text-muted'}`}
              onClick={() => setInputMode('USD')}
            >
              USD
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={`h-8 px-2 text-xs ${inputMode === 'TOKEN' ? 'text-accent-primary bg-accent-primary/10' : 'text-text-muted'}`}
              onClick={() => setInputMode('TOKEN')}
            >
              {tokenSymbol}
            </Button>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">Message (Optional)</label>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Declare your glory..."
          maxLength={64}
          className="bg-background-primary border-border-primary"
        />
        <div className="text-xs text-right text-text-muted">
          {message.length}/64
        </div>
      </div>

      {/* Link Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">Link (Optional)</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <RoyalIcon variant="externalLink" size={16} />
          </div>
          <Input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://twitter.com/..."
            className="pl-9 bg-background-primary border-border-primary"
          />
        </div>
      </div>
    </>
  );
};
