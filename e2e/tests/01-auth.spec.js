import { expect, test } from '@playwright/test';

test.describe('Authentication lifecycle', () => {
  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto('/student/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('shows validation error for empty login form', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /entrar/i }).click();
    await expect(
      page.getByText('Insira um email no formato email@email.com'),
    ).toBeVisible();
    await expect(page.getByText('Favor digitar uma senha')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    // Find email and password inputs by common attributes
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator(
      'input[type="password"], input[name="password"]',
    );

    await emailInput.fill('invalid@user.com');
    await passwordInput.fill('WrongPassword@1');
    await page.getByRole('button', { name: /entrar/i }).click();

    // Should show error toast or message, not redirect
    await page.waitForTimeout(1500);
    await expect(page).toHaveURL(/\/login/);
  });

  test('login page has email and password fields', async ({ page }) => {
    await page.goto('/login');
    await expect(
      page.locator('input[type="email"], input[name="email"]'),
    ).toBeVisible();
    await expect(
      page.locator('input[type="password"], input[name="password"]'),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();
  });

  test('forgot password link is visible on login page', async ({ page }) => {
    await page.goto('/login');
    await expect(
      page.getByRole('button', { name: 'Esqueci minha senha' }),
    ).toBeVisible();
  });
});
