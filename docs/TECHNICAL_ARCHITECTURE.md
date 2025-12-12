# 🏗️ Technical Architecture & Implementation Guide

> **Last Updated:** 2025-12-04
> **Version:** 1.0.0
> **Status:** Active Development

This document provides a deep dive into the technical implementation, crypto integrations, and feature architecture of SpendThrone.com.

---

## 1. 🛠 Tech Stack Overview

### **Frontend Core**
- **Framework**: [React 18.3](https://react.dev/)
- **Build Tool**: [Vite 5.x](https://vitejs.dev/)
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org/)
- **State Management**: React Context + Hooks (Local state preferred)

### **Styling & UI**
- **Engine**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Animation**: 
  - `framer-motion` (Complex transitions)
  - `lottie-react` (Vector animations)
  - Native CSS Transitions (Performance critical UI)
- **Icons**: `lucide-react` + Custom SVGs
- **Components**: Custom "Royal" Design System (Glassmorphism, Gold gradients)

### **Backend & Data**
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Wallet-based Auth (SIWS - Sign In With Solana)
- **API**: 
  - Supabase REST API
  - Solana RPC (Helius/Public)
  - Jupiter V6 API (Swaps)

### **Testing & Quality**
- **Unit/Integration**: [Vitest](https://vitest.dev/) + React Testing Library
- **E2E**: [Playwright](https://playwright.dev/)
- **Linting**: ESLint + Prettier

---

## 2. ⛓️ Crypto Architecture

### **Solana Integration**
The application connects directly to the Solana blockchain for all financial transactions.

- **Connection Provider**: 
  - Configured in `core/constants/endpoints.ts`
  - Supports fallback strategies (Helius Primary -> Public Backup)
  - Rate-limit aware custom `ApiClient`

- **Wallet Adapter**:
  - Library: `@solana/wallet-adapter-react`
  - Wallets: Phantom, Solflare, Backpack, Ledger
  - Standards: Mobile Wallet Adapter (MWA) ready

### **Payment System (The Tribute)**
Located in `src/features/payment` & `src/core/services/swapService.ts`.

1. **Token Support**:
   - **Native SOL**: Direct transfer to Treasury.
   - **SPL Tokens**: Any token supported by Jupiter (USDC, BONK, WIF, etc.).
   - **Auto-Swap**: All non-USDC/SOL tokens are swapped to USDC instantly via Jupiter.

2. **Jupiter Integration**:
   - **API**: Jupiter v6 Ultra API
   - **Flow**: 
     1. User selects Token X
     2. App fetches Quote (Token X -> USDC Treasury)
     3. App constructs Versioned Transaction
     4. User signs & sends

3.- **Transaction Tracking**:
   - On-chain signatures verified via RPC.
   - Indexed to Supabase for Leaderboard updates.

4. **Protocol Fees**:
   - **Fixed Fee**: A `0.005 SOL` (approx $1.00) protocol fee is appended to every transaction.
   - **Implementation**: 
     - **Direct**: Added as a secondary `SystemProgram.transfer` instruction.
     - **Swaps**: Jupiter Versioned Transactions are decompiled, the fee instruction is injected, and then recompiled/signed.

5. **Indexing Architecture (Helius Webhook)**:
   - **Purpose**: Guarantees 100% transaction capture even if users close the browser immediately.
   - **Flow**:
     1. Helius detects transaction involving Treasury Address.
     2. Webhook POSTs to `api/webhooks/helius.ts`.
     3. Handler validates `HELIUS_WEBHOOK_SECRET`.
     4. Fetches real-time token price (USD) via Jupiter API.
     5. Updates Supabase `transactions` and `leaderboard` tables.
     6. Supabase Realtime pushes update to all connected clients.

## 3. 🧩 Feature Modules

### **🏆 Leaderboard System**
*Directory: `src/features/leaderboard`*

- **King of the Hill**: Real-time display of the top contributor.
- **Ranking Engine**: 
  - Aggregates total USD value of tributes.
  - **Updates**:
    - **Action-Triggered**: Immediate refresh after successful payment.
    - **Periodic**: Polls database on page load and intervals (non-subscription based).
- **Overtake Mechanic**:
  - Calculates exact delta to next rank.
  - Pre-fills payment modal with `(target_value - current_value) + 0.01`.

### **👤 Profile & Identity**
*Directory: `src/features/profile`*

- **Identity**: Derived from Wallet Address.
- **Badges**: 
  - Awarded based on contribution milestones or specific actions.
  - Stored in `user_badges` table.
- **History**: Complete transaction log merged from on-chain data + DB.

### **⚠️ Referral Pyramid**
*Directory: `src/pages/ReferralPyramid.tsx`*

- **Concept**: Satirical "Ponzi" referral structure.
- **Implementation**: 
  - On-chain `Memo` instruction attached to SOL transactions.
  - Database tracking via `depositService`.
  - Commission system (simulated or real depending on config).

---

## 4. 📂 Project Structure

```bash
src/
├── assets/            # Static assets (Images, Lottie files)
├── components/
│   ├── layout/        # Page wrappers, Headers, Footers
│   └── ui/            # Reusable primitives (Buttons, Cards, Inputs)
├── core/
│   ├── config/        # App-wide configuration
│   ├── constants/     # Endpoints, Addresses, Enums
│   └── services/      # API Clients, RPC, Business Logic
├── features/          # Domain-specific modules
│   ├── leaderboard/   # Ranking logic
│   ├── payment/       # Transaction flows
│   └── profile/       # User management
├── hooks/             # Shared custom hooks
├── pages/             # Route components
├── shared/            # Utilities, Types, Helpers
└── test/              # Test setups and mocks
```

## 5. 🔒 Security & Performance

- **Rate Limiting**: Implemented in `apiClient.ts` for RPC protection.
- **Input Sanitization**: All numeric inputs validated for precision/overflow.
- **Bundle Optimization**: 
  - Barrel exports used carefully (though verified active).
  - Lazy loading for heavy routes (History, Profile).
