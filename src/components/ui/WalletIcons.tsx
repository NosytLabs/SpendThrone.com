import React from 'react';
import { cn } from '@/shared/utils/utils';

interface WalletIconProps {
  variant: 'phantom' | 'solflare' | 'backpack' | 'moonpay' | 'stripe' | 'coinbase';
  className?: string;
  size?: number;
}

export const WalletIcon: React.FC<WalletIconProps> = ({ 
  variant, 
  className,
  size = 24 
}) => {


  switch (variant) {
    case 'phantom':
      return (
        <img 
            src="https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/phantom/src/adapter.svg" 
            alt="Phantom" 
            className={cn("object-contain", className)}
            style={{ width: size, height: size }}
        />
      );
    
    case 'solflare':
      return (
        <img 
            src="https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/solflare/src/adapter.svg" 
            alt="Solflare" 
            className={cn("object-contain", className)}
            style={{ width: size, height: size }}
        />
      );

    case 'backpack':
       // Official Backpack Logo (from asset repository)
      return (
        <img 
            src="https://registry.walletconnect.org/v2/logo/lg/38f5d18bd8522c2a55101c4fcdceabbc374f4b9e2d619729b47dbe637508T296" 
            alt="Backpack" 
            className={cn("object-contain rounded-md", className)}
            style={{ width: size, height: size }}
        />
      );
      
    case 'moonpay':
      return (
        <img 
            src="https://static.cdnlogo.com/logos/m/17/moonpay.svg" 
            alt="MoonPay" 
            className={cn("object-contain", className)}
            style={{ width: size, height: size }}
        />
      );

    case 'coinbase':
        return (
            <img 
                src="https://static.cdnlogo.com/logos/c/43/coinbase.svg" 
                alt="Coinbase" 
                className={cn("object-contain", className)}
                style={{ width: size, height: size }}
            />
        );

    case 'stripe':
        return (
            <img 
                src="https://static.cdnlogo.com/logos/s/44/stripe.svg" 
                alt="Stripe" 
                className={cn("object-contain", className)}
                style={{ width: size, height: size }}
            />
        );

    default:
      return null;
  }
};
