# Gap Analysis & Feature Status

## 1. Critical Features
*   ✅ **Database Leaderboard**: Implemented. Real data mode active.
*   ✅ **Indexer / Webhook**: Implemented (`api/webhooks/helius.ts`). Pending user deployment & configuration.
*   ❌ **Blink Integration**: Partial. `api/actions/join.ts` exists but needs testing with the new database logic.

## 2. High Priority Features
*   ⬜ **Mobile Swipe-to-Pay**: Planned.
*   ⬜ **Transaction History**: Currently relies on local storage + partial DB. Needs full DB history view.

## 3. Medium Priority Features
*   ⬜ **Token Badges**: NFT/SBT rewards.
*   ⬜ **Admin Dashboard**: For managing bans/featured users.

## 4. Security & Cleanup
*   ⚠️ **npm audit**: Found vulnerabilities (High: `bigint-buffer`).
*   ⚠️ **Unused Deps**: `react-qr-reader` removed but peer deps warnings remain.

## 5. Next Actions
1.  **Deploy Webhook**: User needs to add env vars to Vercel and set up Helius.
2.  **Verify Blink**: Ensure `api/actions/join.ts` works end-to-end.
3.  **Fix Vulnerabilities**: Run `npm audit fix` or upgrade packages.
