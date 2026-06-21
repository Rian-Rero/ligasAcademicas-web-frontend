import { expect, test } from '@playwright/test';

test.describe('Basic accessibility and page structure', () => {
  test('login page has correct document title', async ({ page }) => {
    await page.goto('/login');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('login form inputs have labels or placeholders', async ({ page }) => {
    await page.goto('/login');
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    await expect(emailInput).toBeVisible();
    // Check it has accessible label or placeholder
    const placeholder = await emailInput.getAttribute('placeholder');
    const id = await emailInput.getAttribute('id');
    const isLabeled =
      placeholder !== null ||
      (id !== null && (await page.locator(`label[for="${id}"]`).count()) > 0);
    expect(isLabeled).toBe(true);
  });

  test('password field is of type password', async ({ page }) => {
    await page.goto('/login');
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
  });

  test('forgot password page has document title', async ({ page }) => {
    await page.goto('/forgot-password');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });
});
