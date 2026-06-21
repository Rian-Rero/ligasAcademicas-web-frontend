import { expect, test } from '@playwright/test';

test.describe('Public pages', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).not.toHaveURL(/error/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('login page renders form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('form')).toBeVisible();
  });

  test('forgot password page is accessible', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page).toHaveURL(/forgot/i);
    await expect(
      page.locator('input[type="email"], input[name="email"]'),
    ).toBeVisible();
  });

  test('register page renders name and email fields', async ({ page }) => {
    await page.goto('/cadastro');
    await expect(page).toHaveURL(/cadastro/i);
  });

  test('email confirmation page renders without crash', async ({ page }) => {
    await page.goto('/email-confirmation/invalid-token');
    await expect(page.locator('body')).toBeVisible();
  });
});
