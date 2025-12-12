# SpendThrone

**SpendThrone.com** is a satirical Solana-based dApp for financial status competition. It is a gamified "Pay-to-Win" social experiment where users pay "tributes" (SOL, USDC, or SPL Tokens) to rank up on a global leaderboard.

> "Immortalize your status on the blockchain. Join 5,000 years of history."

---

## 📚 Documentation

For detailed architecture, user flows, and design specifications, please refer to the **[Site Documentation](./SITE_DOCUMENTATION.md)**.

For deep technical implementation details, crypto architecture, and feature breakdown, see the **[Technical Architecture](./TECHNICAL_ARCHITECTURE.md)**.

For a history of updates, see the **[Changelog](./CHANGELOG.md)**.

---

## 🚀 Features

- **Global Leaderboard**: Real-time ranking of contributors based on USD value of tributes.
- **Pay-to-Win Mechanics**:
  - **Overtake**: One-click button to pay exactly enough to surpass a rival.
  - **King of the Hill**: Special visual effects for the top rank.
- **Multi-Token Support**:
  - Accepts SOL directly.
  - Accepts **any SPL Token** (Bonk, WIF, JUP, etc.) via **Jupiter Ultra API** integration (auto-swaps to USDC).
- **Solana Actions (Blinks)**: Unfurlable transactions on X (Twitter) allowing users to pay tribute directly from their feed.
- **Referral System**: On-chain referral tracking.

## 🛠 Tech Stack

- **Frontend**: [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) + Custom "Royal" Design System
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Backend/DB**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Blockchain**:
  - `@solana/web3.js` (1.x)
  - `@solana/wallet-adapter` (MWA Ready)
  - Jupiter Aggregator API (v6)
  - Solana Actions (Blinks)
- **Testing**: Vitest (Unit), Playwright (E2E)

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/spendthrone.git
   cd spendthrone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Copy `.env.example` to `.env` and fill in your keys:
   ```bash
   cp .env.example .env
   ```
   *Required variables:*
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_RPC_ENDPOINT` (Optional, defaults to public)

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

## 🧪 Testing

- **Unit Tests**: `npm run test` (Vitest)
- **E2E Tests**: `npm run test:e2e` (Playwright)
- **Linting**: `npm run lint`
- **Health Check**: `npm run health-check` (Runs Lint + Types + Tests + Bundle Analysis)

## 📂 Project Structure

- `src/features/`: Business logic modules (Payment, Leaderboard, etc.)
- `src/components/ui/`: Reusable UI components
- `api/`: Serverless functions (Solana Actions/Blinks)
- `supabase/`: Database schema and migrations
- `docs/`: Audit reports and master plans

## 📜 License

Private - Do not distribute.
