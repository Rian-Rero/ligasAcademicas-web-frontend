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
  useAddPermissionToRole,
  useCreateRole,
  useDeleteRole,
  useGetRoleById,
  useGetRoles,
  useRemovePermissionFromRole,
  useUpdateRole,
} from '../../../hooks/query/roles.js';
import { createWrapper } from '../../helpers/queryWrapper.jsx';
import { server } from '../../mocks/server.js';

const BASE = 'http://localhost:3333/sgla-api';

describe('useGetRoles', () => {
  it('returns role list on success', async () => {
    server.use(
      http.get(`${BASE}/permissions/roles`, () =>
        HttpResponse.json([
          { _id: 'r1', name: 'Admin', key: 'admin' },
          { _id: 'r2', name: 'Manager', key: 'manager' },
        ]),
      ),
    );

    const { result } = renderHook(() => useGetRoles(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].key).toBe('admin');
  });

  it('respects enabled=false', () => {
    const { result } = renderHook(() => useGetRoles({ enabled: false }), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useGetRoleById', () => {
  it('stays idle when roleId is undefined', () => {
    const { result } = renderHook(() => useGetRoleById({ roleId: undefined }), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
  });

  it('fetches a role when id is provided', async () => {
    server.use(
      http.get(`${BASE}/permissions/roles/r-abc`, () =>
        HttpResponse.json({
          _id: 'r-abc',
          name: 'Presidente',
          key: 'president',
        }),
      ),
    );

    const { result } = renderHook(() => useGetRoleById({ roleId: 'r-abc' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.key).toBe('president');
  });
});

describe('useCreateRole', () => {
  it('calls onSuccess after creation', async () => {
    server.use(
      http.post(`${BASE}/permissions/roles`, () =>
        HttpResponse.json({ _id: 'new-r', key: 'secretary' }, { status: 201 }),
      ),
    );

    const onSuccess = vi.fn();
    const { result } = renderHook(() => useCreateRole({ onSuccess }), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({ name: 'Secretário', key: 'secretary' });

    expect(onSuccess).toHaveBeenCalledOnce();
    expect(onSuccess.mock.calls[0][0]).toMatchObject({ _id: 'new-r' });
  });
});

describe('useUpdateRole', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useUpdateRole(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});

describe('useAddPermissionToRole', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useAddPermissionToRole(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});

describe('useRemovePermissionFromRole', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useRemovePermissionFromRole(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});

describe('useDeleteRole', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useDeleteRole(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});
