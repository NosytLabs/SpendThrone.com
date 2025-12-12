# SpendThrone Project Summary (2025)

**Generated on:** 2025-12-06
**Status:** Active / Production-Ready
**Version:** 1.3.0

## 1. Tech Stack Overview

### Frontend
- **Framework:** React 18 + Vite 7 (Verified Stable Release 2025).
- **Language:** TypeScript 5.5+
- **Styling:** Tailwind CSS 3.4 + `tailwindcss-animate` + Custom "Royal" Theme
- **Animation:** Framer Motion, Lottie React, Canvas Confetti
- **State Management:** React Context + Hooks
- **Testing:** Vitest (Unit), Playwright (E2E)

### Backend & Infrastructure
- **Database:** Supabase (PostgreSQL) - Handles leaderboard indexing and history.
- **API:** Vercel Serverless Functions (in `/api` folder).
- **Hosting:** Vercel (implied by `vercel.json`).

### Crypto & Blockchain
- **Network:** Solana (Mainnet Beta).
- **Core Library:** `@solana/web3.js` (v1.x).
- **Wallets:** `@solana/wallet-adapter-react` (Phantom, Solflare, etc.).
- **Swaps:** Jupiter Aggregator API v6 (via `swapService`).
- **Interactions:** Solana Actions (Blinks) support.

---

## 2. Key Features

### 👑 The Leaderboard ("King of the Hill")
- **Mechanism:** Users rank based on the total USD value of their "tributes" (payments).
- **Real-time Updates:** Updates via Supabase Realtime and local optimistic UI updates.
- **Features:**
  - **Overtake:** One-click calculation to pay exactly enough to beat a specific user.
  - **King Status:** Special visual effects for the #1 player.
  - **Prize Pool:** $50K USDC (Season 1).

### 💸 Multi-Token Payment System
- **Direct SOL:** Native system transfers using `SystemProgram`.
- **Direct USDC:** SPL token transfers.
- **SPL Token Swaps:**
  - Supports major tokens: BONK, WIF, JUP, RAY, etc.
  - **Auto-Swap:** Uses Jupiter API to quote and swap tokens to USDC in a single transaction before reaching the treasury.
  - **Treasury Safety:** The project treasury primarily receives stable assets (USDC) or SOL.
  - **Mobile Optimized:** Includes "Slide to Pay" gesture component (`SwipeButton.tsx`) for improved mobile UX.

### 🔗 Referral System (On-Chain)
- **Tracking:** Uses the **Solana Memo Program** to attach `Ref: <referrer_pubkey>` to transactions.
- **Verification:** `api/referrals.ts` scans on-chain history for these memos to calculate referral volume.
- **Benefit:** Fully decentralized tracking without needing a centralized database for the "truth" (though Supabase likely indexes it for speed).

### ⚡ Solana Actions (Blinks)
- **Integration:** Found in `api/actions/join.ts`.
- **Function:** Allows users to "Pay Tribute" directly from X (Twitter) or other platforms supporting unfurled Solana Actions.

---

## 3. Project Structure

| Directory | Purpose |
|-----------|---------|
| `src/core` | Singleton services (`swapService`, `priceService`), constants (`tokens.ts`), and global state. |
| `src/features` | Domain-specific logic (`payment`, `leaderboard`, `history`). |
| `src/components/ui` | Reusable UI components (Badge, Card, Button). |
| `api/` | Serverless functions for Referrals and Blinks. |
| `supabase/` | SQL migrations and schema definitions. |
| `docs/` | Architectural documentation and audit reports. |

## 4. Crypto Configuration

- **Treasury Address:** `31M5mtQ2T1B4K9rPieLoiTncDUGWVwgBdiJYm8RhsJCo`
- **Supported Tokens:** Defined in `src/core/constants/tokens.ts` (SOL, USDC, USDT, RAY, BONK, WIF, JUP, etc.).
- **USDC Mint:** `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`

## 5. Health & Integrity Report
**Date:** 2025-12-06

*   **Codebase Health:** ✅ Excellent. `GetDiagnostics` passed with 0 errors.
*   **Vite Version Check:** ✅ **Verified**. Vite 7.x is the standard stable release as of late 2025. `package.json` configuration is correct.
*   **Jupiter API:** ✅ Verified usage of v6 API endpoints (`/quote`, `/swap`) in `swapService.ts`.
*   **Hidden Fees:** ✅ Confirmed `0.005 SOL` platform fee added to Swap transactions in `swapService.ts`.

## 6. UI System: "The Royal Theme"
**Location:** `src/components/ui/`

The project uses a sophisticated, tiered component system to enforce the "Royal" aesthetic:

*   **Core Components:** `Card`, `Button`, `Badge`, `Input` (Base atomic units).
*   **Enhanced Wrappers:** `EnhancedCard` (adds Tilt, Ripple, Glow, Shimmer effects via props).
*   **Mobile UX:** `SwipeButton.tsx` implements a gesture-based "Slide to Pay" mechanism using Framer Motion.
*   **Specialized Animations:**
    *   `AnimationUtilities.tsx`: Contains `GlowPulse`, `FloatingAnimation`, `ConfettiAnimation`.
    *   **Glassmorphism:** Heavy use of `glass-panel` classes for overlay effects.
*   **Accessibility:** `AccessibilityUtilities.tsx` includes `SkipLink` and `KeyboardNavigationHint`.

## 7. Current Documentation Status
- **High Level:** `README.md` is accurate.
- **Deep Dive:** `docs/DEEP_DIVE_2025.md` covers backend truth.
- **Analysis:** `docs/analysis/decomposition.src.md` provides system breakdown.
