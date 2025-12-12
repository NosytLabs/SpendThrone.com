/**
 * Navigation utility for consistent navigation patterns across the application
 * Provides standardized navigation functions with proper error handling and accessibility
 */

import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { debugLog } from './logger';

export interface NavigationOptions {
  replace?: boolean; // Replace current history entry instead of pushing new one
  state?: unknown; // State to pass to the navigation
  preserveScroll?: boolean; // Preserve scroll position (default: false)
}

/**
 * Standardized navigation hook with consistent error handling
 * @returns Navigation functions with built-in error handling
 */
export const useAppNavigation = () => {
  const navigate = useNavigate();

  /**
   * Navigate to a specific route with standardized options
   */
  const navigateTo = useCallback((path: string, options: NavigationOptions = {}) => {
    const { replace = false, state = null, preserveScroll = false } = options;
    
    try {
      // Store current scroll position if preserving
      if (preserveScroll) {
        const scrollPosition = window.scrollY;
        sessionStorage.setItem(`scroll_${path}`, scrollPosition.toString());
      }
      
      navigate(path, { replace, state });
      
      // Restore scroll position if preserving
      if (preserveScroll) {
        setTimeout(() => {
          const savedPosition = sessionStorage.getItem(`scroll_${path}`);
          if (savedPosition) {
            window.scrollTo(0, parseInt(savedPosition, 10));
          }
        }, 100);
      }
    } catch (error) {
      debugLog('Navigation error:', error);
      // Fallback to native navigation
      window.location.href = path;
    }
  }, [navigate]);

  /**
   * Navigate to home page
   */
  const navigateHome = useCallback((options?: NavigationOptions) => {
    navigateTo('/', options);
  }, [navigateTo]);

  /**
   * Navigate to leaderboard
   */
  const navigateLeaderboard = useCallback((options?: NavigationOptions) => {
    navigateTo('/leaderboard', options);
  }, [navigateTo]);

  /**
   * Navigate to tiers page
   */
  const navigateTiers = useCallback((options?: NavigationOptions) => {
    navigateTo('/tiers', options);
  }, [navigateTo]);

  /**
   * Navigate to history page
   */
  const navigateHistory = useCallback((options?: NavigationOptions) => {
    navigateTo('/history', options);
  }, [navigateTo]);

  /**
   * Navigate to settings page
   */
  const navigateSettings = useCallback((options?: NavigationOptions) => {
    navigateTo('/settings', options);
  }, [navigateTo]);

  /**
 * Navigate back to previous page
 */
  const navigateBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    navigateTo,
    navigateHome,
    navigateLeaderboard,
    navigateTiers,
    navigateHistory,
    navigateSettings,
    navigateBack
  };
};

/**
 * Common navigation paths for use in components
 */
export const NAVIGATION_PATHS = {
  HOME: '/',
  LEADERBOARD: '/leaderboard',
  DEPOSIT: '/deposit',
  TIERS: '/tiers',
  HISTORY: '/history',
  SETTINGS: '/settings',
  TEAM: '/team',
  HELP: '/help',
  ABOUT: '/about',
  ANIMATION: '/animation'
} as const;

/**
 * Type-safe navigation helper for external links
 */
export const navigateToExternal = (url: string, newTab = true) => {
  try {
    if (newTab) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  } catch (error) {
    debugLog('External navigation error:', error);
    // Fallback: create anchor element
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = newTab ? '_blank' : '_self';
    anchor.rel = 'noopener noreferrer';
    anchor.click();
  }
};