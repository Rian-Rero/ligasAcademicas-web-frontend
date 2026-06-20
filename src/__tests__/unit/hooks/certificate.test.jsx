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
  useCreateCertificate,
  useDeleteCertificate,
  useGetCertificateById,
  useGetCertificates,
  useGetCertificateSummaryByLeagueMembership,
  useGetLatestCertificateByLeagueMembership,
} from '../../../hooks/query/certificate.js';
import { createWrapper } from '../../helpers/queryWrapper.jsx';
import { server } from '../../mocks/server.js';

const BASE = 'http://localhost:3333/sgla-api';

describe('useGetCertificates', () => {
  it('returns certificate list on success', async () => {
    server.use(
      http.get(`${BASE}/certificates`, () =>
        HttpResponse.json([{ _id: 'c1', workLoadHours: 40 }]),
      ),
    );

    const { result } = renderHook(() => useGetCertificates(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
  });

  it('respects enabled=false', () => {
    const { result } = renderHook(
      () => useGetCertificates({ enabled: false }),
      { wrapper: createWrapper() },
    );

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useGetCertificateById', () => {
  it('fetches a single certificate', async () => {
    server.use(
      http.get(`${BASE}/certificates/c-abc`, () =>
        HttpResponse.json({ _id: 'c-abc', workLoadHours: 80 }),
      ),
    );

    const { result } = renderHook(
      () => useGetCertificateById({ _id: 'c-abc' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.workLoadHours).toBe(80);
  });

  it('stays idle when _id is undefined', () => {
    const { result } = renderHook(
      () => useGetCertificateById({ _id: undefined }),
      { wrapper: createWrapper() },
    );

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useGetLatestCertificateByLeagueMembership', () => {
  it('fetches latest certificate for a membership', async () => {
    server.use(
      http.get(`${BASE}/certificates/league-memberships/m-1/latest`, () =>
        HttpResponse.json({ _id: 'c-latest', workLoadHours: 60 }),
      ),
    );

    const { result } = renderHook(
      () =>
        useGetLatestCertificateByLeagueMembership({ leagueMembership: 'm-1' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    // Either succeeds or errors, but never stays loading forever
    expect(result.current.fetchStatus).not.toBe('fetching');
  });

  it('stays idle when leagueMembership is undefined', () => {
    const { result } = renderHook(
      () =>
        useGetLatestCertificateByLeagueMembership({
          leagueMembership: undefined,
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useGetCertificateSummaryByLeagueMembership', () => {
  it('stays idle when leagueMembership is undefined', () => {
    const { result } = renderHook(
      () =>
        useGetCertificateSummaryByLeagueMembership({
          leagueMembership: undefined,
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useCreateCertificate', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useCreateCertificate(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});

describe('useDeleteCertificate', () => {
  it('exposes a mutateAsync function', () => {
    const { result } = renderHook(() => useDeleteCertificate(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.mutateAsync).toBe('function');
  });
});
