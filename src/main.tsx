import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/main.css';
import './styles/royal-theme.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import { performanceService } from '@/core/services/performance';

performanceService.init();



// Initialize performance monitoring
if (import.meta.env.DEV) {
  // Log performance report once on initial load and then only on demand
  performanceService.logPerformanceReport();
  
  // Add a method to log performance on demand instead of interval
  (window as typeof window & { logPerformance?: () => void }).logPerformance = () => {
    performanceService.logPerformanceReport();
  };
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
