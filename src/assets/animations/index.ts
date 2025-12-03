// Animation Data Exports
import solanaLogoData from './json/solana-logo.json';
import cryptoWalletData from './json/crypto-wallet.json';
import solanaLoadingData from './json/solana-loading.json';

// Imported JSON animations (formerly external URLs)
import cryptoExchangeData from './json/crypto-exchange.json';
import cryptoChainsData from './json/crypto-chains.json';
import cryptoCoinsData from './json/crypto-coins.json';
import stakingEthereumData from './json/staking-ethereum.json';
import bitcoinWalletData from './json/bitcoin-wallet.json';
import usbCryptoTokenData from './json/usb-crypto-token.json';
import blockchainSecurityData from './json/blockchain-security.json';
import cryptoInvestmentData from './json/crypto-investment.json';
import cryptoAnimationData from './json/crypto-animation.json';
import cryptocurrencyLottieData from './json/cryptocurrency-lottie.json';
import paymentSuccessData from './json/payment-success.json';
import homeHeroData from './json/home-hero.json';

// New Crypto Animations from LottieFiles
export const solanaLogoAnimation = solanaLogoData;
export const cryptoWalletAnimation = cryptoWalletData;
export const solanaLoadingAnimation = solanaLoadingData;

// Enhanced Crypto Animations Collection
export const cryptoExchangeAnimation = cryptoExchangeData;
export const cryptoChainsAnimation = cryptoChainsData;
export const cryptoCoinsAnimation = cryptoCoinsData;
export const stakingEthereumAnimation = stakingEthereumData;
export const paymentSuccessAnimation = paymentSuccessData;

// External Lottie Animation Data (formerly URLs)
export const externalAnimations = {
  bitcoinWallet: {
    name: 'Bitcoin Wallet',
    data: bitcoinWalletData,
    category: 'wallet' as const,
    description: 'Animated Bitcoin wallet with golden coins and blockchain elements'
  },
  usbCryptoToken: {
    name: 'USB Crypto Token',
    data: usbCryptoTokenData,
    category: 'wallet' as const,
    description: 'Hardware wallet USB token with security authentication'
  },
  blockchainSecurity: {
    name: 'Blockchain Security Alert',
    data: blockchainSecurityData,
    category: 'transaction' as const,
    description: 'Security warning animation for blockchain transactions'
  },
  cryptoInvestment: {
    name: 'Crypto Investment',
    data: cryptoInvestmentData,
    category: 'crypto' as const,
    description: 'Crypto Investment'
  },
  cryptoBitcoin: {
    name: 'crypto / bitcoin',
    data: cryptoInvestmentData, // Reusing cryptoInvestmentData as they shared the same URL
    category: 'crypto' as const,
    description: 'crypto / bitcoin'
  },
  cryptoAnimation: {
    name: 'crypto animation',
    data: cryptoAnimationData,
    category: 'crypto' as const,
    description: 'crypto animation'
  },
  cryptocurrencyLottieAnimation: {
    name: 'Cryptocurrency Lottie Animation',
    data: cryptocurrencyLottieData,
    category: 'crypto' as const,
    description: 'Cryptocurrency Lottie Animation'
  },
  cryptoMining: {
    name: 'Crypto mining',
    data: cryptocurrencyLottieData, // Reusing cryptocurrencyLottieData as they shared the same URL
    category: 'crypto' as const,
    description: 'Crypto mining'
  },
  cryptoExchange: {
    name: 'Crypto Exchange',
    data: cryptoExchangeData,
    category: 'exchange' as const,
    description: 'Animated crypto exchange with floating blockchain elements'
  },
  cryptoChains: {
    name: 'Crypto Chains',
    data: cryptoChainsData,
    category: 'blockchain' as const,
    description: 'Interconnected blockchain chains with Bitcoin and Ethereum'
  },
  cryptoCoins: {
    name: 'Crypto Coins',
    data: cryptoCoinsData,
    category: 'coins' as const,
    description: 'Multiple cryptocurrency coins including Bitcoin, Ethereum, Dogecoin'
  },
  stakingEthereum: {
    name: 'Staking on Ethereum',
    data: stakingEthereumData,
    category: 'staking' as const,
    description: 'Ethereum staking animation with staking rewards'
  },
  paymentSuccess: {
    name: 'Payment Success',
    data: paymentSuccessData,
    category: 'transaction' as const,
    description: 'Success animation for payments'
  },
  homeHero: {
    name: 'Home Hero',
    data: homeHeroData,
    category: 'logo' as const,
    description: 'Home Hero Animation'
  }
};

// Animation types
export interface AnimationAsset {
  name: string;
  data: string | object;
  category: 'logo' | 'wallet' | 'transaction' | 'loading' | 'exchange' | 'blockchain' | 'coins' | 'staking' | 'crypto';
  description: string;
}

export const animations: Record<string, AnimationAsset> = {
  solanaLogo: {
    name: 'Solana Logo',
    data: solanaLogoData,
    category: 'logo',
    description: 'Rotating Solana logo with scaling effects'
  },
  cryptoWallet: {
    name: 'Crypto Wallet',
    data: cryptoWalletData,
    category: 'wallet',
    description: 'Animated wallet with floating coins'
  },
  solanaLoading: {
    name: 'Solana Loading',
    data: solanaLoadingData,
    category: 'loading',
    description: 'Solana-themed loading spinner with rotating rings'
  },
  bitcoinWallet: externalAnimations.bitcoinWallet,
  usbCryptoToken: externalAnimations.usbCryptoToken,
  blockchainSecurity: externalAnimations.blockchainSecurity,
  cryptoExchange: externalAnimations.cryptoExchange,
  cryptoChains: externalAnimations.cryptoChains,
  cryptoCoins: externalAnimations.cryptoCoins,
  stakingEthereum: externalAnimations.stakingEthereum,
  paymentSuccess: externalAnimations.paymentSuccess,
  homeHero: externalAnimations.homeHero
};
