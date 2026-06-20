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
  useCreateLeagueMembership,
  useDeleteLeagueMembership,
  useEndLeagueMembership,
  useGetInactiveLeagueMemberships,
  useGetLeagueMembershipById,
  useGetLeagueMemberships,
  useUpdateLeagueMembership,
} from '../../../hooks/query/leagueMembership.js';
import { createWrapper } from '../../helpers/queryWrapper.jsx';
import { server } from '../../mocks/server.js';

const BASE = 'http://localhost:3333/sgla-api';

describe('useGetLeagueMemberships', () => {
  it('returns membership list on success', async () => {
    server.use(
      http.get(`${BASE}/league-memberships`, () =>
        HttpResponse.json([
          { _id: 'm1', role: 'member', isActive: true },
          { _id: 'm2', role: 'manager', isActive: true },
        ]),
      ),
    );

    const { result } = renderHook(() => useGetLeagueMemberships(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[1].role).toBe('manager');
  });

  it('respects enabled=false', () => {
    const { result } = renderHook(
      () => useGetLeagueMemberships({ enabled: false }),
      { wrapper: createWrapper() },
    );

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useGetInactiveLeagueMemberships', () => {
  it('fetches inactive memberships', async () => {
    server.use(
      http.get(`${BASE}/league-memberships/inactive`, () =>
        HttpResponse.json([{ _id: 'm3', role: 'member', isActive: false }]),
      ),
    );

    const { result } = renderHook(() => useGetInactiveLeagueMemberships(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data[0].isActive).toBe(false);
  });
});

describe('useGetLeagueMembershipById', () => {
  it('stays idle when _id is undefined', () => {
    const { result } = renderHook(
      () => useGetLeagueMembershipById({ _id: undefined }),
      { wrapper: createWrapper() },
    );

    expect(result.current.fetchStatus).toBe('idle');
  });

  it('fetches a membership when _id is provided', async () => {
    server.use(
      http.get(`${BASE}/league-memberships/m-abc`, () =>
        HttpResponse.json({ _id: 'm-abc', role: 'president', isActive: true }),
      ),
    );

    const { result } = renderHook(
      () => useGetLeagueMembershipById({ _id: 'm-abc' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.role).toBe('president');
  });
});

describe('useCreateLeagueMembership', () => {
  it('calls onSuccess after creation', async () => {
    server.use(
      http.post(`${BASE}/league-memberships`, () =>
        HttpResponse.json({ _id: 'new-m', role: 'member' }, { status: 201 }),
      ),
    );

    const onSuccess = vi.fn();
    const { result } = renderHook(
      () => useCreateLeagueMembership({ onSuccess }),
      { wrapper: createWrapper() },
    );

    await result.current.mutateAsync({ role: 'member', isActive: true });

    expect(onSuccess).toHaveBeenCalledOnce();
    expect(onSuccess.mock.calls[0][0]).toMatchObject({ _id: 'new-m' });
  });
});

describe('useUpdateLeagueMembership', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useUpdateLeagueMembership(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});

describe('useEndLeagueMembership', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useEndLeagueMembership(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});

describe('useDeleteLeagueMembership', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useDeleteLeagueMembership(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});
