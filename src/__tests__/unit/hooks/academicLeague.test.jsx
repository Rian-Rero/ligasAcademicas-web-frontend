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
  useCreateAcademicLeague,
  useDeleteAcademicLeague,
  useGetAcademicLeagueById,
  useGetAcademicLeagues,
  useUpdateAcademicLeague,
} from '../../../hooks/query/academicLeague.js';
import { createWrapper } from '../../helpers/queryWrapper.jsx';
import { server } from '../../mocks/server.js';

const BASE = 'http://localhost:3333/sgla-api';

describe('useGetAcademicLeagues', () => {
  it('returns league list on success', async () => {
    server.use(
      http.get(`${BASE}/academic-leagues`, () =>
        HttpResponse.json([
          { _id: 'l1', name: 'Liga de Cardiologia' },
          { _id: 'l2', name: 'Liga de Neurologia' },
        ]),
      ),
    );

    const { result } = renderHook(() => useGetAcademicLeagues(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].name).toBe('Liga de Cardiologia');
  });

  it('transitions to error state on server error', async () => {
    server.use(
      http.get(`${BASE}/academic-leagues`, () =>
        HttpResponse.json({ message: 'Forbidden' }, { status: 403 }),
      ),
    );

    const { result } = renderHook(() => useGetAcademicLeagues(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('respects enabled=false', () => {
    const { result } = renderHook(
      () => useGetAcademicLeagues({ enabled: false }),
      { wrapper: createWrapper() },
    );

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useGetAcademicLeagueById', () => {
  it('fetches a single league', async () => {
    server.use(
      http.get(`${BASE}/academic-leagues/l-xyz`, () =>
        HttpResponse.json({ _id: 'l-xyz', name: 'Liga de Ortopedia' }),
      ),
    );

    const { result } = renderHook(
      () => useGetAcademicLeagueById({ _id: 'l-xyz' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.name).toBe('Liga de Ortopedia');
  });

  it('stays idle when _id is undefined', () => {
    const { result } = renderHook(
      () => useGetAcademicLeagueById({ _id: undefined }),
      { wrapper: createWrapper() },
    );

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useCreateAcademicLeague', () => {
  it('calls onSuccess after creation', async () => {
    server.use(
      http.post(`${BASE}/academic-leagues`, () =>
        HttpResponse.json({ _id: 'new-l', name: 'Liga Nova' }, { status: 201 }),
      ),
    );

    const onSuccess = vi.fn();
    const { result } = renderHook(
      () => useCreateAcademicLeague({ onSuccess }),
      { wrapper: createWrapper() },
    );

    await result.current.mutateAsync({ name: 'Liga Nova' });

    expect(onSuccess).toHaveBeenCalledOnce();
    expect(onSuccess.mock.calls[0][0]).toMatchObject({ _id: 'new-l' });
  });
});

describe('useUpdateAcademicLeague', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useUpdateAcademicLeague(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});

describe('useDeleteAcademicLeague', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useDeleteAcademicLeague(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});
