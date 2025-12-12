import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProviders } from './core/providers/AppProviders';
import { Navbar, LoadingOverlay } from './components/ui';
import { isRpcEnabled } from './core/constants/endpoints';
import { ReferralTracker } from '@/features/referral/ReferralTracker';
import { Footer } from './components/layout/Footer';
import { PageTracker } from './shared/components/Analytics/PageTracker';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const History = lazy(() => import('./pages/History'));
const Tiers = lazy(() => import('./pages/Tiers'));
const About = lazy(() => import('./pages/About'));
const GettingStarted = lazy(() => import('./pages/GettingStarted'));
const Help = lazy(() => import('./pages/Help'));
const ReferralPyramid = lazy(() => import('./pages/ReferralPyramid'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Legal = lazy(() => import('./pages/Legal').then(module => ({ default: module.Legal })));

function App() {
  return (
    <AppProviders>
      <PageTracker />
      <ReferralTracker />
      <div className="w-full bg-background-primary container-full flex flex-col flex-grow">
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-background-primary text-text-primary px-4 py-2 rounded-md shadow-lg z-50">
          Skip to main content
        </a>

        <Navbar />

        {!isRpcEnabled() && (
        <div className="bg-warning/10 border-b border-warning/30 text-warning text-xs sm:text-sm py-1.5 px-4 text-center fixed top-[4.5rem] w-full z-40 backdrop-blur-sm flex items-center justify-center gap-2 animate-fade-in-down">
          <span className="font-bold">⚠️ Demo Mode:</span> 
          <span className="opacity-90">Blockchain connections are simulated.</span>
        </div>
      )}

      <main id="main-content" className={`flex-grow w-full flex flex-col relative pt-20 ${!isRpcEnabled() ? 'mt-8' : ''}`}>
        <Suspense fallback={<LoadingOverlay isLoading={true} message="Loading realm..." />}>
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
            <Route path="/legal" element={<Legal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      </div>
    </AppProviders>
  );
}

export default App;
