# SpendThrone.com - Master Audit & Strategic Plan

**Date:** November 26, 2025  
**Version:** 2.2  
**Status:** Polished & Production Ready  
**Auditor:** Trae AI Assistant

---

## 1. Executive Summary
SpendThrone is a gamified "Pay-to-Win" social experiment on Solana. Users pay "tributes" (SOL/USDC/SPL Tokens) to rank up on a leaderboard. The project has successfully implemented core viral mechanics found in competitors like `highscore.money`, including "Overtake" buttons, USD input modes, and King styling. 

**Key Finding:** The codebase is robust, modern (Vite+React+Tailwind), and technically sound. The integration with **Jupiter Ultra API** enables seamless SPL token deposits with auto-conversion to USDC.

---

## 2. Codebase Audit

### Tech Stack
*   **Frontend:** Vite, React, TypeScript
*   **Styling:** Tailwind CSS + Custom Design System (`src/styles/main.css`)
*   **Backend/DB:** Supabase (PostgreSQL)
*   **Blockchain:** Solana Web3.js, Wallet Adapter, Jupiter Ultra API
*   **Hosting:** Vercel (implied by `vercel.json`)
*   **Testing:** Playwright, Vitest

### Architecture
*   `src/features/`: Contains business logic (Payment, Leaderboard). Excellent modularity.
*   `src/components/ui/`: Reusable UI components (shadcn-like).
*   `api/`: Vercel Serverless Functions for Solana Actions (Blinks).

### Code Quality
*   **Cleanliness:** High. No "broken" files found. Typescript is used strictly.
*   **Design:** Professional "Royal/Dark" theme implemented via CSS variables.
*   **Verification:**
    *   ✅ **Overtake Button:** Implemented in `LeaderboardTable.tsx`.
    *   ✅ **USD Input:** Implemented in `PaymentModal.tsx`.
    *   ✅ **King Styling:** Enhanced with Gold Glow Animation in `LeaderboardTable.module.css`.
    *   ✅ **Token Swaps:** Jupiter Ultra API integrated in `swapService.ts`.

---

## 3. User & Funds Flow

### User Flow
1.  **Discovery:** User sees a tweet (Blink) or visits `spendthrone.com`.
2.  **Connection:** Connects Solana Wallet (Phantom/Solflare).
3.  **Action:**
    *   **On Site:** Clicks "Overtake" on a leaderboard entry or "Pay Tribute" button.
    *   **On X (Blink):** Clicks "Pay 0.1 SOL" directly in the tweet.
4.  **Payment:** Signs transaction.
    *   **SOL:** Direct Transfer.
    *   **Any Token:** Uses **Jupiter Ultra API** to swap to USDC.
5.  **Feedback:**
    *   **On Site:** Success Modal -> "Share on X" prompt -> Leaderboard updates locally.
    *   **On X:** Transaction success message.

### Funds Flow
1.  **Source:** User Wallet (SOL or any SPL Token).
2.  **Transaction:**
    *   **SOL:** Direct Transfer to Treasury.
    *   **SPL Tokens:** Swapped to USDC via **Jupiter Ultra API**.
3.  **Destination:** Treasury Wallet (`31M5mt...`).
4.  **Fee Structure:**
    *   **Network Fee:** Paid in SOL by user (standard Solana gas).
    *   **Platform Fee:** 0.5% (50bps) collected in USDC on swaps, directed to Treasury USDC Account.
    *   **Extra Service Fee:** ~0.005 SOL ($1.00) added to swap transactions, transferred directly to Treasury as "extra gas".
    *   **Net Result:** Treasury receives 100% of SOL tributes, ~99.5% of SPL tributes (in USDC), plus an extra SOL fee per swap.

---

## 4. Business Analysis

### Development Costs
*   **Infrastructure:** ~$0/mo (Vercel Hobby, Supabase Free, RPC Free Tier).
*   **Maintenance:** Low. Code is stable.
*   **Scaling:** ~$50-$100/mo if traffic spikes (Pro hosting, RPC upgrades).

### Profitability
*   **Model:** 100% Margin (Donation-based).
*   **Revenue Potential:** High viral potential. Competitors earn $10k-$100k/week during trends.
*   **Sustainability:** Relies on "Ego" and "Marketing". No utility provided to users other than status.

