# Gap Analysis & Feature Status

## 1. Critical Features
*   ✅ **Database Leaderboard**: Implemented. Real data mode active.
*   ✅ **Indexer / Webhook**: Implemented (`api/webhooks/helius.ts`). Verified Memo ID.
*   ✅ **Blink Integration**: Verified. CORS headers added to `vercel.json`. `api/actions/join.ts` matches V1 Spec.
*   ✅ **Transaction History**: Implemented. `databaseService.getTransactions` now fetches real on-chain history from Supabase (populated by Helius webhook).
*   ✅ **Dynamic Achievements**: Implemented. Users now automatically unlock badges based on activity (Whale, Loyal Subject, etc.).
*   ✅ **On-Chain Referrals**: Implemented. Webhook now parses `Ref:` memo and updates `referrals` table. Frontend displays real stats.
*   ✅ **Mobile Swipe-to-Pay**: Implemented. `SwipeButton.tsx` added to `PaymentModal` for mobile viewports.

## 2. High Priority Features
*   ⬜ **Mobile Swipe-to-Pay**: Planned.
*   ⬜ **Token Badges**: NFT/SBT rewards.
*   ⬜ **Admin Dashboard**: For managing bans/featured users.

## 4. Security & Cleanup
*   ⚠️ **npm audit**: Found vulnerabilities (High: `bigint-buffer`).
*   ⚠️ **Unused Deps**: `react-qr-reader` removed but peer deps warnings remain.

## 5. Next Actions
1.  **Deploy Webhook**: User needs to add env vars to Vercel and set up Helius.
2.  **Verify Blink**: Ensure `api/actions/join.ts` works end-to-end.
3.  **Fix Vulnerabilities**: Run `npm audit fix` or upgrade packages.
4.  **ZCash Migration**: DEPRECATED. Decision made to stick with Solana (see `ZCASH_MIGRATION_ANALYSIS.md`).
