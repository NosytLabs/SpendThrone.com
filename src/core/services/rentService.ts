import { 
  Connection, 
  PublicKey, 
  Transaction, 
  TransactionInstruction,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createCloseAccountInstruction } from '@solana/spl-token';
import { getRpcUrl, getTreasuryAddress } from '@/core/constants/endpoints';
import { debugWarn, logError } from '@/shared/utils/logger';

export type SacrificeCandidate = {
  pubkey: PublicKey;
  mint: string;
  rentAmount: number; // in SOL
};

export class RentService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(getRpcUrl());
  }

  /**
   * Scans a wallet for empty token accounts (candidates for sacrifice).
   * @param walletPubKey The user's public key.
   * @returns List of accounts that can be closed.
   */
  async scanSacrifices(walletPubKey: PublicKey): Promise<SacrificeCandidate[]> {
    try {
      const accounts = await this.connection.getParsedTokenAccountsByOwner(
        walletPubKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      const candidates: SacrificeCandidate[] = [];

      for (const { pubkey, account } of accounts.value) {
        const parsedInfo = account.data.parsed.info;
        const amount = parsedInfo.tokenAmount.uiAmount;
        
        // We only want empty accounts. 
        // If there is "Dust" (e.g. 0.000001), user should use the Swap feature instead.
        // This tool is strictly for "Rent Reclamation".
        if (amount === 0) {
           // Calculate rent (standard token account size is 165 bytes)
           // We can precise this fetch, or estimate. Fetching every account rent is slow.
           // Standard rent for 165 bytes is ~0.00203928 SOL.
           // Let's use a conservative estimate or fetch if needed. 
           // For UX speed, we will estimate, but for the actual value we rely on the network.
           // Let's fetch the balance of the account itself (which IS the rent).
           const balanceLamports = await this.connection.getBalance(pubkey);
           
           candidates.push({
             pubkey: pubkey,
             mint: parsedInfo.mint,
             rentAmount: balanceLamports / LAMPORTS_PER_SOL
           });
        }
      }

      return candidates;

    } catch (error) {
      logError('Failed to scan for sacrifices:', error);
      return [];
    }
  }

  /**
   * Closes selected accounts and sends the rent to the Treasury.
   * @param wallet The wallet adapter object.
   * @param accountsToClose List of accounts to sacrifice.
   */
  async executeSacrifice(
    wallet: { publicKey: PublicKey; signTransaction: (tx: Transaction) => Promise<Transaction> },
    accountsToClose: SacrificeCandidate[],
    onStatusUpdate?: (status: string) => void
  ): Promise<{ signature: string; totalReclaimed: number }> {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected');
    }

    const treasuryAddr = getTreasuryAddress();
    if (!treasuryAddr) {
        throw new Error('Treasury address not configured');
    }
    const treasuryPubKey = new PublicKey(treasuryAddr);

    if (accountsToClose.length === 0) {
        throw new Error('No accounts selected for sacrifice');
    }

    const transaction = new Transaction();
    let totalReclaimed = 0;

    // Batch instructions. 
    // Note: Transactions have a size limit (1232 bytes). 
    // A CloseInstruction is small (~40 bytes). We can fit ~20-25 in a tx comfortably.
    // If there are too many, we might need to strictly limit or batch them.
    // For MVP, let's cap at 20 accounts per transaction to be safe.
    
    const BATCH_LIMIT = 20;
    const batch = accountsToClose.slice(0, BATCH_LIMIT);

    if (accountsToClose.length > BATCH_LIMIT) {
        debugWarn(`Capping sacrifice at ${BATCH_LIMIT} accounts for transaction safety.`);
    }

    for (const acc of batch) {
        totalReclaimed += acc.rentAmount;
        
        // createCloseAccountInstruction(account, destination, owner)
        // CRITICAL MAGIC: We set the 'destination' to the Treasury!
        transaction.add(
            createCloseAccountInstruction(
                acc.pubkey,       // Account to close
                treasuryPubKey,   // Destination for Rent (The Throne)
                wallet.publicKey  // Owner authority
            )
        );
    }

    // Add Memo for on-chain proof
    transaction.add(
        new TransactionInstruction({
            keys: [{ pubkey: wallet.publicKey, isSigner: true, isWritable: true }],
            programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcQb'),
            data: Buffer.from(`Sacrificed ${batch.length} accounts to SpendThrone`, 'utf-8'),
        })
    );

    try {
        onStatusUpdate?.('Signing Sacrifice...');
        
        const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;

        const signedTx = await wallet.signTransaction(transaction);
        
        onStatusUpdate?.('Burning Accounts...');
        const signature = await this.connection.sendRawTransaction(signedTx.serialize());

        onStatusUpdate?.('Confirming...');
        await this.connection.confirmTransaction({
             signature,
             blockhash,
             lastValidBlockHeight
        });

        // Track in Leaderboard
        try {
            const { trackDeposit } = await import('@/core/services/depositService');
            // We count the Rent Reclaimed (SOL) as the contribution
            // We need the SOL Price to convert to USD for ranking.
            // depositService handles USD conversion if we pass 'SOL' as token?
            // Actually trackDeposit takes (amount, tokenSymbol, ..., usdValue).
            // We should get price.
            const { priceService } = await import('@/core/services/priceService');
            const solPrice = await priceService.getTokenPrice('SOL');
            const usdValue = totalReclaimed * (solPrice || 0);

            await trackDeposit(
                wallet.publicKey.toString(),
                totalReclaimed,
                'SOL',
                signature,
                usdValue,
                'Sacrifice'
            );
        } catch (e) {
            debugWarn('Failed to update leaderboard after sacrifice', e);
        }

        return { signature, totalReclaimed };

    } catch (error) {
        logError('Sacrifice failed:', error);
        throw error;
    }
  }
}

export const rentService = new RentService();
