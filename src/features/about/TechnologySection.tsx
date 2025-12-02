import React from 'react';
import { Section } from '@/components/layout/Section';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RoyalIcon } from '@/components/ui/RoyalIcon';
import { EntranceAnimation, FloatingAnimation } from '@/components/ui';

const TechnologySection: React.FC = () => (
  <Section title="Built on Solana" subtitle="Leveraging cutting-edge blockchain technology for optimal performance">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <EntranceAnimation delay={0} duration={600} type="slide-up" trigger="in-view">
        <Card variant="default" aria-label="High Performance technology feature" className="hover:shadow-lg hover:shadow-accent-primary/20 transition-all duration-300">
          <CardContent>
            <div className="flex items-start gap-4">
              <FloatingAnimation direction="up" distance={5} duration={3000}>
                <div className="w-12 h-12 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                  <RoyalIcon variant="zap" size={24} className="text-white" />
                </div>
              </FloatingAnimation>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-text-primary mb-2">High Performance</h3>
                <p className="text-text-secondary text-sm mb-3">Solana&apos;s 400ms block times enable real-time leaderboard updates and instant transaction confirmations.</p>
                <div className="flex gap-2 text-xs">
                  <Badge variant="secondary">65,000 TPS</Badge>
                  <Badge variant="secondary">$0.00025 fees</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </EntranceAnimation>

      <EntranceAnimation delay={200} duration={600} type="slide-up" trigger="in-view">
        <Card variant="default" aria-label="Smart Contracts technology feature" className="hover:shadow-lg hover:shadow-success/20 transition-all duration-300">
          <CardContent>
            <div className="flex items-start gap-4">
              <FloatingAnimation direction="up" distance={5} duration={2500}>
                <div className="w-12 h-12 bg-gradient-to-br from-success to-tier-rare rounded-xl flex items-center justify-center flex-shrink-0">
                  <RoyalIcon variant="shield" size={24} className="text-white" />
                </div>
              </FloatingAnimation>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-text-primary mb-3">Smart Contracts</h3>
                <p className="text-text-secondary text-sm mb-4">Rust-based programs ensure secure, auditable, and transparent handling of all deposits and rankings.</p>
                <div className="space-y-1 text-xs text-text-secondary">
                  <div className="flex items-center gap-2"><div className="w-1 h-1 bg-success rounded-full"></div><span>Immutable deposits</span></div>
                  <div className="flex items-center gap-2"><div className="w-1 h-1 bg-success rounded-full"></div><span>Transparent scoring</span></div>
                  <div className="flex items-center gap-2"><div className="w-1 h-1 bg-success rounded-full"></div><span>Automated rankings</span></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </EntranceAnimation>

      <EntranceAnimation delay={400} duration={600} type="slide-up" trigger="in-view">
        <Card variant="default" aria-label="Decentralized technology feature" className="hover:shadow-lg hover:shadow-accent-secondary/20 transition-all duration-300">
          <CardContent>
            <div className="flex items-start gap-4">
              <FloatingAnimation direction="up" distance={5} duration={3500}>
                <div className="w-12 h-12 bg-gradient-to-br from-accent-secondary to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <RoyalIcon variant="map" size={24} className="text-white" />
                </div>
              </FloatingAnimation>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-text-primary mb-3">Decentralized</h3>
                <p className="text-text-secondary text-sm mb-4">Built on a permissionless, censorship-resistant network ensuring long-term sustainability.</p>
                <div className="space-y-1 text-xs text-text-secondary">
                  <div className="flex items-center gap-2"><div className="w-1 h-1 bg-accent-secondary rounded-full"></div><span>No single point of failure</span></div>
                  <div className="flex items-center gap-2"><div className="w-1 h-1 bg-accent-secondary rounded-full"></div><span>Global accessibility</span></div>
                  <div className="flex items-center gap-2"><div className="w-1 h-1 bg-accent-secondary rounded-full"></div><span>Community governance</span></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </EntranceAnimation>
    </div>

    <EntranceAnimation delay={600} duration={800} type="fade-in" trigger="in-view">
      <Card variant="default" aria-label="Technical Architecture details" className="hover:shadow-lg hover:shadow-accent-primary/10 transition-all duration-300">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Technical Architecture</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <FloatingAnimation direction="up" distance={3} duration={4000}>
                <div className="w-8 h-8 bg-surface-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <RoyalIcon variant="scroll" size={16} className="text-accent-primary" />
                </div>
              </FloatingAnimation>
              <div><h4 className="font-medium text-text-primary mb-1">Smart Contracts</h4><p className="text-text-secondary text-sm">Rust programs handling deposits, rankings, and tier management</p></div>
            </div>
            <div className="flex items-start gap-4">
              <FloatingAnimation direction="up" distance={3} duration={4500}>
                <div className="w-8 h-8 bg-surface-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <RoyalIcon variant="barChart" size={16} className="text-success" />
                </div>
              </FloatingAnimation>
              <div><h4 className="font-medium text-text-primary mb-1">Real-time Data</h4><p className="text-text-secondary text-sm">WebSocket connections for live leaderboard updates</p></div>
            </div>
            <div className="flex items-start gap-4">
              <FloatingAnimation direction="up" distance={3} duration={5000}>
                <div className="w-8 h-8 bg-surface-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <RoyalIcon variant="shield" size={16} className="text-warning" />
                </div>
              </FloatingAnimation>
              <div><h4 className="font-medium text-text-primary mb-1">Security</h4><p className="text-text-secondary text-sm">Multi-signature wallets and audited smart contracts</p></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </EntranceAnimation>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      <EntranceAnimation delay={800} duration={500} type="slide-up" trigger="in-view">
        <Card variant="outlined" aria-label="Frontend technology stack" className="hover:shadow-lg hover:shadow-accent-secondary/20 transition-all duration-300">
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <FloatingAnimation direction="up" distance={3} duration={3000}>
                <RoyalIcon variant="sparkles" size={24} className="text-accent-secondary" />
              </FloatingAnimation>
              <h3 className="text-lg font-semibold text-text-primary">Frontend</h3>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary" className="mr-2">React 18</Badge>
              <Badge variant="secondary" className="mr-2">TypeScript</Badge>
              <Badge variant="secondary" className="mr-2">Tailwind CSS</Badge>
              <Badge variant="secondary" className="mr-2">Vite</Badge>
            </div>
          </CardContent>
        </Card>
      </EntranceAnimation>
      
      <EntranceAnimation delay={900} duration={500} type="slide-up" trigger="in-view">
        <Card variant="outlined" aria-label="Blockchain technology stack" className="hover:shadow-lg hover:shadow-accent-primary/20 transition-all duration-300">
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <FloatingAnimation direction="up" distance={3} duration={3200}>
                <RoyalIcon variant="pyramid" size={24} className="text-accent-primary" />
              </FloatingAnimation>
              <h3 className="text-lg font-semibold text-text-primary">Blockchain</h3>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary" className="mr-2">Solana</Badge>
              <Badge variant="secondary" className="mr-2">Anchor Framework</Badge>
              <Badge variant="secondary" className="mr-2">Web3.js</Badge>
              <Badge variant="secondary" className="mr-2">Phantom Wallet</Badge>
            </div>
          </CardContent>
        </Card>
      </EntranceAnimation>
      
      <EntranceAnimation delay={1000} duration={500} type="slide-up" trigger="in-view">
        <Card variant="outlined" aria-label="Data technology stack" className="hover:shadow-lg hover:shadow-success/20 transition-all duration-300">
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <FloatingAnimation direction="up" distance={3} duration={3400}>
                <RoyalIcon variant="book" size={24} className="text-success" />
              </FloatingAnimation>
              <h3 className="text-lg font-semibold text-text-primary">Data</h3>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary" className="mr-2">PostgreSQL</Badge>
              <Badge variant="secondary" className="mr-2">Redis</Badge>
              <Badge variant="secondary" className="mr-2">GraphQL</Badge>
              <Badge variant="secondary" className="mr-2">REST API</Badge>
            </div>
          </CardContent>
        </Card>
      </EntranceAnimation>
      
      <EntranceAnimation delay={1100} duration={500} type="slide-up" trigger="in-view">
        <Card variant="outlined" aria-label="Security technology stack" className="hover:shadow-lg hover:shadow-accent-secondary/20 transition-all duration-300">
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <FloatingAnimation direction="up" distance={3} duration={3600}>
                <RoyalIcon variant="shield" size={24} className="text-accent-secondary" />
              </FloatingAnimation>
              <h3 className="text-lg font-semibold text-text-primary">Security</h3>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary" className="mr-2">JWT Auth</Badge>
              <Badge variant="secondary" className="mr-2">Rate Limiting</Badge>
              <Badge variant="secondary" className="mr-2">HTTPS</Badge>
              <Badge variant="secondary" className="mr-2">Smart Contract Audits</Badge>
            </div>
          </CardContent>
        </Card>
      </EntranceAnimation>
      
      <EntranceAnimation delay={1200} duration={500} type="slide-up" trigger="in-view">
        <Card variant="outlined" aria-label="DevOps technology stack" className="hover:shadow-lg hover:shadow-warning/20 transition-all duration-300">
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <FloatingAnimation direction="up" distance={3} duration={3800}>
                <RoyalIcon variant="settings" size={24} className="text-warning" />
              </FloatingAnimation>
              <h3 className="text-lg font-semibold text-text-primary">DevOps</h3>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary" className="mr-2">Docker</Badge>
              <Badge variant="secondary" className="mr-2">Kubernetes</Badge>
              <Badge variant="secondary" className="mr-2">AWS</Badge>
              <Badge variant="secondary" className="mr-2">GitHub Actions</Badge>
            </div>
          </CardContent>
        </Card>
      </EntranceAnimation>
      
      <EntranceAnimation delay={1300} duration={500} type="slide-up" trigger="in-view">
        <Card variant="outlined" aria-label="Analytics technology stack" className="hover:shadow-lg hover:shadow-accent-primary/20 transition-all duration-300">
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <FloatingAnimation direction="up" distance={3} duration={4000}>
                <RoyalIcon variant="lineChart" size={24} className="text-accent-primary" />
              </FloatingAnimation>
              <h3 className="text-lg font-semibold text-text-primary">Analytics</h3>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary" className="mr-2">Google Analytics</Badge>
              <Badge variant="secondary" className="mr-2">Mixpanel</Badge>
              <Badge variant="secondary" className="mr-2">Custom Dashboards</Badge>
              <Badge variant="secondary" className="mr-2">Real-time Metrics</Badge>
            </div>
          </CardContent>
        </Card>
      </EntranceAnimation>
    </div>
  </Section>
);

export default React.memo(TechnologySection);