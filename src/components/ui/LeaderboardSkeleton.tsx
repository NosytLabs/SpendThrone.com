import React from 'react';
import { PageLayout, PageHeader, Section } from '../layout';
import { Card, Skeleton, SkeletonTable } from '../ui';
import { APP_CONFIG } from '@/core/constants/appConfig';

export const LeaderboardSkeleton: React.FC = () => {
  return (
    <PageLayout maxWidth="full" showBackgroundEffects={false}>
      <PageHeader
        title={APP_CONFIG.SECTIONS.THRONE_RANKINGS}
        subtitle={APP_CONFIG.TAGLINES.LEADERBOARD}
        icon="trophy"
        variant="compact"
      />
      <Section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card variant="glass" className="lg:col-span-2">
            <div className="flex justify-between items-start gap-6">
              <div className="flex items-center gap-4">
                <Skeleton variant="rect" className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton variant="text" className="h-5 w-32" />
                  <Skeleton variant="text" className="h-4 w-24" />
                </div>
              </div>
              <div className="text-right space-y-2">
                <Skeleton variant="text" className="h-4 w-20" />
                <Skeleton variant="text" className="h-5 w-28" />
              </div>
            </div>
          </Card>
          
          <Card variant="glass" className="lg:col-span-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton variant="rect" className="h-8 w-8 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton variant="text" className="h-5 w-20" />
                  <Skeleton variant="text" className="h-4 w-24" />
                </div>
              </div>
              <div className="text-right space-y-2">
                <Skeleton variant="text" className="h-4 w-16" />
                <Skeleton variant="text" className="h-5 w-12" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          <div className="lg:col-span-1 w-full">
            <Skeleton variant="text" className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} variant="glass" className="p-4">
                  <Skeleton variant="text" className="h-4 w-20 mb-2" />
                  <Skeleton variant="text" className="h-6 w-16" />
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 w-full">
            <Card variant="glass" className="w-full">
              <div className="space-y-6 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 w-full">
                  <Skeleton variant="text" className="h-6 w-40" />
                  <Skeleton variant="rect" className="h-10 w-32 rounded-lg" />
                </div>
                <SkeletonTable rows={8} columns={6} />
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};
