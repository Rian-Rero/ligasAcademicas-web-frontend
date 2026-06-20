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
  useCreateUser,
  useDeleteUser,
  useGetUserById,
  useGetUsers,
  useUpdateUser,
} from '../../../hooks/query/user.js';
import { createWrapper } from '../../helpers/queryWrapper.jsx';
import { server } from '../../mocks/server.js';

const BASE = 'http://localhost:3333/sgla-api';

describe('useGetUsers', () => {
  it('returns fetched user list on success', async () => {
    server.use(
      http.get(`${BASE}/users`, () =>
        HttpResponse.json([
          { _id: 'u1', name: 'Alice' },
          { _id: 'u2', name: 'Bob' },
        ]),
      ),
    );

    const { result } = renderHook(() => useGetUsers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].name).toBe('Alice');
  });

  it('transitions to error state when the request fails', async () => {
    server.use(
      http.get(`${BASE}/users`, () =>
        HttpResponse.json({ message: 'Unauthorized' }, { status: 401 }),
      ),
    );

    const { result } = renderHook(() => useGetUsers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('respects the enabled=false option and stays idle', () => {
    const { result } = renderHook(() => useGetUsers({ enabled: false }), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useGetUserById', () => {
  it('fetches a single user by id', async () => {
    server.use(
      http.get(`${BASE}/users/u-abc`, () =>
        HttpResponse.json({
          _id: 'u-abc',
          name: 'Carol',
          email: 'carol@test.com',
        }),
      ),
    );

    const { result } = renderHook(() => useGetUserById({ _id: 'u-abc' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchObject({ _id: 'u-abc', name: 'Carol' });
  });

  it('stays idle when _id is undefined', () => {
    const { result } = renderHook(() => useGetUserById({ _id: undefined }), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
  });

  it('stays idle when _id is null', () => {
    const { result } = renderHook(() => useGetUserById({ _id: null }), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useCreateUser', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });

  it('calls onSuccess callback after a successful mutation', async () => {
    server.use(
      http.post(`${BASE}/users`, () =>
        HttpResponse.json({ _id: 'new-1', name: 'Dave' }, { status: 201 }),
      ),
    );

    const onSuccess = vi.fn();
    const { result } = renderHook(() => useCreateUser({ onSuccess }), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({ name: 'Dave', email: 'dave@test.com' });

    expect(onSuccess).toHaveBeenCalledOnce();
    expect(onSuccess.mock.calls[0][0]).toMatchObject({ _id: 'new-1' });
  });

  it('calls onError callback when the mutation fails', async () => {
    server.use(
      http.post(`${BASE}/users`, () =>
        HttpResponse.json({ message: 'Conflict' }, { status: 409 }),
      ),
    );

    const onError = vi.fn();
    const { result } = renderHook(() => useCreateUser({ onError }), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({ name: 'X', email: 'x@test.com' }),
    ).rejects.toThrow();

    expect(onError).toHaveBeenCalled();
  });
});

describe('useUpdateUser', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useUpdateUser(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});

describe('useDeleteUser', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});
