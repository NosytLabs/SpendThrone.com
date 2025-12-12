# SpendThrone Maintenance Plan

This document serves as a guide for ongoing maintenance and optimization of the SpendThrone platform.

## 1. Routine Maintenance

### Weekly
- **Dependency Updates**: Run `npm audit` to check for security vulnerabilities.
- **Performance Review**: Check Vercel Analytics for slow routes or high latency.
- **Error Monitoring**: Review logs (Sentry/Supabase) for recurring errors.

### Monthly
- **Library Updates**: Update dependencies (`npm update`) and verify with tests.
- **Database Optimization**: Review Supabase query performance and add indexes if needed.
- **Content Review**: Ensure links and external resources (RPC endpoints) are active.

## 2. Performance Optimization

- **Bundling**: We use Vite with manual chunk splitting. Check `vite.config.ts` if bundle sizes grow too large.
- **Images**: Ensure all new assets are optimized (WebP/AVIF) before committing.
- **Caching**: Verify Vercel caching headers are correctly applied.

## 3. Infrastructure

- **Deployment**: Automatic deployment via Vercel on git push.
- **Database**: Supabase (PostgreSQL).
  - **Backups**: Managed by Supabase (ensure Point-in-Time Recovery is enabled if on Pro plan).
  - **Migrations**: SQL files in `supabase/migrations/`.

## 4. Emergency Rollback

In case of a critical failure:
1. Revert the commit in Git: `git revert HEAD`
2. Push to `main` branch.
3. Vercel will automatically redeploy the previous stable version.
4. If database migration caused issues, manually execute the down-migration SQL.

## 5. Security

- **Secrets**: Rotate API keys (Helius, Supabase) every 6 months.
- **Wallet Integration**: Ensure `wallet-adapter` packages are up to date to support latest wallet standards.
