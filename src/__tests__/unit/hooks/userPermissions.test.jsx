import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../../stores/auth.js', () => ({
  default: Object.assign(
    vi.fn(() => ({ accessToken: 'token' })),
    {
      getState: vi.fn().mockReturnValue({
        auth: { accessToken: 'test-token' },
        setAuth: vi.fn(),
        clearAuth: vi.fn(),
      }),
      setState: vi.fn(),
      subscribe: vi.fn(),
    },
  ),
}));

import {
  useAddPermissionToUser,
  useAddRoleToUser,
  useGetUserPermissionDetails,
  useGetUserPermissions,
  useRemovePermissionFromUser,
  useRemoveRoleFromUser,
  useUpdateUserPermissions,
} from '../../../hooks/query/userPermissions.js';
import { createWrapper } from '../../helpers/queryWrapper.jsx';
import { server } from '../../mocks/server.js';

const BASE = 'http://localhost:3333/sgla-api';

describe('useGetUserPermissions', () => {
  it('fetches permissions for a specific user', async () => {
    server.use(
      http.get(`${BASE}/permissions/users/:userId/permissions`, () =>
        HttpResponse.json({ roles: ['admin'], permissions: [] }),
      ),
    );

    const { result } = renderHook(
      () => useGetUserPermissions({ userId: 'u-1' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchObject({ roles: ['admin'] });
  });

  it('stays idle when userId is undefined', () => {
    const { result } = renderHook(
      () => useGetUserPermissions({ userId: undefined }),
      { wrapper: createWrapper() },
    );

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useGetUserPermissionDetails', () => {
  it('stays idle when userId is undefined', () => {
    const { result } = renderHook(
      () => useGetUserPermissionDetails({ userId: undefined }),
      { wrapper: createWrapper() },
    );

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useUpdateUserPermissions', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useUpdateUserPermissions(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});

describe('useAddRoleToUser', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useAddRoleToUser(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});

describe('useRemoveRoleFromUser', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useRemoveRoleFromUser(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});

describe('useAddPermissionToUser', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useAddPermissionToUser(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});

describe('useRemovePermissionFromUser', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useRemovePermissionFromUser(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});
