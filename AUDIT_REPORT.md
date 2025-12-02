# SpendThrone.com Comprehensive Codebase Audit
**Date:** 2025-12-01
**Auditor:** Project Suggestion Agent (Trae IDE)

## Executive Summary
The codebase is well-structured, utilizing modern React patterns (Vite, TypeScript, Tailwind) and a solid folder architecture. However, critical functionality is currently disabled or hardcoded, rendering the dApp non-functional for end-users. Immediate attention is required to restore RPC connectivity and secure treasury management.

## 1. Critical Issues (High Priority)

### 🚨 RPC Interactions Globally Disabled
**File:** `src/core/constants/endpoints.ts`
**Issue:** The `isRpcEnabled()` function explicitly returns `false`, blocking all blockchain interactions.
```typescript
export function isRpcEnabled(): boolean {
  // Temporarily hard-disable RPC interactions regardless of environment configuration.
  return false; // <--- CAUSE
}
```
**Recommendation:** Restore environment-driven logic (e.g., check `VITE_ENABLE_RPC` env var).

### ⚠️ Hardcoded Treasury Address
**Files:** `src/core/constants/endpoints.ts`, `api/actions/join.ts`
**Issue:** The treasury wallet address is hardcoded (`31M5mtQ...`) in multiple locations.
**Risk:** Changing the treasury requires a code deploy. If the wallet is compromised, the code must be patched immediately.
**Recommendation:**
1. Centralize the constant in `endpoints.ts`.
2. Use `process.env.TREASURY_ADDRESS` / `import.meta.env.VITE_TREASURY_ADDRESS`.
3. Import the constant in `api/actions/join.ts` (DRY principle).

### 🚧 Hybrid Data Strategy (Mock vs. Real)
**File:** `src/pages/Profile.tsx`
**Issue:** The profile page uses a mix of real leaderboard data and hardcoded mock data for achievements/history.
**Impact:** Users see fake achievements ("High Roller", "Consistency King") that do not reflect their actual on-chain activity.
**Recommendation:** Complete the API endpoints for achievements or hide the section until ready.

## 2. Architecture & Code Quality

### Strengths
- **Modern Stack:** React 18, Vite 5, TypeScript 5.
- **Performance:** Lazy loading (Suspense) and manual chunk splitting in `vite.config.ts` are excellent.
- **Project Structure:** Clear separation of concerns (`core`, `components`, `pages`, `api`).
- **Styling:** Tailwind CSS with utility components (`components/ui`) is scalable.

### Weaknesses
- **Environment Variable Inconsistency:**
  - Frontend uses `import.meta.env`.
  - API uses `process.env`.
  - `endpoints.ts` has logic to handle both, but it's complex.
- **Missing Rate Limiting:** The `api/actions/join.ts` endpoint (Solana Blink) has no rate limiting, making it vulnerable to spam.

## 3. Security & Build

### Security
- **Treasury:** Hardcoded address is visible in client-side bundles.
- **Input Validation:** `api/actions/join.ts` validates `amount` but could be stricter on `ref` (referral) inputs to prevent memo spam.

### Build Configuration
- **Vite:** Configured to drop `debugger` in production.
- **Polyfills:** `vite-plugin-node-polyfills` is used, which is necessary for `web3.js` but adds bundle weight.

## 4. Recommended Action Plan

1.  **Enable RPC:** Update `isRpcEnabled()` to check an environment variable.
2.  **Centralize Secrets:** Move treasury address to `.env` and export from a single file.
3.  **Clean Up Profile:** Hide mock achievements in production builds.
4.  **Protect API:** Add basic rate limiting to `api/actions/join.ts`.

---
*Generated via MCP Desktop Commander Audit*
