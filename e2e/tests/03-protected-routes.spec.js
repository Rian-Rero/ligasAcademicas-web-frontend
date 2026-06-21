import { expect, test } from '@playwright/test';

const PROTECTED_ROUTES = [
  '/student/dashboard',
  '/student/events',
  '/student/team',
  '/student/certificates',
  '/student/tasks',
  '/manager/dashboard',
  '/admin/dashboard',
  '/admin/usuarios',
  '/admin/ligas',
];

test.describe('Protected route guards', () => {
  PROTECTED_ROUTES.forEach((route) => {
    test(`unauthenticated access to ${route} redirects to /login`, async ({
      page,
    }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
    });
  });
});
