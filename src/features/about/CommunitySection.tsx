import React from 'react';
import { Section } from '@/components/layout/Section';
import { Card, CardContent } from '@/components/ui/Card';
import { RoyalIcon } from '@/components/ui/RoyalIcon';
import { EntranceAnimation, FloatingAnimation } from '@/components/ui';

const CommunitySection: React.FC = () => (
  <Section title="Community & Governance" subtitle="Building a decentralized ecosystem together">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <EntranceAnimation delay={0} duration={600} type="slide-up" trigger="in-view">
        <Card variant="default" className="hover:shadow-lg hover:shadow-success/20 transition-all duration-300" aria-label="Community Driven information">
          <CardContent>
            <div className="flex items-start gap-4">
              <FloatingAnimation direction="up" distance={5} duration={3000}>
                <div className="w-12 h-12 bg-gradient-to-br from-success to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <RoyalIcon variant="users" size={24} className="text-white" />
                </div>
              </FloatingAnimation>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-text-primary mb-3">Community Driven</h3>
                <p className="text-text-secondary text-sm mb-4">SpendThrone is built by and for the community, with transparent governance and open participation.</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-text-secondary"><RoyalIcon variant="target" size={16} className="text-success" /><span>Open source development</span></div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary"><RoyalIcon variant="trend" size={16} className="text-success" /><span>Community proposals</span></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </EntranceAnimation>

      <EntranceAnimation delay={200} duration={600} type="slide-up" trigger="in-view">
        <Card variant="default" className="hover:shadow-lg hover:shadow-accent-primary/20 transition-all duration-300" aria-label="Engagement Rewards information">
          <CardContent>
            <div className="flex items-start gap-4">
              <FloatingAnimation direction="up" distance={5} duration={3500}>
                <div className="w-12 h-12 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                  <RoyalIcon variant="zap" size={24} className="text-white" />
                </div>
              </FloatingAnimation>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-text-primary mb-3">Engagement Rewards</h3>
                <p className="text-text-secondary text-sm mb-4">Active community members earn recognition and exclusive access to new features.</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-text-secondary"><RoyalIcon variant="trophy" size={16} className="text-accent-primary" /><span>Community challenges</span></div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary"><RoyalIcon variant="sparkles" size={16} className="text-accent-primary" /><span>Recognition badges</span></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </EntranceAnimation>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <EntranceAnimation delay={400} duration={600} type="slide-up" trigger="in-view">
        <Card variant="outlined" aria-label="Community voting governance" className="hover:shadow-lg hover:shadow-accent-primary/20 transition-all duration-300">
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <FloatingAnimation direction="up" distance={3} duration={4000}>
                <RoyalIcon variant="check" size={24} className="text-accent-primary" />
              </FloatingAnimation>
              <h3 className="text-lg font-semibold text-text-primary">Community Voting</h3>
            </div>
            <p className="text-text-secondary text-sm">Token holders participate in platform governance decisions through decentralized voting mechanisms.</p>
          </CardContent>
        </Card>
      </EntranceAnimation>
      
      <EntranceAnimation delay={500} duration={600} type="slide-up" trigger="in-view">
        <Card variant="outlined" aria-label="Treasury management governance" className="hover:shadow-lg hover:shadow-success/20 transition-all duration-300">
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <FloatingAnimation direction="up" distance={3} duration={4200}>
                <RoyalIcon variant="chest" size={24} className="text-success" />
              </FloatingAnimation>
              <h3 className="text-lg font-semibold text-text-primary">Treasury Management</h3>
            </div>
            <p className="text-text-secondary text-sm">Transparent allocation of platform fees to development, marketing, and community initiatives.</p>
          </CardContent>
        </Card>
      </EntranceAnimation>
      
      <EntranceAnimation delay={600} duration={600} type="slide-up" trigger="in-view">
        <Card variant="outlined" aria-label="Proposal system governance" className="hover:shadow-lg hover:shadow-accent-secondary/20 transition-all duration-300">
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <FloatingAnimation direction="up" distance={3} duration={4400}>
                <RoyalIcon variant="scroll" size={24} className="text-accent-secondary" />
              </FloatingAnimation>
              <h3 className="text-lg font-semibold text-text-primary">Proposal System</h3>
            </div>
            <p className="text-text-secondary text-sm">Community members can submit improvement proposals and receive rewards for successful implementations.</p>
          </CardContent>
        </Card>
      </EntranceAnimation>
    </div>
  </Section>
);

export default React.memo(CommunitySection);