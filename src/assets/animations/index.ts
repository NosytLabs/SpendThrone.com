// Animation Data Exports
import solanaLoadingData from './json/solana-loading.json';

export const solanaLoadingAnimation = solanaLoadingData;

// Animation types
export interface AnimationAsset {
  name: string;
  data: string | object;
  category: 'logo' | 'wallet' | 'transaction' | 'loading' | 'exchange' | 'blockchain' | 'coins' | 'staking' | 'crypto';
  description: string;
}

export const animations: Record<string, AnimationAsset> = {
  solanaLoading: {
    name: 'Solana Loading',
    data: solanaLoadingData,
    category: 'loading',
    description: 'Solana-themed loading spinner with rotating rings'
  }
};
