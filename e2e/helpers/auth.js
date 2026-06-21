/**
 * Login helper for E2E tests.
 * Uses the real backend API directly to obtain a session.
 */
export async function loginAsAdmin(page) {
  await page.goto('/login');
  await page
    .getByLabel(/e-mail/i)
    .fill(process.env.E2E_ADMIN_EMAIL || 'admin@sgla.com');
  await page
    .getByLabel(/senha/i)
    .fill(process.env.E2E_ADMIN_PASSWORD || 'Admin@123');
  await page.getByRole('button', { name: /entrar/i }).click();
}

export async function loginAsStudent(page) {
  await page.goto('/login');
  await page
    .getByLabel(/e-mail/i)
    .fill(process.env.E2E_STUDENT_EMAIL || 'student@sgla.com');
  await page
    .getByLabel(/senha/i)
    .fill(process.env.E2E_STUDENT_PASSWORD || 'Student@123');
  await page.getByRole('button', { name: /entrar/i }).click();
}
