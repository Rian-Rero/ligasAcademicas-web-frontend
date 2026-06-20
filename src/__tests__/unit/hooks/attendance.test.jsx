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
  useConfirmAttendance,
  useCreateAttendance,
  useDeleteAttendance,
  useGetAttendanceById,
  useGetAttendances,
  useMarkAttendance,
} from '../../../hooks/query/attendance.js';
import { createWrapper } from '../../helpers/queryWrapper.jsx';
import { server } from '../../mocks/server.js';

const BASE = 'http://localhost:3333/sgla-api';

describe('useGetAttendances', () => {
  it('returns attendance list on success', async () => {
    server.use(
      http.get(`${BASE}/attendances`, () =>
        HttpResponse.json([
          { _id: 'a1', hasAttended: true },
          { _id: 'a2', hasAttended: false },
        ]),
      ),
    );

    const { result } = renderHook(() => useGetAttendances(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].hasAttended).toBe(true);
  });

  it('respects enabled=false', () => {
    const { result } = renderHook(() => useGetAttendances({ enabled: false }), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useGetAttendanceById', () => {
  it('fetches a single attendance record', async () => {
    server.use(
      http.get(`${BASE}/attendances/a-abc`, () =>
        HttpResponse.json({
          _id: 'a-abc',
          hasAttended: true,
          isConfirmed: true,
        }),
      ),
    );

    const { result } = renderHook(
      () => useGetAttendanceById({ _id: 'a-abc' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.isConfirmed).toBe(true);
  });

  it('stays idle when _id is undefined', () => {
    const { result } = renderHook(
      () => useGetAttendanceById({ _id: undefined }),
      { wrapper: createWrapper() },
    );

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useCreateAttendance', () => {
  it('calls onSuccess after creation', async () => {
    server.use(
      http.post(`${BASE}/attendances`, () =>
        HttpResponse.json(
          { _id: 'new-a', hasAttended: false },
          { status: 201 },
        ),
      ),
    );

    const onSuccess = vi.fn();
    const { result } = renderHook(() => useCreateAttendance({ onSuccess }), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({ event: 'e1', leagueMembership: 'm1' });

    expect(onSuccess).toHaveBeenCalledOnce();
    expect(onSuccess.mock.calls[0][0]).toMatchObject({ _id: 'new-a' });
  });
});

describe('useConfirmAttendance', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useConfirmAttendance(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});

describe('useMarkAttendance', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useMarkAttendance(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});

describe('useDeleteAttendance', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useDeleteAttendance(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});
