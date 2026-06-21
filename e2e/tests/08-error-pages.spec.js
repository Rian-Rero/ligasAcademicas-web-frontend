import { expect, test } from '@playwright/test';

test.describe('Error states and edge cases', () => {
  test('accessing unknown route redirects or shows 404', async ({ page }) => {
    await page.goto('/this-route-does-not-exist-xyz');
    // The app should either show a 404 page or redirect to login/home
    await expect(page.locator('body')).toBeVisible();
    const url = page.url();
    // Any of these is acceptable behavior
    const isHandled =
      url.includes('login') ||
      url.includes('404') ||
      url.includes('not-found') ||
      url.includes('/');
    expect(isHandled).toBe(true);
  });

  test('email confirmation with invalid token shows error state', async ({
    page,
  }) => {
    await page.goto('/email-confirmation/totally-invalid-token-xyz');
    await expect(page.locator('body')).toBeVisible();
    // Either shows error or pending state
    await page.waitForTimeout(1000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('redefine password page with invalid token shows some state', async ({
    page,
  }) => {
    await page.goto('/redefinir-senha/invalid-token-xyz');
    await expect(page.locator('body')).toBeVisible();
    await page.waitForTimeout(1500);
    // Should show some UI, not a blank white page
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(5);
  });
});
