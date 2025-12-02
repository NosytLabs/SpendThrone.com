import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { RoyalIcon } from '@/components/ui/RoyalIcon';
import { EntranceAnimation, FloatingAnimation, GlowPulse } from '@/components/ui/AnimationUtilities';

const OverviewSection: React.FC = () => (
  <div className="space-y-6">
    {/* Main Overview Card */}
    <EntranceAnimation delay={0} duration={600} type="fade-in" trigger="in-view">
      <Card variant="elevated" aria-label="SpendThrone platform overview" className="hover:shadow-[0_0_25px_rgba(147,51,234,0.15)] transition-all duration-300">
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <FloatingAnimation direction="up" distance={5} duration={3000}>
                <div className="w-12 h-12 bg-gradient-to-br from-solana-purple to-solana-green rounded-xl flex items-center justify-center shadow-lg shadow-solana-purple/20">
                  <RoyalIcon variant="crown" size={24} className="text-white" />
                </div>
              </FloatingAnimation>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-text-primary mb-2 bg-clip-text text-transparent bg-gradient-to-r from-solana-purple to-solana-green">Revolutionary Social DeFi</h2>
              <p className="text-text-secondary leading-relaxed">
                SpendThrone transforms conspicuous consumption into a transparent, competitive social experiment.
                Built on Solana&apos;s high-performance blockchain, we&apos;re pioneering a new category of social DeFi
                that explores the psychology of wealth display in the digital age.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </EntranceAnimation>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Real-Time Rankings */}
      <EntranceAnimation delay={100} duration={600} type="slide-up" trigger="in-view">
        <Card variant="outlined" aria-label="Real-Time Rankings feature" className="h-full hover:shadow-lg hover:shadow-solana-purple/10 hover:border-solana-purple/30 transition-all duration-300">
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-solana-purple to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                <RoyalIcon variant="barChart" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-solana-purple transition-colors">Real-Time Rankings</h3>
                <p className="text-text-secondary text-sm">Dynamic leaderboards powered by on-chain data with instant updates and transparent scoring algorithms.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </EntranceAnimation>

      {/* Tier System */}
      <EntranceAnimation delay={200} duration={600} type="slide-up" trigger="in-view">
        <Card variant="outlined" aria-label="Tier System feature" className="h-full hover:shadow-lg hover:shadow-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300">
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-solana-green to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                <RoyalIcon variant="trophy" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-yellow-500 transition-colors">Tier System</h3>
                <p className="text-text-secondary text-sm">Hierarchical status progression with exclusive benefits, recognition, and access to premium features.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </EntranceAnimation>

      {/* Social Mechanics */}
      <EntranceAnimation delay={300} duration={600} type="slide-up" trigger="in-view">
        <Card variant="outlined" aria-label="Social Mechanics feature" className="h-full hover:shadow-lg hover:shadow-pink-500/10 hover:border-pink-500/30 transition-all duration-300">
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                <RoyalIcon variant="send" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-pink-500 transition-colors">Social Mechanics</h3>
                <p className="text-text-secondary text-sm">Competitive gameplay elements that encourage engagement and create meaningful social interactions.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </EntranceAnimation>

      {/* Gamification */}
      <EntranceAnimation delay={400} duration={600} type="slide-up" trigger="in-view">
        <Card variant="outlined" aria-label="Gamification feature" className="h-full hover:shadow-lg hover:shadow-orange-500/10 hover:border-orange-500/30 transition-all duration-300">
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                <RoyalIcon variant="star" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-orange-500 transition-colors">Gamification</h3>
                <p className="text-text-secondary text-sm">Achievement systems, seasonal competitions, and rewards that make wealth signaling engaging and fun.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </EntranceAnimation>
    </div>

    {/* Experimental Warning */}
    <EntranceAnimation delay={500} duration={600} type="fade-in" trigger="in-view">
      <Card className="border-warning hover:bg-warning/5 transition-colors duration-300" aria-label="Experimental Warning">
        <CardContent>
          <div className="flex items-start gap-4">
            <GlowPulse color="gold" intensity="subtle" duration={2}>
              <div className="w-8 h-8 bg-warning rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                <RoyalIcon variant="error" size={16} className="text-white" />
              </div>
            </GlowPulse>
            <div>
              <h3 className="text-lg font-semibold text-warning mb-2">Experimental Warning</h3>
              <p className="text-text-secondary text-sm">This is a social experiment. All deposits are permanent tributes with no utility, returns, or withdrawals.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </EntranceAnimation>
  </div>
);

export default React.memo(OverviewSection);