/**
 * Shared auth store mock factory.
 *
 * Usage in test file:
 *   import { makeAuthMock } from '../../helpers/authMock.js';
 *   const authMock = makeAuthMock();
 *   vi.mock('../../../stores/auth.js', () => ({ default: authMock.store }));
 *
 * Each call to makeAuthMock() produces a fresh set of vi.fn() spies, which
 * means tests using different files are fully isolated.
 *
 * NOTE: this module must be imported BEFORE vi.mock() is called in the test
 * file, but because vi.mock() is hoisted, you need to use vi.hoisted() when
 * the spy reference must be available at factory-call time.  For the common
 * case of just needing a stubbed auth state the factory approach below is
 * sufficient.
 */
import { vi } from 'vitest';

export function makeAuthStore(overrides = {}) {
  return {
    getState: vi.fn().mockReturnValue({
      auth: { accessToken: 'test-access-token' },
      setAuth: vi.fn(),
      clearAuth: vi.fn(),
      ...overrides,
    }),
    setState: vi.fn(),
    subscribe: vi.fn(),
    // Zustand selector-style call used by hooks like useAuthStore(selector)
    // Handled by the default mock in vi.mock factory below.
  };
}
