import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  Button, 
  GradientButton, 
  TransactionStatus,
  Input,
  RoyalIcon 
} from '@/components/ui';
import { usePayment } from './usePayment';
import { formatCurrency, formatAmount } from '@/shared/utils/formatting/currency';
import { swapService, QuoteResult } from '@/core/services/swapService';
import { priceService } from '@/core/services/priceService';
import { TokenSelector } from '@/components/ui/TokenSelector';
import { debugLog } from '@/shared/utils/logger';
import { EntranceAnimation, GlowPulse } from '@/components/ui/AnimationUtilities';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDegradedMode } from '@/shared/hooks/useDegradedMode';

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
    const [tokens, setTokens] = useState<{ symbol: string; mint: string; label: string; logoURI?: string; decimals: number }[]>([]);
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

                {!txSignature ? (
                    <div className="space-y-6 py-4">

                        {/* Token Selection */}
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
                                onClick={() => setIsTokenSelectorOpen(true)}
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
                        </div>
                        
                        <TokenSelector
                            isOpen={isTokenSelectorOpen}
                            onClose={() => setIsTokenSelectorOpen(false)}
                            onSelect={(token) => {
                                setSelectedToken({ symbol: token.symbol, mint: token.address, decimals: token.decimals || 9 });
                                setIsTokenSelectorOpen(false);
                            }}
                            tokens={tokens.map(t => ({
                                address: t.mint,
                                symbol: t.symbol,
                                name: t.label,
                                logoURI: t.logoURI,
                                decimals: t.decimals
                            }))}
                        />

                        {/* Amount Input */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-text-primary">Amount</label>
                                <button 
                                    onClick={() => setInputMode(prev => prev === 'USD' ? 'TOKEN' : 'USD')}
                                    className="text-xs flex items-center gap-1 text-accent-primary hover:text-accent-secondary transition-colors"
                                    disabled={rpcDisabled}
                                >
                                    <RoyalIcon variant="refresh" size={12} />
                                    Switch to {inputMode === 'USD' ? selectedToken.symbol : 'USD'}
                                </button>
                            </div>
                            
                            <div className="relative">
                                <Input
                                    type="number"
                                    placeholder={inputMode === 'USD' ? "0.00" : "0.0000"}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="pl-10 text-lg font-mono"
                                    min="0"
                                    step="any"
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5">
                                    {inputMode === 'USD' ? (
                                        <span className="text-text-secondary font-bold">$</span>
                                    ) : (
                                        <RoyalIcon variant="wallet" size={18} className="text-text-secondary" />
                                    )}
                                </div>
                            </div>
                            
                            {/* Conversion Display */}\n                            {inputValue && parseFloat(inputValue) > 0 && (
                                <div className="flex justify-between items-center text-sm">
                                    <div className="text-text-muted">
                                        {selectedToken.symbol !== 'SOL' && quote && (
                                            <span className="flex items-center gap-1 text-xs">
                                                <RoyalIcon variant="zap" size={10} className="text-green-500" />
                                                Est. Output: {formatAmount(quote.outputAmount)} SOL
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-accent-secondary font-medium animate-in fade-in slide-in-from-top-1">
                                        {inputMode === 'USD' ? (
                                            <span>≈ {formatAmount(tokenAmount)} {selectedToken.symbol}</span>
                                        ) : (
                                            <span>≈ {formatCurrency(usdAmount)}</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-primary">Message (Optional)</label>
                            <Input
                                type="text"
                                placeholder="Add a memo to the King..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="text-sm bg-background-primary border-border-primary"
                                maxLength={100}
                            />
                            <div className="text-xs text-right text-text-muted">
                                {message.length}/100\n                            </div>
                        </div>

                        {/* Link Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-primary flex items-center gap-1">
                                <RoyalIcon variant="externalLink" size={14} className="text-accent-secondary" />
                                Link (Optional)
                            </label>
                            <Input
                                type="url"
                                placeholder="https://twitter.com/yourname"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                className="text-sm bg-background-primary border-border-primary"
                                maxLength={100}
                            />
                            <div className="text-xs text-left text-text-muted/60 pt-1">
                                Promotes your site on the leaderboard
                            </div>
                        </div>

                        {/* Status Messages */}
                        {(statusMessage || swapStatus) && !error && (
                            <div className="text-xs text-center text-accent-primary animate-pulse">
                                {swapStatus || statusMessage}
                            </div>
                        )}

                        <DialogFooter className="flex flex-col gap-2">
                            <GradientButton 
                                className="w-full h-14 text-xl font-bold shadow-xl shadow-accent-primary/20 hover:shadow-accent-primary/40"
                                onClick={handlePayment}
                                disabled={rpcDisabled || isProcessing || (inputMode === 'USD' ? numInput <= 0 : tokenAmount <= 0)}
                                loading={isProcessing}
                                loadingText={swapStatus || "Processing Tribute..."}
                                hoverScale={true}
                            >
                                <span className="flex items-center gap-3">
                                    <RoyalIcon variant="diamond" size={24} />
                                    PAY TRIBUTE
                                </span>
                            </GradientButton>

                            <p className="text-xs text-center text-text-muted">
                                By paying tribute, you acknowledge this is a donation with no expectation of return.
                            </p>
                        </DialogFooter>
                    </div>
                ) : (
                     <div className="py-6">
                        <TransactionStatus 
                            status={statusMessage || "Transaction Successful"} 
                            signature={txSignature} 
                            error={error} 
                        />
                        
                        <div className="mt-8 flex justify-center">
                            <Button onClick={onClose} variant="outline" className="w-full">
                                Close
                            </Button>
                        </div>
                     </div>
                )}

                {!txSignature && (statusMessage || error) && (
                    <TransactionStatus 
                        status={statusMessage} 
                        error={error} 
                    />
                )}
            </DialogContent>
            
            <TokenSelector 
                isOpen={isTokenSelectorOpen}
                onClose={() => setIsTokenSelectorOpen(false)}
                onSelect={(token) => {
                    setSelectedToken({ symbol: token.symbol, mint: token.address, decimals: token.decimals || 9 });
                    setIsTokenSelectorOpen(false);
                }}
                tokens={tokens.map(t => ({
                    address: t.mint,
                    symbol: t.symbol,
                    name: t.label,
                    logoURI: t.logoURI,
                    decimals: t.decimals
                }))}
            />
        </Dialog>
    );
};
