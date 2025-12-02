// Centralized endpoint configuration and helpers
// Provides a single source of truth for RPC selection and Jupiter APIs.

// Base URL for Jupiter Price API v2
export const JUPITER_PRICE_BASE = 'https://api.jup.ag/price/v2';
// Base URL for Jupiter token cache
export const JUPITER_TOKENS_CACHE = 'https://cache.jup.ag/tokens';
// Fallback static token icon (env override via VITE_STATIC_TOKEN_ICON)
const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};
export const JUPITER_STATIC_TOKEN_ICON = env.VITE_STATIC_TOKEN_ICON || 'https://static.jup.ag/token-icon.png';

// Resolve Jupiter Ultra API base URL with validation and normalization
export function resolveJupiterApiUrl(envUrl?: string): string {
  let base = envUrl || 'https://api.jup.ag/ultra';
  // Ensure we are pointing to the Ultra API
  if (!base.includes('/ultra')) {
    // Allow custom domains but append /ultra
    base = base.replace(/\/$/, '') + '/ultra';
  }
  // Simple validation
  if (!/^https?:\/\//.test(base)) {
    throw new Error('Invalid VITE_JUPITER_API_URL. Must be an http(s) URL.');
  }
  return base;
}

// Feature flag: enable/disable all RPC usage globally
export function isRpcEnabled(): boolean {
  const envVars = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};
  // Default to TRUE unless explicitly disabled
  return envVars.VITE_ENABLE_RPC !== 'false';
}

// Treasury address resolution from environment; avoids hard-coding secrets
export const DEFAULT_TREASURY = '31M5mtQ2T1B4K9rPieLoiTncDUGWVwgBdiJYm8RhsJCo';

export function getTreasuryAddress(): string {
  const envVars = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};
  const treasury = envVars.VITE_TREASURY_ADDRESS || envVars.VITE_TREASURY_WALLET || envVars.REACT_APP_TREASURY_WALLET;
  const value = treasury && /^([1-9A-HJ-NP-Za-km-z]{32,44})$/.test(String(treasury)) ? String(treasury) : DEFAULT_TREASURY;
  return value;
}

// Get preferred RPC URL with environment precedence.
// Order: VITE_HELIUS_RPC_URL -> VITE_SOLANA_RPC_URL -> devnet/mainnet fallback by network.
export function getRpcUrl(): string {
  const envVars = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};
  const helius = envVars.VITE_HELIUS_RPC_URL;
  const solana = envVars.VITE_SOLANA_RPC_URL;
  const network = envVars.VITE_SOLANA_NETWORK;
  // Treat obvious placeholder keys as invalid
  const heliusValid = (() => {
    if (!helius) return false;
    const lower = String(helius).toLowerCase();
    const looksPlaceholder = lower.includes('your') && lower.includes('key');
    return !looksPlaceholder;
  })();

  if (heliusValid && helius) return helius;
  if (solana) return solana;
  // Fallback by network
  if (String(network).toLowerCase() === 'devnet') {
    return 'https://api.devnet.solana.com';
  }
  return 'https://api.mainnet-beta.solana.com';
}

// Check if a valid Helius RPC is configured, excluding common placeholder values,
// and respecting global RPC disable flag.
export function isHeliusAvailable(): boolean {
  if (!isRpcEnabled()) return false;
  const envVars = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};
  const helius = envVars.VITE_HELIUS_RPC_URL;
  if (!helius) return false;
  const lower = String(helius).toLowerCase();
  const looksPlaceholder = lower.includes('your') && lower.includes('key');
  return !looksPlaceholder;
}
