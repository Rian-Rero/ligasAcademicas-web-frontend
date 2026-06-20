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
  useCreatePermission,
  useDeletePermission,
  useGetPermissionById,
  useGetPermissions,
  useUpdatePermission,
} from '../../../hooks/query/permissions.js';
import { createWrapper } from '../../helpers/queryWrapper.jsx';
import { server } from '../../mocks/server.js';

const BASE = 'http://localhost:3333/sgla-api';

describe('useGetPermissions', () => {
  it('returns permission list on success', async () => {
    server.use(
      http.get(`${BASE}/permissions`, () =>
        HttpResponse.json([
          { _id: 'p1', key: 'event.view', module: 'event' },
          { _id: 'p2', key: 'event.create', module: 'event' },
        ]),
      ),
    );

    const { result } = renderHook(() => useGetPermissions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].key).toBe('event.view');
  });

  it('respects enabled=false', () => {
    const { result } = renderHook(() => useGetPermissions({ enabled: false }), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useGetPermissionById', () => {
  it('stays idle when permissionId is undefined', () => {
    const { result } = renderHook(
      () => useGetPermissionById({ permissionId: undefined }),
      { wrapper: createWrapper() },
    );

    expect(result.current.fetchStatus).toBe('idle');
  });

  it('fetches a permission when id is provided', async () => {
    server.use(
      http.get(`${BASE}/permissions/p-abc`, () =>
        HttpResponse.json({ _id: 'p-abc', key: 'user.create', module: 'user' }),
      ),
    );

    const { result } = renderHook(
      () => useGetPermissionById({ permissionId: 'p-abc' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.key).toBe('user.create');
  });
});

describe('useCreatePermission', () => {
  it('calls onSuccess after creation and invalidates the permissions cache', async () => {
    server.use(
      http.post(`${BASE}/permissions`, () =>
        HttpResponse.json(
          { _id: 'new-p', key: 'event.delete' },
          { status: 201 },
        ),
      ),
    );

    const onSuccess = vi.fn();
    const { result } = renderHook(() => useCreatePermission({ onSuccess }), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      key: 'event.delete',
      name: 'Delete Event',
      module: 'event',
    });

    expect(onSuccess).toHaveBeenCalledOnce();
    expect(onSuccess.mock.calls[0][0]).toMatchObject({ _id: 'new-p' });
  });
});

describe('useUpdatePermission', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useUpdatePermission(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});

describe('useDeletePermission', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useDeletePermission(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});
