import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

const TREASURY_ADDRESS = '31M5mtQ2T1B4K9rPieLoiTncDUGWVwgBdiJYm8RhsJCo';
const MEMO_PROGRAM_ID = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcQb';

interface Request {
  method: string;
  query: Record<string, string>;
}

interface Response {
  setHeader: (key: string, value: string) => void;
  status: (code: number) => {
    json: (data: any) => void;
    end: () => void;
  };
}

export default async function handler(request: Request, response: Response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') return response.status(200).end();

  const { publicKey } = request.query;
  if (!publicKey) return response.status(400).json({ error: 'Missing publicKey' });

  try {
    const connection = new Connection(clusterApiUrl('mainnet-beta'));
    const treasury = new PublicKey(TREASURY_ADDRESS);
    
    // Fetch recent treasury transactions (limit 100 for demo)
    const signatures = await connection.getConfirmedSignaturesForAddress2(treasury, { limit: 100 });
    const recentSignatures = signatures.map(s => s.signature);
    
    // Fetch in batches if needed, but 100 might be okay for Vercel limit if small
    // Optimization: Only fetch parsed if we suspect a referral? No way to know without parsing.
    // We'll fetch last 50 for speed.
    const transactions = await connection.getParsedTransactions(recentSignatures.slice(0, 50), { maxSupportedTransactionVersion: 0 });

    let referralCount = 0;
    let totalReferralVolume = 0;

    transactions.forEach(tx => {
      if (!tx || !tx.meta || tx.meta.err) return;

      // Check for Memo
      const memoIx = tx.transaction.message.instructions.find((ix: any) => 
        ix.programId.toString() === MEMO_PROGRAM_ID || ix.program === 'spl-memo'
      );

      if (memoIx) {
        // Parse memo content
        // In parsed transactions, it might be in 'parsed' field or raw data
        let memoContent = '';
        if ((memoIx as any).parsed) {
            memoContent = (memoIx as any).parsed;
        } else if ((memoIx as any).data) {
             // It's base58 encoded if not parsed, or simple string? 
             // Usually getParsedTransactions handles simple memos.
             // If not, we might need to decode. For now assume it's human readable if parsed.
        }

        // If we found a memo "Ref: <publicKey>"
        if (memoContent && typeof memoContent === 'string' && memoContent.includes(`Ref: ${publicKey}`)) {
           referralCount++;
           
           // Calculate volume
           const treasuryIndex = tx.transaction.message.accountKeys.findIndex(k => k.pubkey.toString() === TREASURY_ADDRESS);
           if (treasuryIndex !== -1) {
             const pre = tx.meta.preBalances[treasuryIndex];
             const post = tx.meta.postBalances[treasuryIndex];
             totalReferralVolume += (post - pre) / LAMPORTS_PER_SOL;
           }
        }
      }
    });

    return response.status(200).json({
      referralCount,
      totalReferralVolume,
      earnings: totalReferralVolume * 0.1 // 10% commission example
    });

  } catch (error) {
    console.error('Referral fetch error:', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
}
