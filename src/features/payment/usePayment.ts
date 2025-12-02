import { useCallback, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL, TransactionInstruction } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { APP_CONFIG } from '@/core/constants/appConfig';
import { useDegradedMode } from '@/core/hooks/useDegradedMode';
import { swapService } from '@/core/services/swapService';
import { priceService } from '@/core/services/priceService';
import { logError, debugWarn } from '@/shared/utils/logger';

export const usePayment = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, signTransaction, connected } = useWallet();
  const { isDegraded } = useDegradedMode();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const payTribute = useCallback(async (tokenSymbol: string, amount: number, tokenMint?: string, message?: string) => {
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
      if (tokenSymbol === 'SOL') {
        setStatusMessage('Preparing SOL transfer...');
        const treasuryPubkey = new PublicKey(APP_CONFIG.TREASURY_ADDRESS);
        const transaction = new Transaction();
        
        // Add Memo if provided
        if (message) {
          const memoIx = new TransactionInstruction({
            keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
            programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcQb'),
            data: Buffer.from(message, 'utf-8'),
          });
          transaction.add(memoIx);
        }

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
        const solPrice = await priceService.getTokenPrice('SOL');
        const usdValue = amount * solPrice;
        swapService.saveLocalDeposit({
          id: signature,
          amount: amount,
          usdValue,
          timestamp: Date.now(),
          originalToken: 'SOL',
          walletAddress: publicKey.toString(),
          txHash: signature,
          status: 'confirmed'
        });
        // Reflect deposit in database leaderboard when configured
        try {
          const { databaseService } = await import('@/core/services/databaseService');
          await databaseService.upsertLeaderboardEntry(publicKey.toString(), usdValue, {
            message,
            incrementTransactions: true
          });
        } catch (error) {
          // Silently handle leaderboard update failures - don't block the main payment flow
          debugWarn('Failed to update leaderboard:', error);
        }
      }
      // Case 2: USDC Deposit (Direct Transfer)
      else if (tokenSymbol === 'USDC') {
        if (!signTransaction) throw new Error('Wallet does not support signing');
        const walletLike = { connected, publicKey, signTransaction };
        signature = await swapService.executeDirectDeposit(walletLike, amount, setStatusMessage, message);
      }
      // Case 3: SPL Token Swap (Swap to USDC -> Treasury)
      else {
        if (!tokenMint) throw new Error('Token mint address required for swap');
        if (!signTransaction) throw new Error('Wallet does not support signing');

        setStatusMessage(`Getting quote for ${tokenSymbol} -> USDC...`);
        const quote = await swapService.getTokenToUsdcQuote(tokenMint, amount);

        const walletLike = { connected, publicKey, signTransaction };
        const result = await swapService.executeSwap(quote, walletLike, setStatusMessage);

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
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMessage);
      setStatusMessage(null);
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [connection, publicKey, sendTransaction, signTransaction, connected, isDegraded]);

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
