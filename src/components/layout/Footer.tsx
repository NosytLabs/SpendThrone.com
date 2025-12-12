import React from 'react';
import { Link } from 'react-router-dom';
import { RoyalIcon } from '@/components/ui';
import { APP_CONFIG } from '@/core/constants/appConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background-secondary border-t border-border-primary animate-modern-slide-up mt-auto" role="contentinfo">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          <div className="col-span-1 md:col-span-6 lg:col-span-6 flex flex-col">
            <h3 className="royal-text-title text-accent-primary mb-4 flex items-center h-8">SpendThrone</h3>
            <div className="flex-grow">
              <p className="text-text-secondary mb-6 max-w-sm">
                The ultimate social experiment on Solana. Compete, earn status, and climb the leaderboard.
              </p>
            </div>
            <div className="flex space-x-4 items-center mt-auto">
              <a href={APP_CONFIG.SOCIALS.TWITTER} target="_blank" rel="noopener noreferrer" className="web3-social-icon inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/5 transition-colors text-text-secondary hover:text-accent-primary" aria-label="Twitter">
                <RoyalIcon variant="twitter" size={20} />
              </a>
              <a href={APP_CONFIG.SOCIALS.DISCORD} target="_blank" rel="noopener noreferrer" className="web3-social-icon inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/5 transition-colors text-text-secondary hover:text-accent-primary" aria-label="Discord">
                <RoyalIcon variant="discord" size={20} />
              </a>
            </div>

          </div>

          <div className="col-span-1 md:col-span-3 lg:col-span-3 flex flex-col">
            <h4 className="royal-text-subtitle text-text-primary mb-4">Platform</h4>
            <div className="flex-grow">
              <ul className="space-y-3">
                <li>
                  <Link to="/leaderboard" className="text-text-secondary hover:text-white transition-colors">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link to="/tiers" className="text-text-secondary hover:text-white transition-colors">
                    Tiers & Rewards
                  </Link>
                </li>
                <li>
                  <Link to="/history" className="text-text-secondary hover:text-white transition-colors">
                    History
                  </Link>
                </li>
                <li>
                  <Link to="/legal" className="text-text-secondary hover:text-white transition-colors">
                    Legal / Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-span-1 md:col-span-3 lg:col-span-3 flex flex-col">
            <h4 className="royal-text-subtitle text-text-primary mb-4">Resources</h4>
            <div className="flex-grow">
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-text-secondary hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="text-text-secondary hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/start" className="text-text-secondary hover:text-white transition-colors">
                    Getting Started
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border-primary flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-sm">
            &copy; {new Date().getFullYear()} SpendThrone. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-text-secondary opacity-70 hover:opacity-100 transition-opacity">
             <span>Built on</span>
             <RoyalIcon variant="solana" size={16} />
             <span>Solana</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
