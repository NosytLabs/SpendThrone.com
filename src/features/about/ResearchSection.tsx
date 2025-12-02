import React from 'react';
import { Section } from '@/components/layout/Section';
import { Card, CardContent } from '@/components/ui/Card';
import { RoyalIcon } from '@/components/ui/RoyalIcon';
import { EntranceAnimation, FloatingAnimation } from '@/components/ui/AnimationUtilities';

const ResearchSection: React.FC = () => (
  <Section title="Behavioral Economics Research" subtitle="Exploring the psychology of wealth signaling in digital environments">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <EntranceAnimation delay={0} duration={600} type="slide-right" trigger="in-view">
        <Card variant="default" className="h-full hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300" aria-label="Status Signaling research finding">
          <CardContent>
            <div className="flex items-start gap-4">
              <FloatingAnimation direction="up" distance={5} duration={3000}>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <RoyalIcon variant="trend" size={24} className="text-white" />
                </div>
              </FloatingAnimation>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-text-primary mb-3">Status Signaling</h3>
                <p className="text-text-secondary text-sm mb-4">Research shows that individuals will pay significant costs to signal status, even when the signal has no intrinsic value.</p>
                <div className="bg-surface-secondary p-3 rounded-lg border border-surface-tertiary">
                  <p className="text-xs text-text-secondary mb-2 uppercase tracking-wider font-semibold">Key Finding</p>
                  <p className="text-sm font-medium text-text-primary italic">&quot;People derive utility from relative position, not absolute wealth&quot;</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </EntranceAnimation>

      <EntranceAnimation delay={200} duration={600} type="slide-left" trigger="in-view">
        <Card variant="default" className="h-full hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300" aria-label="Social Comparison research finding">
          <CardContent>
            <div className="flex items-start gap-4">
              <FloatingAnimation direction="up" distance={5} duration={3500}>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <RoyalIcon variant="users" size={24} className="text-white" />
                </div>
              </FloatingAnimation>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-text-primary mb-3">Social Comparison</h3>
                <p className="text-text-secondary text-sm mb-4">Humans naturally compare themselves to others, and these comparisons drive economic decisions.</p>
                <div className="bg-surface-secondary p-3 rounded-lg border border-surface-tertiary">
                  <div className="flex items-center gap-2 mb-2">
                    <RoyalIcon variant="brain" size={16} className="text-accent-primary" />
                    <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Research Insight</p>
                  </div>
                  <p className="text-sm font-medium text-text-primary italic">&quot;Relative deprivation can be more motivating than absolute poverty&quot;</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </EntranceAnimation>
    </div>
  </Section>
);

export default React.memo(ResearchSection);