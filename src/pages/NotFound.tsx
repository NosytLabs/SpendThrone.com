import React from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Button, RoyalIcon, GlowPulse, FloatingAnimation } from '../components/ui';

const NotFound: React.FC = () => {
  return (
    <PageLayout layoutType="centered" maxWidth="md">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <FloatingAnimation>
          <div className="relative mb-8">
            <GlowPulse color="purple" intensity="strong" duration={3000}>
              <RoyalIcon variant="map" size={80} className="text-text-muted opacity-50" />
            </GlowPulse>
            <div className="absolute -bottom-2 -right-2">
              <RoyalIcon variant="warning" size={32} className="text-accent-secondary" />
            </div>
          </div>
        </FloatingAnimation>
        
        <h1 className="royal-text-hero text-white mb-4 text-4xl md:text-6xl font-cinzel">Lost in the Realm?</h1>
        
        <p className="text-text-secondary text-lg md:text-xl mb-8 max-w-lg font-serif italic">
          &quot;Here be dragons, or perhaps just a void. The page you seek does not exist within the Kingdom&apos;s archives.&quot;
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/">
            <GlowPulse color="gold" intensity="medium">
              <Button variant="primary" size="lg" className="bg-accent-primary text-black font-bold w-full sm:w-auto shadow-lg hover:shadow-accent-primary/50">
                <RoyalIcon variant="crown" className="mr-2" />
                Return to Throne Room
              </Button>
            </GlowPulse>
          </Link>
          
          <Link to="/help">
            <Button variant="ghost" size="lg" className="border border-border-primary hover:border-text-primary w-full sm:w-auto hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all">
              <RoyalIcon variant="book" className="mr-2" />
              Consult the Guide
            </Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;
