# SpendThrone Testing Guide

This document outlines the testing protocols for the SpendThrone application. We use **Vitest** for unit/integration testing and **Playwright** for end-to-end (E2E) testing.

## 1. Unit & Integration Tests

We use **Vitest** for fast, headless unit testing. These tests focus on individual functions, hooks, and components.

### Running Tests
```bash
# Run all unit tests
npm run test:unit

# Run with UI interface
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Writing Tests
- **Location**: Place test files in `src/test/` or alongside the component (e.g., `Component.test.tsx`).
- **Naming**: Use `.test.ts` or `.test.tsx` extensions.
- **Mocking**: Use `vi` from `vitest` to mock dependencies (e.g., `vi.mock('@/core/services/databaseService')`).

### Best Practices
- Mock external services (Supabase, Solana RPC) to ensure tests are deterministic.
- Test edge cases (e.g., empty states, error boundaries).
- Avoid testing implementation details; test behavior (e.g., "clicking button calls function X" vs "function X is named handleClick").

## 2. End-to-End (E2E) Tests

We use **Playwright** for full-stack browser testing. These tests verify that the application works as expected from a user's perspective.

### Running Tests
```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run with UI mode (interactive debugging)
npm run test:e2e:ui

# View the last test report
npx playwright show-report
```

### Writing Tests
- **Location**: Place test files in `tests/`.
- **Naming**: Use `.spec.ts` extension.
- **Structure**:
```typescript
import { test, expect } from '@playwright/test';

test('feature works correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Welcome')).toBeVisible();
});
```

### Best Practices
- **Stability**: Ensure the dev server is running or let Playwright start it (configured in `playwright.config.ts`).
- **Selectors**: Use user-facing locators (`getByRole`, `getByText`) instead of CSS selectors when possible.
- **Isolation**: Each test should be independent.

## 3. Continuous Integration

All tests are run automatically on pull requests via GitHub Actions (if configured) or should be run manually before deployment.

### Pre-Deployment Checklist
1. `npm run lint` - Ensure no code style issues.
2. `npm run type-check` - Verify TypeScript types.
3. `npm run test:unit` - Pass all unit tests.
4. `npm run test:e2e` - Pass critical user flows.
