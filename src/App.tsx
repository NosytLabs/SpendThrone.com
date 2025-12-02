import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import WalletContextProvider from './core/contexts/WalletContextProvider';
import { DegradedModeProvider } from './core/contexts/DegradedModeContext';
import { ErrorBoundary } from './components/ui';
import { Navigation } from './components/layout/Navigation';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { EnhancedToastProvider } from './components/ui/EnhancedToast';
import { ScrollToTop, RoyalIcon } from './components/ui';
import { ReferralTracker } from './components/ReferralTracker';
import { isRpcEnabled } from './core/constants/endpoints';
import { UserPreferencesProvider } from './components/ui/UserPreferences';
import { APP_CONFIG } from './core/constants/appConfig';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const History = lazy(() => import('./pages/History'));
const Tiers = lazy(() => import('./pages/Tiers'));
const About = lazy(() => import('./pages/About'));
const GettingStarted = lazy(() => import('./pages/GettingStarted'));
const Help = lazy(() => import('./pages/Help'));
const ReferralPyramid = lazy(() => import('./pages/ReferralPyramid'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Import new modern design system
import './styles/main.css';

// Force rebuild comment
function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <WalletContextProvider>
          <EnhancedToastProvider>
            <UserPreferencesProvider>
              <DegradedModeProvider>
              <Router>
              <ReferralTracker />
              <ScrollToTop />
              <div className="w-full bg-background-primary animate-modern-fade-in container-full flex flex-col flex-grow">
                {/* Skip to main content link for accessibility */}
                <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-background-primary text-text-primary px-4 py-2 rounded-md shadow-lg z-50">
                  Skip to main content
                </a>

                <Navigation />

              {!isRpcEnabled() && (
                <div className="bg-warning/10 border-b border-warning/30 text-warning text-sm py-2 px-4 text-center">
                  Royal notice: blockchain interactions are temporarily disabled while we upgrade our systems. Browsing is still available.
                </div>
              )}

            <div className="flex-grow w-full flex flex-col relative">
              <Suspense fallback={<div className="flex-grow flex items-center justify-center min-h-[50vh]"><LoadingSpinner /></div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/tiers" element={<Tiers />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/start" element={<GettingStarted />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/referral" element={<ReferralPyramid />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/:walletAddress" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>

            {/* Modern Footer */}
            <footer className="bg-background-secondary border-t border-border-primary animate-modern-slide-up container-full mt-auto" role="contentinfo">
              <div className="px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                  <div className="col-span-1 md:col-span-6 lg:col-span-6 flex flex-col">
                    <h3 className="royal-text-title text-accent-primary mb-4">SpendThrone</h3>
                    <div className="flex-grow">
                      <p className="text-text-secondary mb-6">
                        The ultimate social experiment on Solana. Compete, earn status, and climb the leaderboard.
                      </p>
                    </div>
                    <div className="flex space-x-4 justify-center md:justify-start mt-auto">
                      <a href={APP_CONFIG.SOCIALS.TWITTER} target="_blank" rel="noopener noreferrer" className="web3-social-icon inline-flex items-center justify-center p-2 rounded-full hover:bg-white/5 transition-colors text-text-secondary hover:text-accent-primary" aria-label="Twitter">
                        <RoyalIcon variant="twitter" size={24} />
                      </a>
                      <a href={APP_CONFIG.SOCIALS.DISCORD} target="_blank" rel="noopener noreferrer" className="web3-social-icon inline-flex items-center justify-center p-2 rounded-full hover:bg-white/5 transition-colors text-text-secondary hover:text-accent-primary" aria-label="Discord">
                        <RoyalIcon variant="discord" size={24} />
                      </a>
                    </div>

                  </div>

                  <div className="col-span-1 md:col-span-3 lg:col-span-3 flex flex-col">
                    <h4 className="royal-text-subtitle text-text-primary mb-4">Platform</h4>
                    <div className="flex-grow">
                      <ul className="space-y-3">
                        <li><Link to="/leaderboard" className="web3-footer-link">Leaderboard</Link></li>
                        <li><Link to="/tiers" className="web3-footer-link">Tiers</Link></li>
                        <li><Link to="/history" className="web3-footer-link">History</Link></li>
                      </ul>
                    </div>
                    <div className="mt-auto h-6"></div>
                  </div>

                  <div className="col-span-1 md:col-span-3 lg:col-span-3 flex flex-col">
                    <h4 className="royal-text-subtitle text-text-primary mb-4">Support</h4>
                    <div className="flex-grow">
                      <ul className="space-y-3">
                        <li><Link to="/about" className="web3-footer-link">About</Link></li>
                        <li><Link to="/help" className="web3-footer-link">Help</Link></li>
                      </ul>
                    </div>
                    <div className="mt-auto h-6"></div>
                  </div>
                </div>

                <div className="border-t border-border-primary mt-12 pt-8 text-center">
                  <p className="text-text-secondary">&copy; 2024 SpendThrone. All rights reserved.</p>
                  <p className="text-text-muted text-sm mt-2">Built with ⚡ on Solana</p>
                </div>
              </div>
              </footer>
            </div>
            </Router>
            </DegradedModeProvider>
          </UserPreferencesProvider>
        </EnhancedToastProvider>
      </WalletContextProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
