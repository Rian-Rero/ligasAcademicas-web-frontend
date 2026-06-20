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
  useCreateEvent,
  useDeleteEvent,
  useGetEventById,
  useGetEvents,
  useUpdateEvent,
} from '../../../hooks/query/event.js';
import { createWrapper } from '../../helpers/queryWrapper.jsx';
import { server } from '../../mocks/server.js';

const BASE = 'http://localhost:3333/sgla-api';

describe('useGetEvents', () => {
  it('returns event list on success', async () => {
    server.use(
      http.get(`${BASE}/events`, () =>
        HttpResponse.json([
          { _id: 'e1', title: 'Cardiologia Básica' },
          { _id: 'e2', title: 'Neurologia Avançada' },
        ]),
      ),
    );

    const { result } = renderHook(() => useGetEvents(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
  });

  it('transitions to error state on server error', async () => {
    server.use(
      http.get(`${BASE}/events`, () =>
        HttpResponse.json({ message: 'Forbidden' }, { status: 403 }),
      ),
    );

    const { result } = renderHook(() => useGetEvents(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('respects enabled=false', () => {
    const { result } = renderHook(() => useGetEvents({ enabled: false }), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useGetEventById', () => {
  it('fetches a single event', async () => {
    server.use(
      http.get(`${BASE}/events/ev-xyz`, () =>
        HttpResponse.json({ _id: 'ev-xyz', title: 'Workshop de Suturas' }),
      ),
    );

    const { result } = renderHook(() => useGetEventById({ _id: 'ev-xyz' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.title).toBe('Workshop de Suturas');
  });

  it('stays idle when _id is falsy', () => {
    const { result } = renderHook(() => useGetEventById({ _id: '' }), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useCreateEvent', () => {
  it('calls onSuccess after a successful mutation', async () => {
    server.use(
      http.post(`${BASE}/events`, () =>
        HttpResponse.json(
          { _id: 'new-ev', title: 'Novo Evento' },
          { status: 201 },
        ),
      ),
    );

    const onSuccess = vi.fn();
    const { result } = renderHook(() => useCreateEvent({ onSuccess }), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({ title: 'Novo Evento' });

    expect(onSuccess).toHaveBeenCalledOnce();
    expect(onSuccess.mock.calls[0][0]).toMatchObject({ _id: 'new-ev' });
  });
});

describe('useUpdateEvent', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useUpdateEvent(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});

describe('useDeleteEvent', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useDeleteEvent(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});
