import React from 'react';
import { Section } from '@/components/layout/Section';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RoyalIcon } from '@/components/ui/RoyalIcon';
import { EntranceAnimation, GlowPulse, FloatingAnimation } from '@/components/ui/AnimationUtilities';

const RoadmapSection: React.FC = () => (
  <Section title="Development Roadmap" subtitle="Our vision for the future of social DeFi">
    <div className="relative mt-8">
      {/* Animated connecting line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-primary via-accent-secondary to-accent-primary opacity-30" />
      
      <div className="space-y-8">
        {/* Phase 1: Foundation */}
        <EntranceAnimation delay={0} duration={600} type="slide-right" trigger="in-view">
          <div className="relative flex items-start gap-6 group">
            <FloatingAnimation direction="up" distance={3} duration={4000}>
              <div className="w-16 h-16 bg-gradient-to-br from-accent-primary to-purple-800 rounded-full flex items-center justify-center text-white font-bold text-lg z-10 shadow-lg border-2 border-surface-primary group-hover:border-accent-primary transition-colors duration-300">
                1
              </div>
            </FloatingAnimation>
            <Card variant="outlined" className="flex-1 hover:shadow-lg hover:shadow-accent-primary/10 hover:border-accent-primary/30 transition-all duration-300">
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-primary transition-colors">Foundation Phase</h3>
                  <Badge variant="primary" className="bg-accent-primary/20 text-accent-primary border-accent-primary/50">Completed</Badge>
                </div>
                <p className="text-text-secondary mb-4">Core platform development, smart contract deployment, and initial user onboarding.</p>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-center gap-2">
                    <RoyalIcon variant="check" size={16} className="text-success" />
                    <span>Smart contract development and auditing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <RoyalIcon variant="check" size={16} className="text-success" />
                    <span>Basic ranking system implementation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <RoyalIcon variant="check" size={16} className="text-success" />
                    <span>Wallet integration and user authentication</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </EntranceAnimation>

        {/* Phase 2: Growth (Active) */}
        <EntranceAnimation delay={200} duration={600} type="slide-right" trigger="in-view">
          <div className="relative flex items-start gap-6 group">
            <GlowPulse color="green" intensity="medium" duration={2}>
              <div className="w-16 h-16 bg-gradient-to-br from-success to-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-lg z-10 shadow-[0_0_15px_rgba(34,197,94,0.4)] border-2 border-surface-primary group-hover:border-success transition-colors duration-300">
                2
              </div>
            </GlowPulse>
            <Card variant="elevated" className="flex-1 border-success/30 shadow-[0_0_20px_rgba(34,197,94,0.05)] hover:shadow-[0_0_25px_rgba(34,197,94,0.15)] transition-all duration-300 transform hover:scale-[1.01]">
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary group-hover:text-success transition-colors">Growth Phase</h3>
                  <Badge variant="secondary" className="bg-success/20 text-success border-success/50 animate-pulse">In Progress</Badge>
                </div>
                <p className="text-text-secondary mb-4">Enhanced features, community building, and platform optimization.</p>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-center gap-2">
                    <RoyalIcon variant="check" size={16} className="text-success" />
                    <span>Advanced ranking algorithms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <RoyalIcon variant="check" size={16} className="text-success" />
                    <span>Social features and community tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <RoyalIcon variant="clock" size={16} className="text-accent-secondary animate-pulse" />
                    <span className="text-text-primary font-medium">Mobile application development</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </EntranceAnimation>

        {/* Phase 3: Expansion */}
        <EntranceAnimation delay={400} duration={600} type="slide-right" trigger="in-view">
          <div className="relative flex items-start gap-6 group">
            <FloatingAnimation direction="up" distance={3} duration={5000}>
              <div className="w-16 h-16 bg-gradient-to-br from-surface-tertiary to-surface-secondary rounded-full flex items-center justify-center text-white font-bold text-lg z-10 border-2 border-surface-primary group-hover:border-text-muted transition-colors duration-300">
                3
              </div>
            </FloatingAnimation>
            <Card variant="outlined" className="flex-1 hover:shadow-lg hover:shadow-text-primary/5 hover:border-text-muted/30 transition-all duration-300 opacity-80 group-hover:opacity-100">
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary group-hover:text-text-primary transition-colors">Expansion Phase</h3>
                  <Badge variant="secondary" className="bg-surface-tertiary text-text-muted">Planned</Badge>
                </div>
                <p className="text-text-secondary mb-4">Multi-chain support, advanced analytics, and enterprise features.</p>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-center gap-2">
                    <RoyalIcon variant="map" size={16} className="text-text-muted group-hover:text-accent-secondary transition-colors" />
                    <span>Cross-chain compatibility</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <RoyalIcon variant="target" size={16} className="text-text-muted group-hover:text-accent-secondary transition-colors" />
                    <span>Advanced analytics dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <RoyalIcon variant="target" size={16} className="text-text-muted group-hover:text-accent-secondary transition-colors" />
                    <span>Enterprise API and integrations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </EntranceAnimation>
      </div>
    </div>
  </Section>
);

export default React.memo(RoadmapSection);