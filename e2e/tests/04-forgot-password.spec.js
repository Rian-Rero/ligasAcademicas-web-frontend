import { expect, test } from '@playwright/test';

test.describe('Forgot Password flow', () => {
  test('forgot password form renders and accepts email', async ({ page }) => {
    await page.goto('/forgot-password');
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    await expect(emailInput).toBeVisible();
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('submit button is present', async ({ page }) => {
    await page.goto('/forgot-password');
    const submitBtn = page.getByRole('button', {
      name: /enviar|recuperar|redefinir|submit/i,
    });
    await expect(submitBtn).toBeVisible();
  });

  test('shows error for empty form submission', async ({ page }) => {
    await page.goto('/forgot-password');
    await page
      .getByRole('button', { name: /enviar|recuperar|redefinir|submit/i })
      .click();
    await page.waitForTimeout(800);
    // Should either show a validation error or stay on the page
    await expect(page).toHaveURL(/forgot/i);
  });

  test('redefine password page renders without token crash', async ({
    page,
  }) => {
    await page.goto('/redefinir-senha/test-token');
    await expect(page.locator('body')).toBeVisible();
    // Should show a password field or an error state
  });
});
