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
  useCompleteTask,
  useCreateTask,
  useDeleteTask,
  useGetTaskById,
  useGetTasks,
  useUpdateTask,
} from '../../../hooks/query/task.js';
import { createWrapper } from '../../helpers/queryWrapper.jsx';
import { server } from '../../mocks/server.js';

const BASE = 'http://localhost:3333/sgla-api';

describe('useGetTasks', () => {
  it('returns task list on success', async () => {
    server.use(
      http.get(`${BASE}/tasks`, () =>
        HttpResponse.json([
          { _id: 't1', title: 'Preparar slides', completed: false },
          { _id: 't2', title: 'Revisar artigo', completed: true },
        ]),
      ),
    );

    const { result } = renderHook(() => useGetTasks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[1].completed).toBe(true);
  });

  it('transitions to error state on server error', async () => {
    server.use(
      http.get(`${BASE}/tasks`, () =>
        HttpResponse.json({ message: 'Forbidden' }, { status: 403 }),
      ),
    );

    const { result } = renderHook(() => useGetTasks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('respects the enabled=false option', () => {
    const { result } = renderHook(() => useGetTasks({ enabled: false }), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useGetTaskById', () => {
  it('fetches a single task', async () => {
    server.use(
      http.get(`${BASE}/tasks/t-abc`, () =>
        HttpResponse.json({
          _id: 't-abc',
          title: 'Organizar laboratório',
          completed: false,
        }),
      ),
    );

    const { result } = renderHook(() => useGetTaskById({ _id: 't-abc' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.title).toBe('Organizar laboratório');
  });

  it('stays idle when _id is undefined', () => {
    const { result } = renderHook(() => useGetTaskById({ _id: undefined }), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useCreateTask', () => {
  it('calls onSuccess after successful creation', async () => {
    server.use(
      http.post(`${BASE}/tasks`, () =>
        HttpResponse.json(
          { _id: 'new-t', title: 'Nova Tarefa' },
          { status: 201 },
        ),
      ),
    );

    const onSuccess = vi.fn();
    const { result } = renderHook(() => useCreateTask({ onSuccess }), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({ title: 'Nova Tarefa' });

    expect(onSuccess).toHaveBeenCalledOnce();
    expect(onSuccess.mock.calls[0][0]).toMatchObject({ _id: 'new-t' });
  });
});

describe('useUpdateTask', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useUpdateTask(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});

describe('useCompleteTask', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useCompleteTask(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});

describe('useDeleteTask', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useDeleteTask(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});
