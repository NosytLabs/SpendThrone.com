

export interface LoadingConfig {
  // Default messages for different contexts
  messages: {
    default: string;
    leaderboard: string;
    profile: string;
    history: string;
    tiers: string;
    referral: string;
    payment: string;
    wallet: string;
    data: string;
    blockchain: string;
  };
  
  // Default timing configurations
  timing: {
    minDuration: number; // Minimum time to show loading state (ms)
    maxDuration: number; // Maximum time before showing error (ms)
    debounceDelay: number; // Delay before showing loading state (ms)
  };
  
  // Visual configurations
  visual: {
    defaultVariant: 'spinner' | 'lottie' | 'skeleton' | 'dots' | 'bars' | 'pulse' | 'wave';
    defaultSize: 'sm' | 'md' | 'lg' | 'xl';
    defaultColor: 'primary' | 'secondary' | 'white' | 'solana-purple' | 'solana-green' | 'solana-blue';
    backdropBlur: boolean;
    opacity: 'light' | 'medium' | 'dark';
  };
  
  // Error handling
  errorHandling: {
    showRetryAfterError: boolean;
    maxRetries: number;
    retryDelay: number; // Delay between retries (ms)
  };
}

export const defaultLoadingConfig: LoadingConfig = {
  messages: {
    default: 'Loading...',
    leaderboard: 'Summoning the Court...',
    profile: 'Consulting the Royal Archives...',
    history: 'Reviewing the Chronicles...',
    tiers: 'Ascending the Ranks...',
    referral: 'Building the Empire...',
    payment: 'Processing Tribute...',
    wallet: 'Connecting to the Treasury...',
    data: 'Gathering Intelligence...',
    blockchain: 'Communicating with the Blockchain...'
  },
  timing: {
    minDuration: 500,      // 0.5 seconds
    maxDuration: 30000,    // 30 seconds
    debounceDelay: 200     // 0.2 seconds
  },
  visual: {
    defaultVariant: 'lottie',
    defaultSize: 'lg',
    defaultColor: 'primary',
    backdropBlur: true,
    opacity: 'medium'
  },
  errorHandling: {
    showRetryAfterError: true,
    maxRetries: 3,
    retryDelay: 1000      // 1 second
  }
};

// Context-specific loading configurations
export const getLoadingConfig = (context: keyof LoadingConfig['messages'], customConfig?: Partial<LoadingConfig>): LoadingConfig => {
  const config = {
    ...defaultLoadingConfig,
    ...customConfig,
    messages: {
      ...defaultLoadingConfig.messages,
      ...customConfig?.messages
    },
    timing: {
      ...defaultLoadingConfig.timing,
      ...customConfig?.timing
    },
    visual: {
      ...defaultLoadingConfig.visual,
      ...customConfig?.visual
    },
    errorHandling: {
      ...defaultLoadingConfig.errorHandling,
      ...customConfig?.errorHandling
    }
  };
  
  // Set the context-specific message as the default message
  if (config.messages[context]) {
    config.messages.default = config.messages[context];
  }
  
  return config;
};