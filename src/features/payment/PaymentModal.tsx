import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  Button, 
  RoyalIcon
} from '@/components/ui';
import { usePayment } from './usePayment';
import { useTokenInfo } from './hooks/useTokenInfo';
import { formatAmount } from '@/shared/utils/formatting/currency';
import { useSoundEffects } from '@/components/ui/useSoundEffects';
import { swapService, QuoteResult } from '@/core/services/swapService';
import { debugLog } from '@/shared/utils/logger';
import { EntranceAnimation, GlowPulse } from '@/components/ui/AnimationUtilities';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDegradedMode } from '@/shared/hooks/useDegradedMode';
import { TokenSelectButton, TokenData } from './components/TokenSelectButton';
import { PaymentForm } from './components/PaymentForm';
import { SuccessView } from './components/SuccessView';

import { SacrificeView } from './components/SacrificeView';
import { Analytics, EVENTS } from '@/shared/services/analytics';

export interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    solPrice?: number;
    initialAmount?: number; // USD amount to pre-fill
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, solPrice = 0, initialAmount = 0 }) => {
    const wallet = useWallet();
    const { isDegraded } = useDegradedMode();
    const [inputValue, setInputValue] = useState<string>('');
    const [inputMode, setInputMode] = useState<'TOKEN' | 'USD'>('USD'); // Default to USD for better UX
    const [selectedToken, setSelectedToken] = useState<{ symbol: string; mint?: string; decimals?: number }>({ symbol: 'SOL', decimals: 9 });
    const [tokens, setTokens] = useState<TokenData[]>([]);
    const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [link, setLink] = useState<string>('');
    
    // Swap State
    const [isSwapping, setIsSwapping] = useState(false);
    const [swapStatus, setSwapStatus] = useState<string>('');
    const [swapError, setSwapError] = useState<string | null>(null);
    const [quote, setQuote] = useState<QuoteResult | null>(null);
    const [isSacrificeMode, setIsSacrificeMode] = useState(false);

    const { payTribute, isProcessing: isStandardProcessing, error: standardError, txSignature, statusMessage, resetState, setTxSignature } = usePayment();

    // Use Custom Hook for Token Data
    const { price: tokenPrice, balance } = useTokenInfo({
        walletPublicKey: wallet.publicKey,
        selectedToken,
        solPrice
    });

    const isProcessing = isStandardProcessing || isSwapping;
    const error = standardError || swapError;
    const { playSound } = useSoundEffects();

    // Load supported tokens
    useEffect(() => {
        const loadTokens = async () => {
            try {
                const list = await swapService.getSupportedTokens();
                const mapped = list.map(t => ({
                    symbol: t.symbol || 'UNKNOWN',
                    mint: t.address,
                    label: t.name || t.symbol || 'Unknown Token',
                    logoURI: t.logoURI,
                    decimals: t.decimals || 9
                }));
                // Ensure SOL and USDC are at the top
                const base = mapped.filter(t => ['SOL', 'USDC'].includes(t.symbol));
                const others = mapped.filter(t => !['SOL', 'USDC'].includes(t.symbol));
                setTokens([...base, ...others]);
            } catch (e) {
                debugLog('Failed to load tokens', e);
            }
        };
        loadTokens();
    }, []);

    useEffect(() => {
        if (isOpen) {
            setInputValue(initialAmount > 0 ? initialAmount.toFixed(2) : '');
            setInputMode('USD'); // Force USD mode if pre-filled
            setMessage('');
            setLink('');
            resetState();
            setIsSwapping(false);
            setSwapStatus('');

            setSwapError(null);
            Analytics.track(EVENTS.PAYMENT.OPEN_MODAL);
        }
    }, [isOpen, initialAmount, resetState]);

    // Calculate derived values
    const numInput = parseFloat(inputValue) || 0;
    
    const tokenAmount = inputMode === 'TOKEN' 
        ? numInput 
        : (tokenPrice > 0 ? numInput / tokenPrice : 0);

    const usdAmount = inputMode === 'USD' 
        ? numInput 
        : numInput * tokenPrice;

    // Get Quote when amount/token changes
    useEffect(() => {
        const getSwapQuote = async () => {
            if (selectedToken.symbol === 'SOL' || tokenAmount <= 0) {
                setQuote(null);
                return;
            }

            try {
                // Quote: Input Token -> USDC (Treasury standard)
                const quoteData = await swapService.getTokenToUsdcQuote(
                    selectedToken.mint!,
                    tokenAmount
                );
                setQuote(quoteData);
            } catch (e) {
                debugLog('Error getting quote:', e);
                setQuote(null);
            }
        };

        const timer = setTimeout(getSwapQuote, 500);
        return () => clearTimeout(timer);
    }, [selectedToken, tokenAmount]);

    const handlePayment = async () => {
        setSwapError(null);
        // If it's pure SOL, use tribute logic
        if (selectedToken.symbol === 'SOL') {
            const amountSOL = inputMode === 'USD' ? usdAmount / tokenPrice : numInput;
            // Pass 'SOL' as token symbol, not amount as first arg
            payTribute('SOL', amountSOL, undefined, message, link);
            Analytics.track(EVENTS.PAYMENT.INITIATED, { token: 'SOL', amount: amountSOL, mode: 'TRIBUTE' });
            playSound('success'); // Play sound on optimistic success
            if (onSuccess) onSuccess(); // Optimistic close
        } else {
            // It's a token swap -> sol -> treasury
            if (!quote || !wallet.publicKey) return;

            setIsSwapping(true);
            try {
                // Cast wallet to satisfy type check since we checked publicKey
                
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const result = await swapService.executeSwap(quote, wallet as any, (status) => setSwapStatus(status), { message, link });
                if (result.success) {
                    setTxSignature(result.txid); // Reuse usePayment's state to show success UI
                    Analytics.track(EVENTS.PAYMENT.SUCCESS, { txId: result.txid, token: selectedToken.symbol, amount: tokenAmount });
                    if (onSuccess) setTimeout(() => onSuccess(), 3000);
                }
            } catch (e) {
                const msg = 'Swap failed: ' + (e instanceof Error ? e.message : 'Unknown error');
                Analytics.track(EVENTS.PAYMENT.FAILED, { error: msg, token: selectedToken.symbol });
                setSwapStatus('');
                setSwapError(msg);
            } finally {
                setIsSwapping(false);
            }
        }
    };

    const rpcDisabled = isDegraded;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-background-secondary border-2 border-accent-primary/50 shadow-2xl shadow-accent-primary/20">
                {txSignature ? (
                    <SuccessView txSignature={txSignature} onClose={onClose} amountUsd={usdAmount} />
                ) : (
                    <>
                        <DialogHeader>
                            <EntranceAnimation type="fade-in" duration={800}>
                                <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2 text-accent-primary">
                                    <GlowPulse color="gold" intensity="medium" duration={2000}>
                                        <RoyalIcon variant="crown" size={32} className="filter drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
                                    </GlowPulse>
                                    Pay Royal Tribute
                                </DialogTitle>
                            </EntranceAnimation>
                            <EntranceAnimation type="slide-up" delay={200} duration={600}>
                                <DialogDescription className="text-center text-text-secondary italic">
                                    &ldquo;History remembers the bold, but it reveres the wealthy.&rdquo;
                                </DialogDescription>
                            </EntranceAnimation>
                        </DialogHeader>

                        {/* Mode Toggle */}
                        <div className="flex gap-2 mb-6 bg-black/20 p-1 rounded-lg">
                            <button
                                onClick={() => {
                                    setInputMode('USD');
                                    setIsSacrificeMode(false);
                                }}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${!isSacrificeMode ? 'bg-accent-primary text-black shadow-lg shadow-accent-primary/20' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
                            >
                                Pay Tribute
                            </button>
                            <button
                                onClick={() => setIsSacrificeMode(true)}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${isSacrificeMode ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
                            >
                                <span className="flex items-center justify-center gap-1.5">
                                    <RoyalIcon variant="flame" size={12} />
                                    Sacrifice
                                </span>
                            </button>
                        </div>

                        {isSacrificeMode ? (
                            <SacrificeView onSuccess={(amountSOL, tx) => {
                                setTxSignature(tx);
                                // Update state so SuccessView shows correct amount
                                setInputMode('TOKEN');
                                setSelectedToken({ symbol: 'SOL', decimals: 9, mint: 'So11111111111111111111111111111111111111112' });
                                setInputValue(amountSOL.toString());
                                
                                if (onSuccess) setTimeout(() => onSuccess(), 3000);
                            }} />
                        ) : (
                            <div className="space-y-6 py-2">
                                {/* Error from Degraded Mode */}
                                {rpcDisabled && (
                                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex gap-2">
                                        <RoyalIcon variant="warning" className="text-yellow-500 shrink-0 mt-0.5" />
                                        <div className="text-sm text-yellow-200">
                                            The system is currently protecting the realm. Payments may be slower than usual.
                                        </div>
                                    </div>
                                )}

                                <TokenSelectButton 
                                    selectedToken={selectedToken}
                                    tokens={tokens}
                                    isOpen={isTokenSelectorOpen}
                                    setIsOpen={setIsTokenSelectorOpen}
                                    onSelect={(token) => {
                                        setSelectedToken({ symbol: token.symbol, mint: token.mint, decimals: token.decimals || 9 });
                                        setIsTokenSelectorOpen(false);
                                    }}
                                />

                                <PaymentForm
                                    inputValue={inputValue}
                                    setInputValue={setInputValue}
                                    inputMode={inputMode}
                                    setInputMode={setInputMode}
                                    tokenSymbol={selectedToken.symbol}
                                    usdAmount={usdAmount}
                                    tokenAmount={tokenAmount}
                                    message={message}
                                    setMessage={setMessage}
                                    link={link}
                                    setLink={setLink}
                                    walletBalance={balance}
                                />

                                {/* Swap Info */}
                                {quote && isTokenSelectorOpen === false && (
                                    <EntranceAnimation type="fade-in">
                                        <div className="bg-background-primary/50 p-3 rounded-lg border border-border-primary text-sm">
                                            <div className="flex justify-between text-text-secondary mb-1">
                                                <span>Rate</span>
                                                <span>1 {selectedToken.symbol} ≈ {formatAmount(tokenPrice / (solPrice || 1), 6)} SOL</span>
                                            </div>
                                            <div className="flex justify-between text-text-secondary">
                                                <span>Network Fee</span>
                                                <span>~0.000005 SOL</span>
                                            </div>
                                            {quote.priceImpact > 0.1 && (
                                                <div className="flex justify-between text-warning mt-1 font-medium">
                                                    <span>Price Impact</span>
                                                    <span>{quote.priceImpact.toFixed(2)}%</span>
                                                </div>
                                            )}
                                        </div>
                                    </EntranceAnimation>
                                )}

                                {/* Error Display */}
                                {error && (
                                    <EntranceAnimation type="scale">
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-3">
                                            <RoyalIcon variant="warning" className="text-red-500 shrink-0 mt-0.5" />
                                            <div className="text-sm text-red-400">{error}</div>
                                        </div>
                                    </EntranceAnimation>
                                )}

                                {/* Status Display */}
                                {(isProcessing || statusMessage) && (
                                    <div className="bg-accent-primary/10 border border-accent-primary/30 rounded-lg p-3 text-center">
                                        {isProcessing && <RoyalIcon variant="refresh" className="animate-spin mx-auto mb-2 text-accent-primary" />}
                                        <div className="text-sm text-accent-primary animate-pulse">
                                            {swapStatus || statusMessage || 'Processing Transaction...'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <DialogFooter>
                            {!isSacrificeMode && (
                                <div className="pt-2 w-full">
                                    <Button
                                        variant="gradient"
                                        className="w-full py-6 text-lg font-cinzel font-bold relative overflow-hidden group shadow-lg hover:shadow-accent-primary/40"
                                        onClick={handlePayment}
                                        disabled={isProcessing || !inputValue || parseFloat(inputValue) <= 0 || rpcDisabled}
                                    >
                                        {isProcessing ? (
                                            <span className="flex items-center gap-2">
                                                <span className="animate-spin">⏳</span> PROCESSING...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2 group-hover:scale-105 transition-transform">
                                                <RoyalIcon variant="sword" size={20} />
                                                {inputMode === 'USD' ? `PAY $${inputValue || '0'}` : `PAY ${inputValue || '0'} ${selectedToken.symbol}`}
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};
