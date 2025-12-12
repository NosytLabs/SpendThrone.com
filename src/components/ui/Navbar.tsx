import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectWalletButton } from './ConnectWalletButton';
import { RoyalIcon, RoyalIconProps } from './RoyalIcon';

import { APP_CONFIG } from '@/core/constants/appConfig';
import { useWallet } from '@solana/wallet-adapter-react';
import { Analytics, EVENTS } from '@/shared/services/analytics';

interface NavLink {
  name: string;
  path: string;
  icon: RoyalIconProps['variant'];
}

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { publicKey, connected } = useWallet();

  useEffect(() => {
    if (connected && publicKey) {
      const address = publicKey.toString();
      Analytics.identify(address);
      Analytics.track(EVENTS.WALLET.CONNECT, { address });
    }
  }, [connected, publicKey]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: NavLink[] = APP_CONFIG.NAVIGATION.map(link => ({
    name: link.label,
    path: link.href,
    icon: link.icon as RoyalIconProps['variant']
  })).filter(link => !['/start', '/profile'].includes(link.path)); // Keep /referral visible now
  
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen
          ? 'bg-black/90 backdrop-blur-md border-b border-accent-primary/20 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-accent-primary blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <RoyalIcon variant="crown" size={32} className="text-accent-primary relative z-10" />
            </div>
            <span className="font-cinzel font-bold text-2xl text-white tracking-wider group-hover:text-accent-primary transition-colors">
              {APP_CONFIG.APP_NAME_DISPLAY}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 h-10 rounded-md text-lg font-medium transition-colors duration-200 flex items-center gap-2 ${
                  location.pathname === link.path
                    ? 'text-accent-primary'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                {location.pathname === link.path && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-primary shadow-[0_0_10px_rgba(234,179,8,0.5)]"></span>
                )}
                <RoyalIcon variant={link.icon} size={16} className={location.pathname === link.path ? 'text-accent-primary' : 'text-text-muted'} />
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-6">
            <ConnectWalletButton />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-text-secondary hover:text-white p-2"
            >
              <RoyalIcon variant={mobileMenuOpen ? 'close' : 'menu'} size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-20 left-0 w-full royal-glass transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-base font-medium flex items-center gap-3 royal-hover-lift ${
                location.pathname === link.path
                  ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20 royal-border-glow'
                  : 'text-text-secondary hover:bg-white/5 hover:text-white'
              }`}
            >
              <RoyalIcon variant={link.icon} size={18} />
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10 flex justify-center">
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
};
