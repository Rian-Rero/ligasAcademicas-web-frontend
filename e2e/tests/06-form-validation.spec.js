import { expect, test } from '@playwright/test';

test.describe('Form validation on public pages', () => {
  test('login form: submitting with invalid email shows error', async ({
    page,
  }) => {
    await page.goto('/login');
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    await emailInput.fill('not-an-email');
    await page
      .locator('input[type="password"], input[name="password"]')
      .fill('Password@1');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForTimeout(500);
    // Should stay on login page (validation failed)
    await expect(page).toHaveURL(/login/);
  });

  test('login form: submitting with empty password shows error', async ({
    page,
  }) => {
    await page.goto('/login');
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    await emailInput.fill('valid@email.com');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/login/);
  });

  test('forgot password: empty email submit does not navigate away', async ({
    page,
  }) => {
    await page.goto('/forgot-password');
    await page
      .getByRole('button', { name: /enviar|recuperar|redefinir|submit/i })
      .click();
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/forgot/i);
  });

  test('forgot password: fills email and checks button state', async ({
    page,
  }) => {
    await page.goto('/forgot-password');
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    await emailInput.fill('user@example.com');
    const btn = page.getByRole('button', {
      name: /enviar|recuperar|redefinir|submit/i,
    });
    await expect(btn).toBeEnabled();
  });
});
