# Security Audit Report

## Vulnerability Status

### High Severity: `bigint-buffer` (Buffer Overflow)
- **CVE**: CVE-2025-3194
- **Impact**: Buffer overflow in `toBigIntLE()` function.
- **Path**: `@solana/spl-token` -> `@solana/buffer-layout-utils` -> `bigint-buffer`.
- **Decision**: **Deferred**.
  - The vulnerability is within a transitive dependency of the core `@solana/spl-token` library.
  - Fixing this requires a downgrade to `@solana/spl-token@0.1.8` or a major upgrade to a version not yet widely stable/compatible with current wallet adapters.
  - Downgrading would cause significant breaking changes to the application's payment and wallet functionality.
  - **Mitigation**: Risk accepted to maintain application functionality. We are awaiting an upstream patch in the `@solana/spl-token` 0.4.x line.

### Moderate Severity: `esbuild` (Unauthorized Request Handling)
- **Impact**: Development server request handling.
- **Path**: `vite` -> `esbuild`.
- **Decision**: **Deferred**.
  - Requires upgrading `vite` to v6/v7, which is a major breaking change for the build pipeline.
  - **Mitigation**: This is primarily a development-time vulnerability. Production builds are unaffected as they are static assets.

## Actions Taken
- **Fixed**: `js-yaml` (Prototype Pollution) via `npm audit fix`.
- **Fixed**: Test coverage tooling setup using `@vitest/coverage-istanbul` to avoid peer dependency conflicts with Vitest 2.x.
- **Upgraded**: Safe minor versions of `autoprefixer`, `framer-motion`, `postcss`, and `tailwindcss`.

## Next Steps
- Monitor `@solana/spl-token` releases for a patch that addresses `bigint-buffer`.
- Plan a dedicated sprint for upgrading to Vite 6/7 and Vitest 4.x to resolve technical debt and remaining moderate vulnerabilities.
