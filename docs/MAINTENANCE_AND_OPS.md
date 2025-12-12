# SpendThrone Maintenance & Operations Guide

## 1. Performance Optimization Protocol

### Monthly Performance Review
1.  **Lighthouse Audit**: Run Google Lighthouse in Chrome DevTools on the Home, Leaderboard, and Profile pages. Target score > 90 across all categories.
2.  **Bundle Analysis**: Run `npm run build` and inspect the output. Ensure no single chunk exceeds 500kB (except vendor chunks).
    *   Use `npx vite-bundle-visualizer` to identify bloated dependencies.
3.  **Database Query Analysis**: Check Supabase Query Performance insights for slow queries.

### Caching Strategy
*   **React Query**: The application uses `@tanstack/react-query` for data fetching.
    *   Stale Time: Default is 5 minutes. Adjust in `AppProviders.tsx`.
    *   Keys: Ensure query keys are consistent (e.g., `['leaderboard']`, `['profile', walletAddress]`).
*   **Static Assets**: Images are optimized in `assets/images`. Ensure new images are compressed (WebP format preferred) before committing.

## 2. Infrastructure & Monitoring

### Continuous Integration (CI)
*   **Automated Health Check**: Run `npm run health-check` locally before pushing. This script automatically performs:
    *   Linting
    *   Type Checking
    *   Unit Testing
    *   Bundle Size Analysis (>500KB warning)
*   GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push:
    *   Linting (`npm run lint`)
    *   Type Checking (`npm run type-check`)
    *   Build Verification (`npm run build`)

### Error Logging
*   **Current**: `src/shared/utils/logger.ts` handles application logs.
*   **Recommendation**: Integrate Sentry for production error tracking.
    1.  Install `@sentry/react`.
    2.  Initialize in `main.tsx`.
    3.  Replace `debugLog` internals to send errors to Sentry.

### Database Backups (Supabase)
*   **Point-in-Time Recovery (PITR)**: Enable PITR in Supabase project settings for production.
*   **Daily Backups**: Supabase performs daily backups automatically. Verify these are active in the dashboard.

## 3. Security Maintenance

### Regular Audits
*   **Dependency Audit**: Run `npm audit` weekly to identify vulnerable packages.
*   **RLS Policies**: Review `supabase/schema.sql` and `migrations/` to ensure Row Level Security policies are strict.
    *   *Rule*: `leaderboard` is publicly readable but only writable by the owner (or via secure RPC).

### Emergency Rollback
1.  **Frontend**: Revert to the previous commit in git and redeploy via Vercel (or `npm run build` + upload).
2.  **Database**: Use Supabase dashboard to restore the database to a previous point in time.

## 4. Development Workflow

### Adding New Features
1.  Create a feature branch.
2.  Implement feature in `src/features/<feature-name>`.
3.  Add tests in `src/__tests__` or `tests/`.
4.  Verify no lint/type errors.
5.  Open PR.

### Updating Dependencies
*   Run `npm outdated` to see available updates.
*   Update critical security patches immediately.
*   Update major versions with caution and full regression testing.
