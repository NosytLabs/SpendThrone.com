import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  GradientButton, 
  RoyalIcon 
} from '@/components/ui';
import { usePayment } from './usePayment';
import { formatCurrency, formatAmount } from '@/shared/utils/formatting/currency';
import { swapService, QuoteResult } from '@/core/services/swapService';
import { priceService } from '@/core/services/priceService';
import { debugLog } from '@/shared/utils/logger';
import { EntranceAnimation, GlowPulse } from '@/components/ui/AnimationUtilities';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDegradedMode } from '@/shared/hooks/useDegradedMode';
import { TokenSelectButton, TokenData } from './components/TokenSelectButton';
import { PaymentForm } from './components/PaymentForm';
import { SuccessView } from './components/SuccessView';

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
    const [tokenPrice, setTokenPrice] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const [link, setLink] = useState<string>('');
    
    // Swap State
    const [isSwapping, setIsSwapping] = useState(false);
    const [swapStatus, setSwapStatus] = useState<string>('');
    const [swapError, setSwapError] = useState<string | null>(null);
    const [quote, setQuote] = useState<QuoteResult | null>(null);

    const { payTribute, isProcessing: isStandardProcessing, error: standardError, txSignature, statusMessage, resetState, setTxSignature } = usePayment();

    const isProcessing = isStandardProcessing || isSwapping;
    const error = standardError || swapError;

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

    // Fetch price when token changes
    useEffect(() => {
        const fetchPrice = async () => {
            if (selectedToken.symbol === 'USDC') {
                setTokenPrice(1);
                return;
            }

            // Use prop provided SOL price as fallback for immediate display
            if (selectedToken.symbol === 'SOL' && solPrice > 0) {
                setTokenPrice(solPrice);
            }

            try {
                // If we have a mint, fetch real price
                const mintToFetch = selectedToken.mint || (selectedToken.symbol === 'SOL' ? 'So11111111111111111111111111111111111111112' : undefined);
                if (mintToFetch) {
                    const price = await priceService.getTokenPrice(mintToFetch);
                    if (price > 0) setTokenPrice(price);
                }
            } catch (e) {
                debugLog('Failed to fetch price for', selectedToken.symbol, e);
            }
        };
        fetchPrice();
    }, [selectedToken, solPrice]);

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
                // Quote: Input Token -> SOL (Treasury wants SOL usually, or we swap to USDC if treasury accepts USDC)
                // Assuming we swap to SOL for simplicity, or use swapService to determine best route to treasury
                // But standard tribute is SOL.
                // Let's swap to SOL.
                const solMint = 'So11111111111111111111111111111111111111112';
                const quoteData = await swapService.getQuote(
                    selectedToken.mint!,
                    solMint,
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
        if (tokenAmount <= 0) return;
        setSwapError(null);

        // Combine message and link with a separator if both exist, or just one
        let fullMemo = link 
            ? (message ? `${message} | ${link}` : `| ${link}`)
            : message;

        // Append referrer if present
        const referrer = localStorage.getItem('referrer_address');
        if (referrer) {
            fullMemo = fullMemo ? `${fullMemo} | ref:${referrer}` : `ref:${referrer}`;
        }

        // STANDARD SOL PAYMENT
        if (selectedToken.symbol === 'SOL') {
            const success = await payTribute(selectedToken.symbol, tokenAmount, selectedToken.mint, fullMemo);
            if (success && onSuccess) {
                setTimeout(() => onSuccess(), 3000);
            }
            return;
        }

        // SWAP PAYMENT (ANY SPL -> TREASURY)
        if (quote && wallet.connected && wallet.publicKey && wallet.signTransaction) {
            setIsSwapping(true);
            setSwapStatus('Preparing Jupiter Swap...');
            try {
                // Create a wallet object that satisfies the interface (publicKey and signTransaction are guaranteed)
                const walletForSwap = {
                    ...wallet,
                    publicKey: wallet.publicKey,
                    signTransaction: wallet.signTransaction
                };
                const result = await swapService.executeSwap(quote, walletForSwap, (status) => setSwapStatus(status));
                
                if (result.success) {
                    setTxSignature(result.txid); // Reuse usePayment's state to show success UI
                    if (onSuccess) setTimeout(() => onSuccess(), 3000);
                }
            } catch (e) {
                const msg = 'Swap failed: ' + (e instanceof Error ? e.message : 'Unknown error');
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
                    <SuccessView txSignature={txSignature} onClose={onClose} />
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

                        {rpcDisabled && (
                            <div className="mb-4 rounded-md border border-accent-secondary/40 bg-accent-secondary/10 p-3 text-sm text-accent-secondary">
                                <div className="flex items-center gap-2">
                                    <RoyalIcon variant="warning" size={16} />
                                    Royal payments are temporarily disabled while we upgrade our systems.
                                </div>
                            </div>
                        )}

                        <div className="space-y-6 py-4">
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
                            />

                            {/* Swap Info */}
                            {selectedToken.symbol !== 'SOL' && quote && (
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

                        <DialogFooter>
                            <GradientButton
                                onClick={handlePayment}
                                disabled={isProcessing || tokenAmount <= 0 || rpcDisabled}
                                className="w-full h-12 text-lg font-bold shadow-lg shadow-accent-primary/20"
                                loading={isProcessing}
                            >
                                {isProcessing ? 'Processing...' : `Pay ${formatCurrency(usdAmount)} Tribute`}
                            </GradientButton>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};
