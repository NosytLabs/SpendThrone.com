import { useCallback, useState, useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { APP_CONFIG } from '@/core/constants/appConfig';
import { useDegradedMode } from '@/shared/hooks/useDegradedMode';
import { swapService } from '@/core/services/swapService';
import { priceService } from '@/core/services/priceService';
import { trackDeposit } from '@/core/services/depositService';
import { logError, debugWarn } from '@/shared/utils/logger';

import { TOKENS } from '@/core/constants/tokens';
import { createErrorHandler } from '@/shared/utils/errorHandler';

export const usePayment = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, signTransaction, connected } = useWallet();
  const { isDegraded } = useDegradedMode();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Initialize standardized error handler
  const errorHandler = useMemo(() => createErrorHandler(setError, 'usePayment'), []);

  const payTribute = useCallback(async (tokenSymbol: string, amount: number, tokenMint?: string, message?: string, link?: string) => {
    if (isDegraded) {
      setError('Royal payments are temporarily disabled. Please try again later.');
      setStatusMessage(null);
      return false;
    }
    if (!publicKey || !connected) {
      setError('Wallet not connected');
      return false;
    }

    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return false;
    }

    setIsProcessing(true);
    setError(null);
    setTxSignature(null);
    setStatusMessage('Initiating tribute...');

    try {
      let signature: string | null = null;

      // Case 1: SOL Deposit (Direct Transfer)
      if (tokenSymbol === TOKENS.SOL.SYMBOL) {
        setStatusMessage('Preparing SOL transfer...');
        const treasuryPubkey = new PublicKey(APP_CONFIG.TREASURY_ADDRESS);
        const transaction = new Transaction();
        
        // We do not use the Memo Program on-chain to save costs/complexity
        // The message is tracked in our database via the API call below

        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: treasuryPubkey,
            lamports: Math.floor(amount * LAMPORTS_PER_SOL),
          })
        );

        signature = await sendTransaction(transaction, connection);
        setStatusMessage('Confirming SOL transfer...');
        const latestBlockhash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        });

        // Save local record and update leaderboard
        const solPrice = await priceService.getTokenPrice(TOKENS.SOL.SYMBOL);
        const usdValue = amount * solPrice;
        swapService.saveLocalDeposit({
          id: signature,
          amount: amount,
          usdValue,
          timestamp: Date.now(),
          originalToken: TOKENS.SOL.SYMBOL,
          walletAddress: publicKey.toString(),
          txHash: signature,
          status: 'confirmed'
        });
        // Reflect deposit in database leaderboard when configured
        try {
          await trackDeposit(
             publicKey.toString(),
             amount, // SOL amount
             TOKENS.SOL.SYMBOL,
             signature,
             usdValue,
             message,
             link
           );
        } catch (error) {
          // Silently handle leaderboard update failures - don't block the main payment flow
          debugWarn('Failed to update leaderboard:', error);
        }
      }
      // Case 2: USDC Deposit (Direct Transfer)
      else if (tokenSymbol === TOKENS.USDC.SYMBOL) {
        if (!signTransaction) throw new Error('Wallet does not support signing');
        const walletLike = { connected, publicKey, signTransaction };
        signature = await swapService.executeDirectDeposit(walletLike, amount, setStatusMessage, { message, link });
      }
      // Case 3: SPL Token Swap (Swap to USDC -> Treasury)
      else {
        if (!tokenMint) throw new Error('Token mint address required for swap');
        if (!signTransaction) throw new Error('Wallet does not support signing');

        setStatusMessage(`Getting quote for ${tokenSymbol} -> USDC...`);
        const quote = await swapService.getTokenToUsdcQuote(tokenMint, amount);

        const walletLike = { connected, publicKey, signTransaction };
        const result = await swapService.executeSwap(quote, walletLike, setStatusMessage, { message, link });

        if (!result.success) throw new Error('Swap failed');
        signature = result.txid;
      }

      if (signature) {
        setTxSignature(signature);
        setStatusMessage('Tribute accepted by the Royal Court!');
        return true;
      } else {
        throw new Error('Transaction failed to generate signature');
      }

    } catch (err: unknown) {
      logError('Payment failed:', err);
      // Use standardized error handler
      errorHandler.handleError(err, {
        context: 'payTribute',
        fallbackMessage: 'Transaction failed',
        showToast: true 
      });
      setStatusMessage(null);
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [connection, publicKey, sendTransaction, signTransaction, connected, isDegraded, errorHandler]);

  return {
    payTribute,
    isProcessing,
    error,
    txSignature,
    statusMessage,
    setTxSignature,
    resetState: () => {
      setError(null);
      setTxSignature(null);
      setStatusMessage(null);
    }
  };
};
