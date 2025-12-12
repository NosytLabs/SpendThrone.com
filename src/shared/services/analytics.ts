/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Analytics Service (PostHog Wrapper)
 * 
 * Centralizes all event tracking to ensure consistency and type safety.
 * Gracefully fails if PostHog is blocked by ad-blockers.
 */

declare global {
  interface Window {
    posthog: any;
  }
}

export const Analytics = {
  /**
   * Track a distinct user action
   * @param eventName Name of the event (use snake_case, e.g., 'tribute_paid')
   * @param properties Optional metadata (e.g., { amount: 100, token: 'SOL' })
   */
  track: (eventName: string, properties?: Record<string, any>) => {
    try {
      if (window.posthog) {
        window.posthog.capture(eventName, properties);
      }
      // else {
      //   console.debug(`[Analytics] ${eventName}`, properties);
      // }
    } catch (e) {
      // Ignore analytics errors
    }
  },

  /**
   * Identify a user by their Wallet Address
   * @param walletAddress The user's public key
   */
  identify: (walletAddress: string) => {
    try {
      if (window.posthog) {
        window.posthog.identify(walletAddress);
      }
    } catch (e) {
      // Ignore
    }
  },

  /**
   * Reset session (on disconnect)
   */
  reset: () => {
    try {
      if (window.posthog) {
        window.posthog.reset();
      }
    } catch (e) {
      // Ignore
    }
  },

  /**
   * Check if a feature flag is enabled
   * @param flagKey The unique key of the feature flag
   */
  isFeatureEnabled: (flagKey: string): boolean => {
    try {
      if (window.posthog) {
        return window.posthog.isFeatureEnabled(flagKey) || false;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
};

// Event Constants to avoid typos
export const EVENTS = {
  WALLET: {
    CONNECT: 'wallet_connected',
    DISCONNECT: 'wallet_disconnected',
  },
  PAYMENT: {
    OPEN_MODAL: 'payment_modal_opened',
    INITIATED: 'payment_initiated',
    SUCCESS: 'payment_success',
    FAILED: 'payment_failed',
  },
  SACRIFICE: {
    SCAN: 'sacrifice_scan_initiated',
    BURN: 'sacrifice_burn_executed',
  },
  LEADERBOARD: {
    LINK_CLICK: 'leaderboard_link_clicked',
    SHARE: 'leaderboard_share_clicked',
  },
  PROFILE: {
    UPDATE: 'profile_updated',
  }
};
