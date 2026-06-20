import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(),
}));

import { jwtDecode } from 'jwt-decode';

import useAuthStore from '../../../stores/auth.js';

function resetStore() {
  useAuthStore.setState({ auth: null });
}

afterEach(() => resetStore());

describe('useAuthStore.setAuth', () => {
  it('decodes accessToken and sets auth state', () => {
    const now = Math.floor(Date.now() / 1000);
    jwtDecode.mockReturnValueOnce({
      user: { _id: 'user-1', name: 'Alice' },
      iat: now,
      exp: now + 900,
    });

    useAuthStore.getState().setAuth('fake-token');
    const { auth } = useAuthStore.getState();

    expect(auth.accessToken).toBe('fake-token');
    expect(auth.user._id).toBe('user-1');
    expect(typeof auth.expireIn).toBe('number');
    expect(auth.expireIn).toBeGreaterThan(0);
  });

  it('stores the expireIn as exp - iat - 300', () => {
    const iat = 1000;
    const exp = 1900;
    jwtDecode.mockReturnValueOnce({
      user: { _id: 'user-2' },
      iat,
      exp,
    });
    useAuthStore.getState().setAuth('token-2');
    expect(useAuthStore.getState().auth.expireIn).toBe(exp - iat - 300);
  });
});

describe('useAuthStore.setUser', () => {
  it('updates the user without clearing the token', () => {
    const now = Math.floor(Date.now() / 1000);
    jwtDecode.mockReturnValueOnce({
      user: { _id: 'u1' },
      iat: now,
      exp: now + 900,
    });
    useAuthStore.getState().setAuth('token-abc');

    useAuthStore.getState().setUser({ _id: 'u1', name: 'Updated' });

    const { auth } = useAuthStore.getState();
    expect(auth.user.name).toBe('Updated');
    expect(auth.accessToken).toBe('token-abc');
  });

  it('does not throw when auth is null', () => {
    expect(() => useAuthStore.getState().setUser({ _id: 'u1' })).not.toThrow();
  });
});

describe('useAuthStore.clearAuth', () => {
  it('resets auth to null', () => {
    const now = Math.floor(Date.now() / 1000);
    jwtDecode.mockReturnValueOnce({
      user: { _id: 'u1' },
      iat: now,
      exp: now + 900,
    });
    useAuthStore.getState().setAuth('token-x');
    useAuthStore.getState().clearAuth();
    expect(useAuthStore.getState().auth).toBeNull();
  });
});
