import { 
  Connection, 
  PublicKey, 
  Transaction, 
  VersionedTransaction, 
  TransactionInstruction,
  TransactionMessage,
  AddressLookupTableAccount,
  SystemProgram,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { Buffer } from 'buffer';
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { SYMBOL_TO_MINT } from '@/core/constants/tokens';
import { resolveJupiterApiUrl, getRpcUrl, JUPITER_TOKENS_CACHE, isRpcEnabled } from '@/core/constants/endpoints';
import { debugWarn, logError } from '@/shared/utils/logger';

// Types for legacy/local deposit records
type LegacyBurn = {
  id: string;
  amount: number;
  usdValue: number;
  timestamp: number;
  token: string;
  walletAddress?: string;
  txHash: string;
  status: string;
};

export type DepositRecord = {
  id: string;
  amount: number;
  usdValue: number;
  timestamp: number;
  originalToken: string;
  walletAddress: string;
  txHash: string;
  status: string;
};
import { priceService } from '@/core/services/priceService';
import { apiService } from '@/core/api-service';
import { getTreasuryAddress } from '@/core/constants/endpoints';

// Use centralized constants for mint addresses

// Minimal types to avoid any usage while keeping external API flexible
type TokenInfo = {
  address: string;
  symbol?: string;
  name?: string;
  decimals?: number;
  logoURI?: string;
};

export type FeeInfo = { amount: number; mint: string };

export type QuoteResult = {
  inputAmount: number;
  outputAmount: number;
  priceImpact: number;
  fees: FeeInfo[];
  route: unknown;
  slippage: number;
  marketInfos?: unknown[];
  routePlan?: unknown[];
};

type WalletLike = {
  connected: boolean;
  publicKey?: { toString(): string } | PublicKey;
  signTransaction(tx: Transaction | VersionedTransaction): Promise<Transaction | VersionedTransaction>;
};

type CacheEntry = { data: TokenInfo; timestamp: number };

class SwapService {
  private connection: Connection;
  private apiUrl: string;
  private apiKey: string;
  private tokenCache: Map<string, CacheEntry>;

  constructor() {
    // Initialize connection, but gate all RPC operations behind isRpcEnabled()
    this.connection = new Connection(getRpcUrl());
    this.apiUrl = resolveJupiterApiUrl(import.meta.env.VITE_JUPITER_API_URL);
    const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};
    this.apiKey = import.meta.env.VITE_JUPITER_API_KEY || metaEnv.REACT_APP_JUPITER_API_KEY || '';
    this.tokenCache = new Map();
  }

  isApiKeyValid() {
    const key = String(this.apiKey || '').trim();
    if (!key) return false;
    const lower = key.toLowerCase();
    const looksLikePlaceholder = lower.includes('your') && lower.includes('key');
    return !looksLikePlaceholder;
  }

  getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.isApiKeyValid()) {
      headers['x-api-key'] = this.apiKey;
    }
    
    return headers;
  }

  async getQuote(inputToken: string, outputToken: string, amount: number, slippageBps: number = 100, platformFeeBps: number = 50): Promise<QuoteResult> {
    try {
      if (!this.isApiKeyValid()) {
        throw new Error('Jupiter API key missing or invalid. Set VITE_JUPITER_API_KEY to use swap quotes.');
      }
      // Get token info to determine decimals
      const inputTokenInfo = await this.getTokenInfo(inputToken);
      const outputTokenInfo = await this.getTokenInfo(outputToken);
      
      const inputDecimals = inputTokenInfo?.decimals || 9;
      const outputDecimals = outputTokenInfo?.decimals || 6;
      
      // Convert amount to smallest unit
      const amountInSmallestUnit = Math.floor(amount * Math.pow(10, inputDecimals));
      
      const params = new URLSearchParams({
        inputMint: inputToken,
        outputMint: outputToken,
        amount: amountInSmallestUnit.toString(),
        slippageBps: slippageBps.toString(),
        onlyDirectRoutes: 'false',
        asLegacyTransaction: 'false',
        platformFeeBps: platformFeeBps.toString(),
      });

      const url = `${this.apiUrl}/quote?${params}`;
      const headers = this.getHeaders();
      type JupiterQuoteResponse = {
        outAmount?: string;
        priceImpactPct?: number;
        routePlan?: Array<{ swapInfo?: { feeAmount?: number | string; feeMint?: string } }>;
        marketInfos?: unknown[];
      };
      const quoteData = await apiService.get<JupiterQuoteResponse>(url, { headers });
      
      if (!quoteData || !quoteData.outAmount) {
        throw new Error('No valid quote received from Jupiter');
      }

      return {
        inputAmount: amount,
        outputAmount: parseInt(String(quoteData.outAmount || '0')) / Math.pow(10, outputDecimals),
        priceImpact: quoteData.priceImpactPct || 0,
        fees: quoteData.routePlan?.map((step) => ({
          amount: Number(step.swapInfo?.feeAmount ?? 0),
          mint: step.swapInfo?.feeMint || '',
        })) || [],
        route: quoteData,
        slippage: slippageBps / 100,
        marketInfos: quoteData.marketInfos || [],
        routePlan: quoteData.routePlan || [],
      };
    } catch (error) {
      logError('Error getting swap quote:', error);
      throw new Error(`Failed to get swap quote: ${(error as Error).message}`);
    }
  }

  async executeSwap(quote: QuoteResult, wallet: WalletLike, onStatusUpdate: ((status: string) => void) | null = null): Promise<{ txid: string; inputAmount: number; outputAmount: number; success: boolean; confirmation: { value?: { err?: unknown } } } > {
    try {
      if (!isRpcEnabled()) {
        throw new Error('RPC is disabled. Swaps are unavailable at the moment.');
      }
      if (!this.isApiKeyValid()) {
        throw new Error('Jupiter API key missing or invalid. Set VITE_JUPITER_API_KEY to execute swaps.');
      }
      if (!wallet.connected || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      onStatusUpdate?.('Preparing swap transaction...');

      // Determine fee account (Treasury USDC ATA)
      let feeAccount: string | undefined;
      try {
        const treasuryAddr = getTreasuryAddress();
        if (treasuryAddr) {
            // Assume output is USDC as per business logic
            const usdcMint = new PublicKey(SYMBOL_TO_MINT.USDC);
            const treasuryPubkey = new PublicKey(treasuryAddr);
            const ata = await getAssociatedTokenAddress(usdcMint, treasuryPubkey);
            feeAccount = ata.toString();
        }
      } catch (e) {
        debugWarn('Failed to derive fee account', e);
      }

      // Get swap transaction from Jupiter Ultra API
      const url = `${this.apiUrl}/swap`;
      const headers = this.getHeaders();
      const body = {
        quoteResponse: quote.route,
        userPublicKey: wallet.publicKey.toString(),
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
        prioritizationFeeLamports: 'auto',
        feeAccount,
        dynamicSlippage: {
          maxBps: Math.max(quote.slippage * 100, 300), // Minimum 3% slippage
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const { swapTransaction } = await response.json();
      
      if (!swapTransaction) {
        throw new Error('No swap transaction received from Jupiter');
      }

      onStatusUpdate?.('Signing transaction...');

      // Deserialize and sign the transaction
      const transactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(transactionBuf);
      
      // Add extra gas fee (SOL) to treasury
      try {
        const treasuryAddr = getTreasuryAddress();
        if (treasuryAddr) {
          onStatusUpdate?.('Adding treasury fee...');
          const addressLookupTableAccounts: AddressLookupTableAccount[] = [];
          const { addressTableLookups } = transaction.message;

          if (addressTableLookups.length > 0) {
            const lookupPromises = addressTableLookups.map(lookup => 
              this.connection.getAddressLookupTable(lookup.accountKey)
                .then(res => res.value)
            );
            const lookups = await Promise.all(lookupPromises);
            lookups.forEach(lookup => {
              if (lookup) addressLookupTableAccounts.push(lookup);
            });
          }

          const message = TransactionMessage.decompile(transaction.message, {
            addressLookupTableAccounts
          });

          // Add 0.005 SOL fee (approx $1.00) as requested ("extra gas fee")
          const feeAmount = 0.005 * LAMPORTS_PER_SOL;
          message.instructions.push(
            SystemProgram.transfer({
              fromPubkey: new PublicKey(wallet.publicKey.toString()),
              toPubkey: new PublicKey(treasuryAddr),
              lamports: feeAmount
            })
          );

          // Recompile
          transaction.message = message.compileToV0Message(addressLookupTableAccounts);
        }
      } catch (err) {
        logError('Failed to add treasury gas fee:', err);
        // Continue with original transaction if fee addition fails to avoid blocking the swap
      }

      // Sign the transaction
      const signedTransaction = await wallet.signTransaction(transaction);
      
      onStatusUpdate?.('Sending transaction...');

      // Send the transaction with enhanced options
      const signature = await this.connection.sendRawTransaction(
        signedTransaction.serialize(),
        {
          skipPreflight: false,
          maxRetries: 5,
          preflightCommitment: 'processed',
        }
      );

      onStatusUpdate?.('Confirming transaction...');

      // Enhanced transaction confirmation with timeout
      const confirmation = await Promise.race([
        this.connection.confirmTransaction(signature, 'confirmed'),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Transaction confirmation timeout')), 60000)
        )
      ]) as { value?: { err?: unknown } };

      if (confirmation?.value?.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
      }
      
      onStatusUpdate?.('Transaction confirmed!');

      // Save to local history and reflect in leaderboard
      const solPrice = await priceService.getTokenPrice('SOL');
      const amountSol = quote.outputAmount; // Already normalized to SOL units
      const usdValue = amountSol * (solPrice || 0);
      this.saveLocalDeposit({
        id: signature,
        amount: amountSol,
        usdValue,
        timestamp: Date.now(),
        originalToken: 'SOL',
        walletAddress: wallet.publicKey.toString(),
        txHash: signature,
        status: 'confirmed'
      });
      try {
        const { databaseService } = await import('@/core/services/databaseService');
        await databaseService.upsertLeaderboardEntry(wallet.publicKey.toString(), usdValue, {
          incrementTransactions: true
        });
      } catch (error) {
        // Silently handle leaderboard update failures - don't block the main transaction
        debugWarn('Failed to update leaderboard:', error);
      }

      return {
        txid: signature,
        inputAmount: quote.inputAmount,
        outputAmount: quote.outputAmount,
        success: true,
        confirmation
      };
    } catch (error) {
      logError('Error executing swap:', error);
      onStatusUpdate?.(`Error: ${(error as Error).message}`);
      throw new Error(`Failed to execute swap: ${(error as Error).message}`);
    }
  }

  // Get fallback token info for common tokens when Jupiter API is unavailable
  getFallbackTokenInfo(mintAddress: string) {
    const fallbackTokens: Record<string, TokenInfo> = {
      'So11111111111111111111111111111111111111112': {
        address: 'So11111111111111111111111111111111111111112',
        symbol: 'SOL',
        name: 'Solana',
        decimals: 9,
      },
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': {
        address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
      },
    };
    return fallbackTokens[mintAddress] || null;
  }

  async getTokenInfo(mintAddress: string): Promise<TokenInfo | null> {
    try {
      // Check cache first
      if (this.tokenCache.has(mintAddress)) {
        const cached = this.tokenCache.get(mintAddress);
        if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes cache
          return cached.data;
        }
      }

      const response = await fetch(JUPITER_TOKENS_CACHE);
      
      if (!response.ok) {
        throw new Error(`Jupiter tokens API error: ${response.status}`);
      }
      
      const tokens: TokenInfo[] = await response.json();
      
      // Cache all tokens for future use
      tokens.forEach((token: TokenInfo) => {
        this.tokenCache.set(token.address, {
          data: token,
          timestamp: Date.now()
        });
      });
      
      const tokenData = this.tokenCache.get(mintAddress);
      return tokenData ? tokenData.data : null;
    } catch (error) {
      logError('Error fetching token info:', error);
      return this.getFallbackTokenInfo(mintAddress);
    }
  }

  async getSupportedTokens(): Promise<TokenInfo[]> {
    try {
      const response = await fetch(JUPITER_TOKENS_CACHE);
      
      if (!response.ok) {
        throw new Error(`Jupiter tokens API error: ${response.status}`);
      }
      
      const tokens: TokenInfo[] = await response.json();
      
      // Ensure SOL and USDC are at the top
      const sol = tokens.find(t => t.symbol === 'SOL') || {
        address: 'So11111111111111111111111111111111111111112',
        symbol: 'SOL',
        name: 'Solana',
        decimals: 9,
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
      };
      
      const usdc = tokens.find(t => t.symbol === 'USDC') || {
        address: SYMBOL_TO_MINT.USDC,
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
      };

      // Filter out SOL/USDC from the main list to avoid duplicates
      const otherTokens = tokens.filter(t => t.symbol !== 'SOL' && t.symbol !== 'USDC');

      return [sol, usdc, ...otherTokens];
    } catch (error) {
      logError('Error fetching supported tokens:', error);
      // Return fallback popular tokens when API fails
      return [
        {
          address: 'So11111111111111111111111111111111111111112',
          symbol: 'SOL',
          name: 'Solana',
          decimals: 9,
          logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
        },
        {
          address: SYMBOL_TO_MINT.USDC,
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6,
          logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
        },
        {
          address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
          symbol: 'USDT',
          name: 'Tether USD',
          decimals: 6,
          logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg'
        }
      ];
    }
  }

  // Backward compatibility alias for components using getTokenList
  async getTokenList(): Promise<TokenInfo[]> {
    return this.getSupportedTokens();
  }

  async getTokenToUsdcQuote(tokenMint: string, amount: number): Promise<QuoteResult> {
    if (tokenMint === SYMBOL_TO_MINT.USDC) {
      return {
        inputAmount: amount,
        outputAmount: amount,
        priceImpact: 0,
        fees: [],
        route: null,
        slippage: 0,
      };
    }

    return this.getQuote(tokenMint, SYMBOL_TO_MINT.USDC, amount);
  }

  async getTransactionStatus(signature: string): Promise<{ signature: string; status: unknown; confirmed: boolean; error?: unknown }> {
    try {
      if (!isRpcEnabled()) {
        return { signature, status: null, confirmed: false, error: 'RPC disabled' };
      }
      const status = await this.connection.getSignatureStatus(signature);
      return {
        signature,
        status: status.value,
        confirmed: status.value?.confirmationStatus === 'confirmed' || status.value?.confirmationStatus === 'finalized',
        error: status.value?.err,
      };
    } catch (error) {
      logError('Error getting transaction status:', error);
      return {
        signature,
        status: null,
        confirmed: false,
        error: (error as Error).message,
      };
    }
  }

  async getTokenBalance(walletOrAddress: { publicKey?: PublicKey | null } | string | PublicKey, tokenMintOrSymbol: string) {
    try {
      if (!isRpcEnabled()) {
        return 0;
      }
      // Resolve mint from symbol if needed
      const tokenMint = SYMBOL_TO_MINT[tokenMintOrSymbol] || tokenMintOrSymbol;

      // Resolve public key from wallet or address string
      let ownerPubkey: PublicKey;
      if (typeof walletOrAddress === 'string') {
        ownerPubkey = new PublicKey(walletOrAddress);
      } else if (walletOrAddress instanceof PublicKey) {
        ownerPubkey = walletOrAddress;
      } else if (walletOrAddress && walletOrAddress.publicKey) {
        ownerPubkey = new PublicKey(walletOrAddress.publicKey.toString());
      } else {
        throw new Error('Invalid walletOrAddress');
      }

      if (!ownerPubkey) {
        return 0;
      }

      if (tokenMint === SYMBOL_TO_MINT.SOL) {
        // SOL balance
        const balance = await this.connection.getBalance(ownerPubkey);
        return balance / 1e9; // Convert lamports to SOL
      }

      // SPL token balance
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        ownerPubkey,
        { mint: new PublicKey(tokenMint) }
      );

      if (tokenAccounts.value.length === 0) {
        return 0;
      }

      const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
      return balance || 0;
    } catch (error) {
      logError('Error getting token balance:', error);
      return 0;
    }
  }

  // Bulk balances for convenience
  async getTokenBalances(walletAddress: string, tokenMints?: string[]) {
    try {
      if (!isRpcEnabled()) {
        return {};
      }
      const mints = tokenMints && tokenMints.length > 0
        ? tokenMints.map(m => SYMBOL_TO_MINT[m] || m)
        : (await this.getSupportedTokens()).map(t => t.address);

      const balances: Record<string, number> = {};
      for (const mint of mints) {
        try {
          const bal = await this.getTokenBalance(walletAddress, mint);
          balances[mint] = bal;
        } catch (e) {
          debugWarn('Failed to fetch balance for mint', mint, e);
        }
      }
      return balances;
    } catch (error) {
      logError('Error getting token balances:', error);
      return {};
    }
  }

  getUsdcMint() {
    return SYMBOL_TO_MINT.USDC;
  }

  // Direct USDC deposit to treasury
  async executeDirectDeposit(wallet: WalletLike, amountUsdc: number, onStatusUpdate: ((s: string) => void) | null = null, memo?: string) {
    try {
      if (!isRpcEnabled()) {
        throw new Error('RPC is disabled. Direct deposits are unavailable at the moment.');
      }
      if (!wallet?.connected || !wallet?.publicKey) {
        throw new Error('Wallet not connected');
      }

      const treasuryAddress = getTreasuryAddress();
      if (!treasuryAddress) {
        throw new Error('Treasury wallet address is not configured');
      }

      const owner = wallet.publicKey as PublicKey;
      const treasuryPubkey = new PublicKey(treasuryAddress);
      const usdcMint = new PublicKey(SYMBOL_TO_MINT.USDC);

      const amountInBaseUnits = Math.floor(amountUsdc * 1e6); // USDC has 6 decimals

      onStatusUpdate?.('Preparing USDC transfer...');

      // Resolve destination treasury USDC ATA
      const treasuryUsdcAccountStr = (import.meta.env.VITE_TREASURY_USDC_ACCOUNT || import.meta.env.REACT_APP_TREASURY_USDC_ACCOUNT);
      const destinationAta = treasuryUsdcAccountStr
        ? new PublicKey(treasuryUsdcAccountStr)
        : await getAssociatedTokenAddress(usdcMint, treasuryPubkey);

      // Resolve source (user) USDC ATA
      const sourceAta = await getAssociatedTokenAddress(usdcMint, owner);

      // Build transfer instruction
      const transferIx = createTransferInstruction(
        sourceAta,
        destinationAta,
        owner,
        amountInBaseUnits,
        [],
        TOKEN_PROGRAM_ID,
      );

      const tx = new Transaction();
      
      // Add Memo if provided
      if (memo) {
        const memoIx = new TransactionInstruction({
          keys: [{ pubkey: owner, isSigner: true, isWritable: true }],
          programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcQb'),
          data: Buffer.from(memo, 'utf-8'),
        });
        tx.add(memoIx);
      }

      tx.add(transferIx);
      tx.feePayer = owner;
      const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;

      onStatusUpdate?.('Signing USDC transfer...');
      const signed = await wallet.signTransaction(tx);

      onStatusUpdate?.('Sending transaction...');
      const signature = await this.connection.sendRawTransaction(signed.serialize(), {
        skipPreflight: false,
        maxRetries: 5,
        preflightCommitment: 'processed',
      });

      onStatusUpdate?.('Confirming transaction...');
      const confirmation = await this.connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed');

      if (confirmation.value.err) {
        throw new Error(`USDC transfer failed: ${JSON.stringify(confirmation.value.err)}`);
      }

      onStatusUpdate?.('Deposit confirmed!');

      // Save to local history
      const deposit = {
        id: signature,
        amount: amountUsdc,
        usdValue: amountUsdc, // USDC is 1:1
        timestamp: Date.now(),
        originalToken: 'USDC',
        walletAddress: owner.toString(),
        txHash: signature,
        status: 'confirmed'
      };
      this.saveLocalDeposit(deposit);
      try {
        const { databaseService } = await import('@/core/services/databaseService');
        await databaseService.upsertLeaderboardEntry(owner.toString(), deposit.usdValue, { incrementTransactions: true, message: memo });
      } catch (error) {
        // Silently handle leaderboard update failures - don't block the main transaction
        debugWarn('Failed to update leaderboard:', error);
      }

      return signature;
    } catch (error: unknown) {
      logError('Error executing direct deposit:', error);
      const msg = error instanceof Error ? error.message : String(error);
      onStatusUpdate?.(`Error: ${msg}`);
      throw new Error(`Failed to execute direct deposit: ${msg}`);
    }
  }

  // Save deposit to local storage for immediate UI feedback
  saveLocalDeposit(deposit: DepositRecord) {
    try {
      // Get ALL current deposits from storage (unfiltered) to avoid overwriting other users' data
      const raw = JSON.parse(localStorage.getItem('userDeposits') || '[]') as DepositRecord[];
      
      // Deduplicate by txHash
      if (raw.some(d => d.txHash === deposit.txHash)) return;
      
      const updated = [deposit, ...raw];
      localStorage.setItem('userDeposits', JSON.stringify(updated));
    } catch (e) {
      debugWarn('Failed to save user deposit', e);
    }
  }

  // Local deposit history shims until backend routes are available
  getUserDeposits(walletAddress: string) {
    try {
      const userRaw = JSON.parse(localStorage.getItem('userDeposits') || '[]') as unknown;
      if (Array.isArray(userRaw) && userRaw.length) {
        const user = userRaw as DepositRecord[];
        return user.filter((d) => !walletAddress || d.walletAddress === walletAddress);
      }
      // Fallback: legacy burnHistory format
      const burns = (JSON.parse(localStorage.getItem('burnHistory') || '[]') as LegacyBurn[]);
      return burns.map((b) => ({
        id: b.id,
        amount: b.amount,
        usdValue: b.usdValue,
        timestamp: b.timestamp,
        originalToken: b.token,
        walletAddress,
        txHash: b.txHash,
        status: b.status,
      }));
    } catch (e) {
      debugWarn('Failed to load user deposits from localStorage', e);
      return [];
    }
  }

  getAllDeposits() {
    try {
      const allRaw = JSON.parse(localStorage.getItem('allDeposits') || '[]') as unknown;
      if (Array.isArray(allRaw) && allRaw.length) return allRaw as DepositRecord[];
      // Fallback: derive from legacy burnHistory
      const burns = (JSON.parse(localStorage.getItem('burnHistory') || '[]') as LegacyBurn[]);
      return burns.map((b) => ({
        id: b.id,
        amount: b.amount,
        usdValue: b.usdValue,
        timestamp: b.timestamp,
        originalToken: b.token,
        walletAddress: b.walletAddress || 'unknown',
        txHash: b.txHash,
        status: b.status,
      }));
    } catch (e) {
      debugWarn('Failed to load all deposits from localStorage', e);
      return [];
    }
  }

  clearCache() {
    this.tokenCache.clear();
  }
}

const swapServiceInstance = new SwapService();
export default swapServiceInstance;
export const swapService = swapServiceInstance;