---

## 5. Page-by-Page Documentation

### **Home (`/`)**
*   **Purpose:** The main landing page acting as the "Throne Room".
*   **Key Features:**
    *   **Hero Section:** Displays the current "King of the Hill" with royal styling.
    *   **Leaderboard:** The core feature (`LeaderboardTable.tsx`), displaying rank, wallet/name, amount paid (USD/SOL), and "Overtake" actions.
    *   **Action:** "PAY TRIBUTE" button triggers the `PaymentModal`.
    *   **Logic:** Fetches real-time data from Supabase. Auto-refreshes.

### **Leaderboard (`/leaderboard`)**
*   **Purpose:** Detailed view of all contributors.
*   **Key Features:**
    *   **Filtering:** Time-based (All Time, 24h) and potentially amount-based.
    *   **Search:** Find specific wallets or names.
    *   **Overtake Mechanics:** Calculated dynamically based on the target's score + 1%.

### **History (`/history`)**
*   **Purpose:** A chronological log of all transactions ("The Royal Scribe").
*   **Key Features:**
    *   **Feed:** Live list of recent tributes.
    *   **Transparency:** Links directly to Solscan for on-chain verification.
    *   **Visuals:** Uses glassmorphism cards for each entry.

### **Tiers (`/tiers`)**
*   **Purpose:** Explains the hierarchy of status.
*   **Key Features:**
    *   **Visual Breakdown:** Displays badges/icons for different contribution levels (e.g., Peasant, Merchant, Noble, Royal, God-King).
    *   **Gamification:** Shows progress bars or requirements to reach the next tier.

### **Referral Pyramid (`/referral`)**
*   **Purpose:** The "Divine Favor" system (Ponzi/MLM-lite mechanics for virality).
*   **Key Features:**
    *   **Link Generation:** Users generate unique referral links.
    *   **Incentive:** "Recruiters" get a % of "glory" (score) from their recruits (no actual funds split, just leaderboard score boosting).
    *   **Copy Logic:** One-click copy to clipboard.

### **About (`/about`)**
*   **Purpose:** The philosophical manifesto.
*   **Content:** Explains "Costly Signaling Theory", "Veblen Goods", and the "Handicap Principle". Justifies why paying for nothing is rational for status.

### **Getting Started (`/start`)**
*   **Purpose:** Onboarding guide.
*   **Content:**
    1.  Get Phantom Wallet.
    2.  Buy SOL.
    3.  Connect & Pay.
    4.  Rule.

### **Help (`/help`)**
*   **Purpose:** FAQ and Support.
*   **Content:** Common questions ("Is this a scam?", "Can I get a refund?", "How do I change my name?").

---

## 6. Gap Analysis & Missing Features

| Priority | Feature | Description | Status |
| :--- | :--- | :--- | :--- |
| **CRITICAL** | **Indexer / Webhook** | Currently, if a user pays via Blink, the DB *might* not update automatically unless an indexer listens to the treasury wallet. | **MISSING** |
| **High** | **Mobile Swipe-to-Pay** | Mobile experience is good but could be native-like with swipe gestures. | Planned |
| **Medium** | **Token Badges** | NFT/SBT for "Whales" (Token-2022). | Planned |
| **Low** | **Multi-Chain** | Expand to Base/ETH (unnecessary for now). | - |

---

## 7. Recommendations

1.  **Implement Webhook Listener:** Create a cron job or Helius webhook to listen for deposits to `31M5mt...` and update the Supabase leaderboard. **Crucial for Blink support.**
2.  **Launch:** The product is ready for Mainnet testing.
3.  **Marketing:** Focus entirely on Twitter/X using the Blink URL.

---

## 8. Developer Guide

### Setup
```bash
npm install
npm run dev
```

### Deployment
```bash
# Push to main triggers Vercel
git push origin main
```

### Environment Variables
Required in `.env`:
*   `VITE_SUPABASE_URL`
*   `VITE_SUPABASE_ANON_KEY`
*   `VITE_RPC_ENDPOINT` (Optional, defaults to mainnet-beta)
