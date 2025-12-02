import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';
import { DEFAULT_TREASURY } from '../../src/core/constants/endpoints';

// Constants
const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS || process.env.VITE_TREASURY_ADDRESS || DEFAULT_TREASURY;
// Assuming the domain is where it's hosted, but for icon we need absolute URL.
// Using a placeholder that points to the likely production URL or relative if supported (Blinks usually need absolute).
const BASE_URL = 'https://spendthrone.com'; 
const DEFAULT_ICON = `${BASE_URL}/favicon.svg`;

interface Request {
  method: string;
  query: Record<string, string>;
  body: any;
}

interface Response {
  setHeader: (key: string, value: string) => void;
  status: (code: number) => {
    json: (data: any) => void;
    end: () => void;
  };
}

export default async function handler(request: Request, response: Response) {
  // CORS Headers - Required for Blinks
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Encoding, Accept-Encoding');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    if (request.method === 'GET') {
      return handleGet(request, response);
    } else if (request.method === 'POST') {
      return await handlePost(request, response);
    } else {
      return response.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in Blink handler:', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
}

function handleGet(request: Request, response: Response) {
  const { ref } = request.query;
  const refParam = ref ? `&ref=${ref}` : '';
  const baseHref = `/api/actions/join`;

  const payload = {
    title: "Join SpendThrone History",
    icon: DEFAULT_ICON,
    description: "Immortalize your status on the blockchain. Join 5,000 years of history. Pay tribute to rank up.",
    label: "Pay Tribute",
    links: {
      actions: [
        {
          label: "0.05 SOL",
          href: `${baseHref}?amount=0.05${refParam}`,
        },
        {
          label: "0.1 SOL",
          href: `${baseHref}?amount=0.1${refParam}`,
        },
        {
          label: "0.5 SOL",
          href: `${baseHref}?amount=0.5${refParam}`,
        },
        {
          label: "Custom Amount",
          href: `${baseHref}?amount={amount}${refParam}`,
          parameters: [
            {
              name: "amount",
              label: "Enter SOL amount",
              required: true
            }
          ]
        }
      ]
    }
  };

  return response.status(200).json(payload);
}

async function handlePost(request: Request, response: Response) {
  const { account } = request.body;
  const { amount, ref } = request.query;

  if (!account) {
    return response.status(400).json({ error: 'Account is required' });
  }

  // Parse amount
  let solAmount = 0.05; // Default
  if (amount) {
    const parsed = parseFloat(amount);
    if (!isNaN(parsed) && parsed > 0) {
      solAmount = parsed;
    }
  }

  // Use mainnet-beta. In production, use a private RPC for reliability.
  const rpcUrl = process.env.RPC_ENDPOINT || clusterApiUrl('mainnet-beta');
  const connection = new Connection(rpcUrl);

  try {
    const sender = new PublicKey(account);
    const treasury = new PublicKey(TREASURY_ADDRESS);

    const transaction = new Transaction();
    
    // Add transfer instruction
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: treasury,
        lamports: Math.round(solAmount * LAMPORTS_PER_SOL), // Ensure integer lamports
      })
    );
    
    // Add Referral Memo if present
    if (ref) {
      try {
        // Simple Memo: "Ref: <address>"
        const memoContent = `Ref: ${ref}`;
        transaction.add(
          new TransactionInstruction({
            keys: [{ pubkey: sender, isSigner: true, isWritable: true }],
            data: Buffer.from(memoContent, 'utf-8'),
            programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcQb"),
          })
        );
      } catch (e) {
        console.warn("Invalid ref key or memo error", e);
      }
    }
    
    transaction.feePayer = sender;
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    }).toString('base64');

    return response.status(200).json({
      transaction: serializedTransaction,
      message: `Paying ${solAmount} SOL tribute to SpendThrone`,
    });
  } catch (err) {
    console.error('Transaction creation failed:', err);
    return response.status(400).json({ error: 'Failed to create transaction', details: (err as Error).message });
  }
}
