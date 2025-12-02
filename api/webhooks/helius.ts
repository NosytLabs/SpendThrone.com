import { supabaseAdmin } from '../utils/supabaseAdmin';

// Constants
const HELIUS_AUTH_HEADER = process.env.HELIUS_WEBHOOK_SECRET; // We should verify this if set

interface Request {
  method: string;
  headers: Record<string, string>;
  body: any;
}

interface Response {
  status: (code: number) => {
    json: (data: any) => void;
    send: (data: string) => void;
  };
}

export default async function handler(request: Request, response: Response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // Security check (optional but recommended)
  if (HELIUS_AUTH_HEADER && request.headers['authorization'] !== HELIUS_AUTH_HEADER) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  const events = request.body;

  if (!events || !Array.isArray(events)) {
    return response.status(400).json({ error: 'Invalid payload' });
  }

  try {
    console.log(`Received ${events.length} webhook events`);

    for (const event of events) {
      // Helius "Enhanced Transactions" or "Raw Transactions"
      // We assume "Enhanced" for easier parsing, but check type
      if (event.type === 'TRANSFER' || event.type === 'SWAP' || event.description) {
        await processTransaction(event);
      }
    }

    return response.status(200).json({ message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
}

async function processTransaction(tx: any) {
  if (!supabaseAdmin) {
    console.error('Supabase not configured');
    return;
  }

  // Extract data
  // Note: Helius payload structure varies by transaction type
  // This is a simplified parser for demonstration.
  // You need to adjust based on exact Helius Enhanced Transaction response.
  
  const signature = tx.signature;
  const timestamp = tx.timestamp; // Unix timestamp
  
  // Basic "Native Transfer" extraction
  let sender = '';
  let amount = 0;
  let token = 'SOL';
  let usdValue = 0; // We might need to fetch price or use what Helius provides (sometimes they provide amount in USD)

  // Attempt to parse token transfers
  if (tx.tokenTransfers && tx.tokenTransfers.length > 0) {
      // Look for transfers TO our treasury
      const treasuryAddress = process.env.TREASURY_ADDRESS || process.env.VITE_TREASURY_ADDRESS;
      const transfer = tx.tokenTransfers.find((t: any) => t.toUserAccount === treasuryAddress);
      
      if (transfer) {
          sender = transfer.fromUserAccount;
          amount = transfer.tokenAmount;
          token = transfer.mint; // This is mint address, ideally we want symbol
          // We might need a mapping or lookup here if we want symbols
      }
  } 
  // Attempt to parse native SOL transfers
  else if (tx.nativeTransfers && tx.nativeTransfers.length > 0) {
      const treasuryAddress = process.env.TREASURY_ADDRESS || process.env.VITE_TREASURY_ADDRESS;
      const transfer = tx.nativeTransfers.find((t: any) => t.toUserAccount === treasuryAddress);
      
      if (transfer) {
          sender = transfer.fromUserAccount;
          amount = transfer.amount / 1e9; // Lamports to SOL
          token = 'SOL';
      }
  }

  if (!sender || amount <= 0) {
      console.log(`Skipping irrelevant transaction: ${signature}`);
      return;
  }

  console.log(`Processing deposit: ${amount} ${token} from ${sender}`);

  // Ensure user exists
  // We use RPC call to our own Supabase
  // Since we are admin, we can just upsert
  const { error: userError } = await supabaseAdmin
      .from('users')
      .upsert({ 
          wallet_address: sender,
          last_active: new Date().toISOString()
      }, { onConflict: 'wallet_address' });

  if (userError) console.error('Error upserting user:', userError);

  // Insert Transaction
  const { error: txError } = await supabaseAdmin
      .from('transactions')
      .insert({
          signature: signature,
          user_id: sender,
          amount: amount,
          amount_sol: token === 'SOL' ? amount : 0,
          transaction_type: 'deposit',
          token_symbol: token,
          usd_value: usdValue, // Ideally calculate this
          created_at: new Date(timestamp * 1000).toISOString()
      });

  if (txError) {
      if (txError.code === '23505') { // Unique violation
          console.log('Transaction already processed');
          return;
      }
      console.error('Error inserting transaction:', txError);
  }

  // Update Leaderboard (RPC call to database function if possible, or raw update)
  // We can reuse the logic: Upsert leaderboard
  // NOTE: Ideally we use a Postgres function `increment_leaderboard_stats` we created in migration
  const { error: lbError } = await supabaseAdmin.rpc('increment_leaderboard_stats', {
      p_wallet_address: sender,
      p_usd_value: usdValue || amount * 150, // FALLBACK PRICE if 0. TODO: Fetch real price
      p_display_name: null,
      p_message: null,
      p_link: null
  });

  if (lbError) console.error('Error updating leaderboard:', lbError);
}
