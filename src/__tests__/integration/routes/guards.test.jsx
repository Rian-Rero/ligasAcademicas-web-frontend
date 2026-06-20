import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import {
  MemoryRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useGetLeagueMemberships } from '../../../hooks/query/leagueMembership.js';
import useAuthStore from '../../../stores/auth.js';
import Theme from '../../../styles/Theme.jsx';
import { hasAdminRole, hasManagerRole } from '../../../utils/roles.js';

const { mockUseAuthStore } = vi.hoisted(() => ({
  mockUseAuthStore: vi.fn(),
}));

vi.mock('../../../stores/auth.js', () => ({ default: mockUseAuthStore }));

vi.mock('../../../hooks/query/leagueMembership.js', () => ({
  useGetLeagueMemberships: vi.fn(),
}));

// Local recreations of the unexported guard components from routes.jsx
function PrivateRoutes() {
  const auth = useAuthStore((state) => state?.auth);
  const { pathname: from } = useLocation();
  return !auth ? <Navigate to="/login" state={{ from }} /> : <Outlet />;
}

function AdminPrivateRoutes() {
  const authUser = useAuthStore((state) => state.auth?.user);
  const { pathname: from } = useLocation();
  return hasAdminRole(authUser?.roleKeys) ? (
    <Outlet />
  ) : (
    <Navigate to="/manager/dashboard" replace state={{ from }} />
  );
}

function ManagerPrivateRoutes() {
  const authUser = useAuthStore((state) => state.auth?.user);
  const { pathname: from } = useLocation();
  const { data: memberships = [], isLoading } = useGetLeagueMemberships({
    filters: { user: authUser?._id, isActive: true },
    enabled: Boolean(authUser?._id),
  });

  const hasManagementMembership = memberships.some((m) =>
    hasManagerRole(m?.role),
  );
  const canAccessManager =
    hasManagerRole(authUser?.roleKeys) || hasManagementMembership;

  if (isLoading) return null;

  return canAccessManager ? (
    <Outlet />
  ) : (
    <Navigate to="/student/dashboard" replace state={{ from }} />
  );
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function renderGuards(Guard, { initialPath, protectedPath = '/protected' }) {
  return render(
    <Theme>
      <QueryClientProvider client={makeQueryClient()}>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route element={<Guard />}>
              <Route
                path={protectedPath}
                element={<div>Protected Content</div>}
              />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route
              path="/student/dashboard"
              element={<div>Student Dashboard</div>}
            />
            <Route
              path="/manager/dashboard"
              element={<div>Manager Dashboard</div>}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </Theme>,
  );
}

describe('PrivateRoutes guard', () => {
  beforeEach(() => vi.clearAllMocks());

  it('redirects unauthenticated users to /login', () => {
    mockUseAuthStore.mockImplementation((selector) => selector({ auth: null }));
    renderGuards(PrivateRoutes, { initialPath: '/protected' });
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders protected content for authenticated users', () => {
    mockUseAuthStore.mockImplementation((selector) =>
      selector({ auth: { user: { _id: 'u-1', roleKeys: [] } } }),
    );
    renderGuards(PrivateRoutes, { initialPath: '/protected' });
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});

describe('AdminPrivateRoutes guard', () => {
  beforeEach(() => vi.clearAllMocks());

  it('redirects non-admin users to /manager/dashboard', () => {
    mockUseAuthStore.mockImplementation((selector) =>
      selector({
        auth: { user: { _id: 'u-1', roleKeys: [] } },
      }),
    );
    renderGuards(AdminPrivateRoutes, { initialPath: '/protected' });
    expect(screen.getByText('Manager Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders protected content for admin users', () => {
    mockUseAuthStore.mockImplementation((selector) =>
      selector({
        auth: { user: { _id: 'u-2', roleKeys: ['admin'] } },
      }),
    );
    renderGuards(AdminPrivateRoutes, { initialPath: '/protected' });
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Manager Dashboard')).not.toBeInTheDocument();
  });

  it('redirects a manager user (without admin role) to /manager/dashboard', () => {
    mockUseAuthStore.mockImplementation((selector) =>
      selector({
        auth: { user: { _id: 'u-3', roleKeys: ['manager'] } },
      }),
    );
    renderGuards(AdminPrivateRoutes, { initialPath: '/protected' });
    expect(screen.getByText('Manager Dashboard')).toBeInTheDocument();
  });
});

describe('ManagerPrivateRoutes guard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useGetLeagueMemberships.mockReturnValue({ data: [], isLoading: false });
  });

  it('redirects a plain student to /student/dashboard', async () => {
    mockUseAuthStore.mockImplementation((selector) =>
      selector({
        auth: { user: { _id: 'u-1', roleKeys: [] } },
      }),
    );
    renderGuards(ManagerPrivateRoutes, { initialPath: '/protected' });
    await waitFor(() => {
      expect(screen.getByText('Student Dashboard')).toBeInTheDocument();
    });
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders protected content for users with the manager role key', async () => {
    mockUseAuthStore.mockImplementation((selector) =>
      selector({
        auth: { user: { _id: 'u-2', roleKeys: ['manager'] } },
      }),
    );
    renderGuards(ManagerPrivateRoutes, { initialPath: '/protected' });
    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  it('renders protected content for a member with a management league membership', async () => {
    mockUseAuthStore.mockImplementation((selector) =>
      selector({
        auth: { user: { _id: 'u-3', roleKeys: [] } },
      }),
    );
    useGetLeagueMemberships.mockReturnValue({
      data: [{ _id: 'm1', role: 'manager', isActive: true }],
      isLoading: false,
    });
    renderGuards(ManagerPrivateRoutes, { initialPath: '/protected' });
    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  it('renders null (nothing) while memberships are loading', () => {
    mockUseAuthStore.mockImplementation((selector) =>
      selector({
        auth: { user: { _id: 'u-3', roleKeys: [] } },
      }),
    );
    useGetLeagueMemberships.mockReturnValue({
      data: [],
      isLoading: true,
    });
    const { container } = renderGuards(ManagerPrivateRoutes, {
      initialPath: '/protected',
    });
    expect(container.textContent).toBe('');
  });
});
