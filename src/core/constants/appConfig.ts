/**
 * Application Configuration Constants
 * Centralized configuration for SpendThrone application
 */

import { getTreasuryAddress } from './endpoints';

export const APP_CONFIG = {
  // Application Identity
  APP_NAME: 'SPENDTHRONE',
  APP_NAME_DISPLAY: 'SpendThrone',
  APP_TITLE: 'SpendThrone - Financial Status Competition on Solana',
  VERSION: '1.3.0',

  // Competition Settings
  CURRENT_SEASON: 'Season 1',
  PRIZE_POOL: '$50K USDC',
  get TREASURY_ADDRESS() { return getTreasuryAddress(); },

  // Marketing Copy (Satirical & Royal)
  TAGLINES: {
    HERO: 'The honest social experiment on Solana. Deposit SOL to the royal treasury for pure status.',
    LEADERBOARD: 'Real-time tribute rankings • Updated every block • Treasury Experiment Live',
    ABOUT: 'A social experiment in pure status seeking and digital conspicuous consumption'
  },

  // Social Links
  SOCIALS: {
    TWITTER: 'https://twitter.com/SpendThrone',
    DISCORD: 'https://discord.gg/SpendThrone'
  },

  // Competition Rules
  MECHANICS: {
    RANKINGS_DESCRIPTION: 'Rankings are calculated based on total treasury deposits, consistency, and royal status. Higher contributions and regular participation elevate your throne position.',
    TREASURY_DESCRIPTION: 'All deposits are permanently locked in the royal treasury. No withdrawals, no refunds - only eternal status and leaderboard glory.',
    EXPERIMENT_DESCRIPTION: 'This social experiment runs indefinitely on Solana. Rankings update in real-time, but your contributions and royal status are permanent.'
  },

  // UI Labels
  LABELS: {
    TOTAL_NOBLES: 'TOTAL NOBLES',
    TOTAL_BURNED: 'TOTAL BURNED',
    RECENT_DEPOSITS: 'RECENT DEPOSITS',
    AVERAGE_DEPOSIT: 'AVERAGE DEPOSIT',
    TOTAL_WARRIORS: 'TOTAL WARRIORS',
    CURRENT_SEASON: 'CURRENT SEASON',
    PRIZE_POOL_LABEL: 'PRIZE POOL'
  },

  // Section Titles
  SECTIONS: {
    ROYAL_COURT: 'ROYAL COURT',
    THRONE_RANKINGS: 'THRONE RANKINGS',
    ROYAL_STANDINGS: 'ROYAL STANDINGS',
    HOW_RANKINGS_WORK: 'HOW RANKINGS WORK',
    TREASURY_MECHANICS: 'TREASURY MECHANICS',
    LIVE_EXPERIMENT: 'LIVE EXPERIMENT'
  },

  // Empty States
  EMPTY_STATES: {
    NO_NOBLES: 'No nobles yet — make your first deposit to claim a spot.',
    NO_LEADERBOARD_DATA: 'No leaderboard data available',
    NO_TOKENS_FOUND: 'No tokens found'
  },

  // Navigation
  NAVIGATION: [
    { href: '/', label: 'Home', icon: 'crown' },
    { href: '/leaderboard', label: 'Leaderboard', icon: 'trophy' },
    { href: '/start', label: 'Get Started', icon: 'rocket' },
    { href: '/tiers', label: 'Tiers', icon: 'barChart' },
    { href: '/history', label: 'History', icon: 'scroll' },
    { href: '/profile', label: 'Profile', icon: 'user' },
  ]
} as const;

export type AppConfig = typeof APP_CONFIG;