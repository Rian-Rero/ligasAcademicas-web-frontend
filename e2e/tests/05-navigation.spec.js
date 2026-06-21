import { expect, test } from '@playwright/test';

test.describe('App navigation', () => {
  test('navigating to /login from / shows login page', async ({ page }) => {
    await page.goto('/');
    await page.goto('/login');
    await expect(page).toHaveURL(/login/);
    await expect(page.locator('form')).toBeVisible();
  });

  test('back navigation works from forgot-password to login', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Esqueci minha senha' }).click();
    await expect(page).toHaveURL(/forgot/i);
    await page.goBack();
    await expect(page).toHaveURL(/login/);
  });

  test('login page title or logo is visible', async ({ page }) => {
    await page.goto('/login');
    // The page should render some recognizable heading or logo element
    const mainContent = page.locator(
      'h1, h2, [data-testid="logo"], img[alt*="logo" i], svg',
    );
    await expect(mainContent.first()).toBeVisible();
  });
});
