export const TOKENS = {
  SOL: {
    SYMBOL: 'SOL',
    NAME: 'Solana',
    DECIMALS: 9,
    MINT: 'So11111111111111111111111111111111111111112' // Native SOL wrapper mint often used in swaps
  },
  USDC: {
    SYMBOL: 'USDC',
    NAME: 'USD Coin',
    DECIMALS: 6,
    MINT: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
  }
} as const;

export type TokenSymbol = keyof typeof TOKENS;

// Helper for backward compatibility and easier lookup
export const SYMBOL_TO_MINT: Record<string, string> = {
  [TOKENS.SOL.SYMBOL]: TOKENS.SOL.MINT,
  [TOKENS.USDC.SYMBOL]: TOKENS.USDC.MINT
};
