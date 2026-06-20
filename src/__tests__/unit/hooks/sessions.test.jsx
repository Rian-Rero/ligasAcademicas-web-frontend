import { act, renderHook } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';

import { useLogin, useLogout } from '../../../hooks/query/sessions.js';
import { createWrapper } from '../../helpers/queryWrapper.jsx';
import { server } from '../../mocks/server.js';

const { mockSetAuth, mockClearAuth } = vi.hoisted(() => ({
  mockSetAuth: vi.fn(),
  mockClearAuth: vi.fn(),
}));

vi.mock('../../../stores/auth.js', () => ({
  default: {
    getState: vi.fn().mockReturnValue({
      auth: { accessToken: 'test-token' },
      setAuth: mockSetAuth,
      clearAuth: mockClearAuth,
    }),
    setState: vi.fn(),
    subscribe: vi.fn(),
  },
}));

const BASE = 'http://localhost:3333/sgla-api';

describe('useLogin', () => {
  it('has mutateAsync function', () => {
    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });

  it('succeeds when endpoint returns 200', async () => {
    server.use(
      http.post(`${BASE}/login`, () =>
        HttpResponse.json({ accessToken: 'new-token' }),
      ),
    );
    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });
    await act(async () => {
      const data = await result.current.mutateAsync({
        email: 'a@b.com',
        password: 'pass',
      });
      expect(data).toBeDefined();
    });
  });
});

describe('useLogout', () => {
  it('has mutateAsync function', () => {
    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });

  it('succeeds when endpoint returns 204', async () => {
    server.use(
      http.post(
        `${BASE}/logout`,
        () => new HttpResponse(null, { status: 204 }),
      ),
    );
    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(),
    });
    await act(async () => {
      await result.current.mutateAsync();
    });
    expect(result.current.isError).toBe(false);
  });
});
