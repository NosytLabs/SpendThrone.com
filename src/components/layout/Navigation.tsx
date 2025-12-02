import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { cn } from '@/shared/utils/utils';
import { RoyalIcon, RoyalIconProps } from '../ui/RoyalIcon';
import { BounceAnimation, RippleEffect, TiltEffect } from '../ui/AnimationUtilities';
import { ThemeToggle } from '../ui/ThemeToggle';
import { APP_CONFIG } from '@/core/constants/appConfig';

interface NavigationProps {
  className?: string;
}

// Simplified Navigation for Highscore Focus - Reduced to core items
const NAV_ITEMS = APP_CONFIG.NAVIGATION.map(item => ({
  ...item,
  icon: item.icon as RoyalIconProps['variant']
}));

export const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className={cn('bg-background-primary/90 border-b border-accent-primary/20 sticky top-0 z-[100] backdrop-blur-md', className)}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group" aria-label="SpendThrone Home">
            <TiltEffect maxRotation={10}>
              <div className="relative">
                <div className="absolute inset-0 bg-accent-primary blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                <RoyalIcon variant="crown" size={32} className="text-accent-primary relative z-10" />
              </div>
            </TiltEffect>
            <BounceAnimation intensity="subtle" trigger="hover">
              <span className="text-xl font-bold tracking-tight text-text-primary group-hover:text-accent-primary transition-colors">
                SpendThrone
              </span>
            </BounceAnimation>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border border-transparent',
                      isActive(item.href)
                        ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/20 shadow-glow'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                    )}
                  >
                    <BounceAnimation intensity="subtle" trigger="hover">
                      <RoyalIcon variant={item.icon} size={16} />
                    </BounceAnimation>
                    <span>{item.label}</span>
                  </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle className="hidden md:flex" />
            <TiltEffect maxRotation={10}>
              <WalletMultiButton className="!bg-gradient-to-r !from-accent-primary !to-accent-secondary !text-black !font-bold !rounded-full !px-3 md:!px-6 !text-xs md:!text-base hover:!opacity-90 transition-all !shadow-lg !border-none" />
            </TiltEffect>

            <button
              type="button"
              className="md:hidden text-text-primary p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <RippleEffect>
                {isMobileMenuOpen ? <RoyalIcon variant="close" size={24} /> : <RoyalIcon variant="menu" size={24} />}
              </RippleEffect>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-background-primary/95 backdrop-blur-xl z-[60] animate-in slide-in-from-top-5 h-[calc(100vh-80px)] overflow-y-auto">
          <div className="px-4 py-6 space-y-2">
            {NAV_ITEMS.map((item) => (
              <RippleEffect key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-4 rounded-xl transition-colors',
                    isActive(item.href)
                      ? 'bg-accent-primary/10 text-accent-primary'
                      : 'text-text-secondary hover:bg-white/5'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BounceAnimation intensity="subtle" trigger="hover">
                    <RoyalIcon variant={item.icon} size={20} />
                  </BounceAnimation>
                  <span className="font-bold">{item.label}</span>
                </Link>
              </RippleEffect>
            ))}
            
            {/* Mobile Theme Toggle */}
            <div className="border-t border-border-primary/30 mt-4 pt-4 px-2">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="text-text-secondary font-bold ml-2">Appearance</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};