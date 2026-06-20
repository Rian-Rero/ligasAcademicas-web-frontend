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
  useCreateUniversity,
  useDeleteUniversity,
  useGetUniversities,
  useGetUniversityById,
  useUpdateUniversity,
} from '../../../hooks/query/university.js';
import { createWrapper } from '../../helpers/queryWrapper.jsx';
import { server } from '../../mocks/server.js';

const BASE = 'http://localhost:3333/sgla-api';

describe('useGetUniversities', () => {
  it('returns university list on success', async () => {
    server.use(
      http.get(`${BASE}/universities`, () =>
        HttpResponse.json([
          { _id: 'uni1', name: 'UFMG' },
          { _id: 'uni2', name: 'USP' },
        ]),
      ),
    );

    const { result } = renderHook(() => useGetUniversities(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].name).toBe('UFMG');
  });

  it('transitions to error state on server failure', async () => {
    server.use(
      http.get(`${BASE}/universities`, () =>
        HttpResponse.json(
          { message: 'Internal Server Error' },
          { status: 500 },
        ),
      ),
    );

    const { result } = renderHook(() => useGetUniversities(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('respects enabled=false', () => {
    const { result } = renderHook(
      () => useGetUniversities({ enabled: false }),
      { wrapper: createWrapper() },
    );

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useGetUniversityById', () => {
  it('fetches a single university', async () => {
    server.use(
      http.get(`${BASE}/universities/uni-abc`, () =>
        HttpResponse.json({ _id: 'uni-abc', name: 'UNICAMP' }),
      ),
    );

    const { result } = renderHook(
      () => useGetUniversityById({ _id: 'uni-abc' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.name).toBe('UNICAMP');
  });

  it('stays idle when _id is falsy', () => {
    const { result } = renderHook(() => useGetUniversityById({ _id: null }), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useCreateUniversity', () => {
  it('calls onSuccess after successful creation', async () => {
    server.use(
      http.post(`${BASE}/universities`, () =>
        HttpResponse.json({ _id: 'new-uni', name: 'UFRJ' }, { status: 201 }),
      ),
    );

    const onSuccess = vi.fn();
    const { result } = renderHook(() => useCreateUniversity({ onSuccess }), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      name: 'UFRJ',
      street: 'Av. Principal',
      number: 1,
    });

    expect(onSuccess).toHaveBeenCalledOnce();
    expect(onSuccess.mock.calls[0][0]).toMatchObject({ _id: 'new-uni' });
  });
});

describe('useUpdateUniversity', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useUpdateUniversity(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});

describe('useDeleteUniversity', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useDeleteUniversity(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});
