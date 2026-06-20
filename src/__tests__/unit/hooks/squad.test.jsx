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
  useCreateSquad,
  useDeleteSquad,
  useGetSquadById,
  useGetSquads,
  useUpdateSquad,
} from '../../../hooks/query/squad.js';
import { createWrapper } from '../../helpers/queryWrapper.jsx';
import { server } from '../../mocks/server.js';

const BASE = 'http://localhost:3333/sgla-api';

describe('useGetSquads', () => {
  it('returns squad list on success', async () => {
    server.use(
      http.get(`${BASE}/squads`, () =>
        HttpResponse.json([
          { _id: 's1', name: 'Diretoria Científica' },
          { _id: 's2', name: 'Diretoria de Marketing' },
        ]),
      ),
    );

    const { result } = renderHook(() => useGetSquads(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
  });

  it('respects enabled=false', () => {
    const { result } = renderHook(() => useGetSquads({ enabled: false }), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useGetSquadById', () => {
  it('fetches a single squad', async () => {
    server.use(
      http.get(`${BASE}/squads/s-abc`, () =>
        HttpResponse.json({ _id: 's-abc', name: 'Diretoria Financeira' }),
      ),
    );

    const { result } = renderHook(() => useGetSquadById({ _id: 's-abc' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.name).toBe('Diretoria Financeira');
  });

  it('stays idle when _id is falsy', () => {
    const { result } = renderHook(() => useGetSquadById({ _id: '' }), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useCreateSquad', () => {
  it('calls onSuccess after creation', async () => {
    server.use(
      http.post(`${BASE}/squads`, () =>
        HttpResponse.json(
          { _id: 'new-s', name: 'Nova Diretoria' },
          { status: 201 },
        ),
      ),
    );

    const onSuccess = vi.fn();
    const { result } = renderHook(() => useCreateSquad({ onSuccess }), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({ name: 'Nova Diretoria' });

    expect(onSuccess).toHaveBeenCalledOnce();
    expect(onSuccess.mock.calls[0][0]).toMatchObject({ _id: 'new-s' });
  });
});

describe('useUpdateSquad', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useUpdateSquad(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});

describe('useDeleteSquad', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useDeleteSquad(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});
