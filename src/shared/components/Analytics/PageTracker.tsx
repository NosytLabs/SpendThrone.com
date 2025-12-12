import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const PageTracker = () => {
    const location = useLocation();

    useEffect(() => {
        // Manually track pageview on route change to ensure SPA accuracy
        // PostHog captures $current_url automatically, but this ensures it fires on client-side nav
        if (window.posthog) {
            window.posthog.capture('$pageview');
        }
    }, [location]);

    return null;
};
