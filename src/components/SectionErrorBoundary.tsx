import React from 'react';
import { logError } from '@/shared/utils/logger';
import { Card } from './ui/Card';

interface SectionErrorBoundaryProps {
  children: React.ReactNode;
  sectionName: string;
  fallback?: React.ReactNode;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class SectionErrorBoundary extends React.Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): SectionErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError(`SectionErrorBoundary (${this.props.sectionName}) caught:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card variant="glass" className="p-6 border-destructive/20">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-error mb-2">
              {this.props.sectionName} Error
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              This section encountered an error. Please try refreshing the page.
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 text-sm font-medium bg-primary text-text rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}