# Webhook Setup Guide

## Overview
To ensure the leaderboard updates even when users pay via Blinks (Twitter/X) or direct transfers, we use Helius Webhooks to listen for on-chain events.

## Prerequisites
1.  **Helius Account**: Sign up at [helius.dev](https://helius.dev).
2.  **Supabase Project**: Your database must be set up.
3.  **Vercel Project**: Your API routes must be deployed.

## Steps

### 1. Configure Environment Variables
Add the following to your Vercel project environment variables:
*   `SUPABASE_URL`: Your Supabase URL.
*   `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (found in Project Settings > API). **Do not expose this in client-side .env**.
*   `HELIUS_WEBHOOK_SECRET`: A secret string you generate (e.g., a random UUID).
*   `TREASURY_ADDRESS`: The wallet address receiving payments.

### 2. Create Helius Webhook
1.  Go to Helius Dashboard > Webhooks.
2.  Click **"Create Webhook"**.
3.  **Network**: Mainnet Beta.
4.  **Webhook Type**: Enhanced (recommended) or Raw.
5.  **Transaction Types**: `TRANSFER`, `SWAP`.
6.  **Account Addresses**: Add your `TREASURY_ADDRESS`.
7.  **Webhook URL**: `https://your-domain.com/api/webhooks/helius`.
8.  **Auth Header**: Set this to the value of your `HELIUS_WEBHOOK_SECRET`.

### 3. Deploy
Deploy your project to Vercel:
```bash
git push origin main
```

### 4. Verify
1.  Send a small amount of SOL to the Treasury Address.
2.  Check Helius Dashboard logs to see if the webhook fired.
3.  Check Supabase `transactions` and `leaderboard` tables to see if the data appeared.

## Troubleshooting
*   **401 Unauthorized**: Check that `HELIUS_WEBHOOK_SECRET` matches the Auth Header in Helius.
*   **500 Internal Server Error**: Check Vercel Function logs.
*   **No Data**: Ensure the Treasury Address is correct in Helius.
