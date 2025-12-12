import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RoyalIcon } from '@/components/ui/RoyalIcon';
import { formatCurrency } from '@/shared/utils/formatting/currency';
import { validatePaymentAmount, validateMessage, validateUrl } from '@/shared/utils/validation';

interface PaymentFormProps {
  /** Value of the amount input field */
  inputValue: string;
  /** Setter for amount input field */
  setInputValue: (value: string) => void;
  /** Current input mode: 'TOKEN' (crypto) or 'USD' (fiat) */
  inputMode: 'TOKEN' | 'USD';
  /** Toggle between input modes */
  setInputMode: (mode: 'TOKEN' | 'USD') => void;
  /** Symbol of the selected token (e.g. 'SOL', 'USDC') */
  tokenSymbol: string;
  /** Calculated USD value of the payment */
  usdAmount: number;
  /** Calculated token amount of the payment */
  tokenAmount: number;
  /** Optional message to attach to the transaction */
  message: string;
  /** Setter for message */
  setMessage: (msg: string) => void;
  /** Optional link to attach to the transaction */
  link: string;
  /** Setter for link */
  setLink: (link: string) => void;
  /** Current wallet balance (optional) */
  walletBalance?: number;
}

/**
 * Form component for handling payment amount, message, and link inputs.
 * Supports toggling between Token and USD input modes.
 */
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
  walletBalance,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const validation = validatePaymentAmount(value);
    
    if (validation.isValid) {
      setErrors(prev => ({ ...prev, amount: '' }));
      setInputValue(value);
    } else {
      setErrors(prev => ({ ...prev, amount: validation.error || 'Invalid amount' }));
    }
  }, [setInputValue]);

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const validation = validateMessage(value, 64);
    
    if (validation.isValid) {
      setErrors(prev => ({ ...prev, message: '' }));
      setMessage(validation.sanitized || value);
    } else {
      setErrors(prev => ({ ...prev, message: validation.error || 'Invalid message' }));
      setMessage(value);
    }
  }, [setMessage]);

  const handleLinkChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const validation = validateUrl(value);
    
    if (validation.isValid) {
      setErrors(prev => ({ ...prev, link: '' }));
      setLink(validation.sanitized || value);
    } else {
      setErrors(prev => ({ ...prev, link: validation.error || 'Invalid URL' }));
      setLink(value);
    }
  }, [setLink]);
  // Quick amount presets for better UX
  const quickAmounts = inputMode === 'USD' 
    ? [10, 25, 50, 100, 250, 500, 1000]
    : [0.1, 0.25, 0.5, 1, 2.5, 5, 10];

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
            onChange={handleAmountChange}
            placeholder="0.00"
            className={`pl-8 pr-20 h-12 text-lg font-bold bg-background-primary border-border-primary focus:border-accent-primary ${errors.amount ? 'border-red-500' : ''}`}
            min="0"
            step="any"
          />
          {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
          
          {/* Quick Amount Buttons */}
          <div className="flex flex-wrap gap-2 mt-3">
            {quickAmounts.map((amount) => (
              <Button
                key={amount}
                size="sm"
                variant="ghost"
                className={`h-8 px-3 text-xs font-medium transition-all ${
                  parseFloat(inputValue) === amount 
                    ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30' 
                    : 'bg-background-secondary/50 text-text-secondary hover:bg-background-secondary hover:text-text-primary'
                }`}
                onClick={() => setInputValue(amount.toString())}
              >
                {inputMode === 'USD' ? `$${amount}` : amount}
              </Button>
            ))}
            
            {/* MAX Button */}
            {inputMode === 'TOKEN' && walletBalance && walletBalance > 0 && (
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-3 text-xs font-bold bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border border-orange-500/30"
                    onClick={() => setInputValue(walletBalance.toString())}
                >
                    MAX
                </Button>
            )}
          </div>
          
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
          onChange={handleMessageChange}
          placeholder="Declare your glory..."
          maxLength={64}
          className={`bg-background-primary border-border-primary ${errors.message ? 'border-red-500' : ''}`}
        />
        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
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
            onChange={handleLinkChange}
            placeholder="https://twitter.com/..."
            className={`pl-9 bg-background-primary border-border-primary ${errors.link ? 'border-red-500' : ''}`}
          />
          {errors.link && <p className="text-xs text-red-500 mt-1">{errors.link}</p>}
        </div>
      </div>
    </>
  );
};
