import React, { useState } from 'react';
import { Button, RoyalIcon } from '@/components/ui';
import { rentService, SacrificeCandidate } from '@/core/services/rentService';
import { useWallet } from '@solana/wallet-adapter-react';
import { formatAmount } from '@/shared/utils/formatting/currency';

import strings from '@/locales/strings.json';
import { Analytics, EVENTS } from '@/shared/services/analytics';

interface SacrificeViewProps {
    onSuccess: (amount: number, tx: string) => void;
}

export const SacrificeView: React.FC<SacrificeViewProps> = ({ onSuccess }) => {
    const wallet = useWallet();
    const [candidates, setCandidates] = useState<SacrificeCandidate[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [isBurning, setIsBurning] = useState(false);
    const [hasScanned, setHasScanned] = useState(false);
    const [status, setStatus] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleScan = async () => {
        if (!wallet.publicKey) return;
        setIsScanning(true);
        setStatus(strings.sacrifice.scanning);
        Analytics.track(EVENTS.SACRIFICE.SCAN);
        setError(null);
        try {
            const results = await rentService.scanSacrifices(wallet.publicKey);
            setCandidates(results);
            setHasScanned(true);
        } catch (e) {
            setError('Failed to scan wallet.');
        } finally {
            setIsScanning(false);
            setStatus('');
        }
    };

    const handleBurn = async () => {
        if (!wallet.publicKey || !wallet.signTransaction || candidates.length === 0) return;
        setIsBurning(true);
        setError(null);
        try {
            const { signature, totalReclaimed } = await rentService.executeSacrifice(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                wallet as any,
                candidates,
                (s) => setStatus(s)
            );
            Analytics.track(EVENTS.SACRIFICE.BURN, { count: candidates.length, reclaimed: totalReclaimed, txId: signature });
            onSuccess(totalReclaimed, signature);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Sacrifice failed');
        } finally {
            setIsBurning(false);
            setStatus('');
        }
    };

    const totalRent = candidates.reduce((sum, c) => sum + c.rentAmount, 0);

    return (
        <div className="space-y-6 py-4 animate-in fade-in duration-500">
             <div className="text-center space-y-2">
                <RoyalIcon variant="flame" size={48} className="mx-auto text-orange-500 animate-pulse delay-75" />
                <h3 className="text-xl font-cinzel text-accent-primary">{strings.sacrifice.title}</h3>
                <p className="text-sm text-text-secondary">{strings.sacrifice.subtitle}</p>
            </div>

            {!hasScanned ? (
                <div className="flex justify-center py-4">
                    <Button 
                        onClick={handleScan} 
                        disabled={isScanning || !wallet.connected}
                        className="w-full h-12 relative overflow-hidden group royal-hover-lift royal-border-glow"
                        variant="outline"
                    >
                        {isScanning ? (
                            <span className="flex items-center gap-2">
                                <RoyalIcon variant="refresh" className="animate-spin text-accent-primary" /> Scanning...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <RoyalIcon variant="search" /> {strings.sacrifice.scan_btn}
                            </span>
                        )}
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {candidates.length > 0 ? (
                        <div className="royal-glass bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 text-center animate-scale-in">
                            <div className="text-2xl font-bold text-orange-400 mb-1 royal-heading-glow">
                                {formatAmount(totalRent, 4)} SOL
                            </div>
                            <div className="text-sm text-text-secondary">
                                Reclaimable from <span className="text-white font-bold">{candidates.length}</span> dead accounts.
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-text-muted py-4 border border-dashed border-border rounded-lg bg-black/20">
                            {strings.sacrifice.no_accounts}
                        </div>
                    )}

                    {candidates.length > 0 && (
                        <Button 
                            onClick={handleBurn}
                            disabled={isBurning}
                            variant="primary" 
                            className="w-full py-6 text-lg font-cinzel font-bold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 border-none shadow-lg shadow-orange-900/20 royal-shimmer-btn"
                        >
                            {isBurning ? (
                                <span className="flex items-center gap-2">
                                     <RoyalIcon variant="flame" className="animate-bounce" /> Burning...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <RoyalIcon variant="trash" /> {strings.sacrifice.burn_btn}
                                </span>
                            )}
                        </Button>
                    )}
                    
                    <p className="text-xs text-center text-text-muted/60 mt-2">
                        {strings.sacrifice.burn_desc}
                    </p>
                </div>
            )}

            {status && (
                <div className="text-center text-sm text-accent-primary animate-pulse">
                    {status}
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 text-sm text-red-500 flex items-center gap-2 justify-center">
                    <RoyalIcon variant="warning" size={16} />
                    {error}
                </div>
            )}

            <div className="text-center pt-2 border-t border-border-primary/20">
                <p className="text-xs text-text-muted">
                    Want to liquidate active tokens? <br/>
                    Switch to <b>Pay Tribute</b>, select the token, and click <b>MAX</b>.
                </p>
            </div>
        </div>
    );
};
