import { test, expect } from '@playwright/test';

test.describe('SpendThrone Basic Stability', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/SpendThrone/i);
    
    // Check for main heading or key element
    const heading = page.getByRole('heading', { level: 1 }).first();
    await expect(heading).toBeVisible();
  });

  test('navigation menu exists', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
  });
});
