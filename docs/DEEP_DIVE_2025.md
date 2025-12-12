# SpendThrone Deep Dive Analysis (2025)

**Generated:** 2025-12-06
**Scope:** Deep Architectural Analysis (Context Level 7)

## 1. Core Architecture: The "Hybrid Truth" Model

SpendThrone operates on a **Hybrid Truth** model where the client is optimistic, but the server (Helius Webhook) is authoritative.

### A. The Optimistic Client (`src/features/payment`)
- **Action:** User signs transaction.
- **Feedback:** App immediately assumes success if signature is generated.
- **State:** Updates local React Context (`useLeaderboard`) to show the user "moving up" instantly.
- **Limitation:** This is ephemeral. A page refresh would lose this if the backend didn't catch it.

### B. The Authoritative Backend (`api/webhooks/helius.ts`)
This is the "Context 7" layer that powers the persistent truth.
1.  **Ingestion:** Receives raw transaction payloads from Helius.
2.  **Parsing:**
    - Detects **SPL Token Transfers** (e.g., USDC, BONK).
    - Detects **Native SOL Transfers**.
    - **Dust Filter:** Ignores transactions < $0.01 USD to prevent leaderboard spam.
3.  **Valuation:**
    - Queries `api.jup.ag/price/v2` for real-time spot prices.
    - Caches prices in-memory (Lambda warm state) for 60 seconds.
4.  **Referral Extraction:**
    - Parses the `Memo` instruction for `Ref: <pubkey>`.
    - *Critical Note:* The referrer cannot be the sender (self-referral prevention).
5.  **Persistence:**
    - **Transactions Table:** Raw log of every valid tribute.
    - **Referrals Table:** Links `referrer` -> `referee`.
    - **Leaderboard Table:** Upserts `total_usd_value` and `transaction_count`.

---

## 2. Realtime & Resiliency Layer

### A. Supabase Realtime Channels
**File:** `src/features/leaderboard/hooks/useLeaderboard.ts`
The frontend does not poll. It subscribes to the database changes triggered by the Webhook.
- **Channel:** `public:leaderboard-changes`
- **Event:** `postgres_changes` (INSERT/UPDATE on `leaderboard` table).
- **Outcome:** When Helius writes to the DB, the DB pushes the update to all connected clients instantly.

### B. Degraded Mode (Circuit Breaker)
**File:** `src/shared/hooks/useDegradedMode.ts`
The app features a robust "Degraded Mode" to handle RPC failures or maintenance.
- **Trigger:** Controlled by `VITE_ENABLE_RPC` env var or automatic RPC failure detection.
- **State:** When active, the app becomes **Read-Only**.
    - Leaderboard: Visible.
    - Payments: Disabled (Buttons grayed out, "Blockchain interactions temporarily disabled").
- **RPC Failover:** Logic in `endpoints.ts` attempts `Helius` -> `Custom RPC` -> `Public Mainnet`.

---

## 3. Database Schema & Hidden Mechanics

### Active Tables (Confirmed via Webhook)
- **`leaderboard`**: The public facing ranking.
    - Columns: `wallet_address`, `total_usd_value`, `transaction_count`, `message`.
    - **RLS Policy:** "Users can update own leaderboard entry" (Authenticated) vs "Anyone can view".
- **`transactions`**: The audit log.
- **`referrals`**: The social graph.

### "Shadow" / Future Schema (`supabase/schema.sql`)
*Analysis of `schema.sql` reveals potential future or legacy features:*
- **Divine Favor:** A view `divine_favor_stats` calculates a score based on:
    - 100 points per direct referral.
    - 1000 points per SOL of referral volume.
    - *Status:* Currently defined in SQL but not actively displayed on the frontend (which uses raw USD value).

---

## 4. Solana Actions (Blinks) Integration

**File:** `api/actions/join.ts`
The app is fully "Blink-Ready" for external integration (e.g., X/Twitter).

- **Endpoints:**
    - `GET`: Returns metadata (icon, title, labels).
    - `POST`: Constructs the unsigned transaction.
- **Capabilities:**
    - **Fixed Tiers:** 0.05, 0.1, 0.5 SOL.
    - **Custom Input:** Users can type any amount.
    - **Referral Injection:** Query param `?ref=...` is automatically baked into the transaction Memo, ensuring Blinks count toward the referral program.

---

## 5. Crypto & Token Handling

**Treasury:** `31M5mtQ2T1B4K9rPieLoiTncDUGWVwgBdiJYm8RhsJCo`

### The Swap Logic (`src/core/services/swapService.ts`)
When a user pays with BONK (or any non-USDC/SOL token):
1.  **Quote:** App fetches a quote from Jupiter (`Token -> USDC`).
2.  **Swap Instruction:** The transaction is constructed to swap *outputting* to the Treasury's USDC address.
3.  **Platform Fee:** The code programmatically adds a **0.005 SOL** fee to every swap transaction using `SystemProgram.transfer`.
4.  **Result:** The Treasury never holds volatile meme tokens; it receives stable USDC + the SOL fee.

---

## 6. Gamification Engine

**File:** `src/features/profile/components/AchievementsTab.tsx`
The app includes a hidden "Rarity System" for achievements.
- **Tiers:**
    - **Common:** Gray/Standard.
    - **Rare:** Blue (Requires `rgba(59,130,246,0.5)` glow).
    - **Epic:** Purple (Requires `rgba(168,85,247,0.5)` glow).
    - **Legendary:** Gold (Requires `border-accent-primary` + Gold glow).
- **Triggers:** Achievements are unlocked based on `transaction_count` and `total_usd_value` thresholds (processed via `gamification.ts` utilities).

---

## 7. Summary of "Context 7" Findings

1.  **Real-Time Pricing:** The leaderboard is pegged to USD, meaning your rank is determined by the *moment* you paid.
2.  **Anti-Gaming:** The `$0.01` dust filter prevents "1 lamport" spam attacks.
3.  **Self-Referral:** Explicitly blocked in the webhook logic.
4.  **Hidden Revenue:** The 0.005 SOL fee on swaps is a hidden revenue stream alongside the main tribute volume.
5.  **Resiliency:** The app is designed to fail gracefully into "Read-Only" mode rather than crashing if the blockchain layer is down.
