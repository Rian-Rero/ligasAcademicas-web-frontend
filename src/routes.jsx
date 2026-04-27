import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  useLocation,
  Navigate,
  Outlet,
} from 'react-router-dom';

import { useGetLeagueMemberships } from './hooks/query/leagueMembership';
import {
  AppLayout,
  StudentSideBarLayout,
  ManagerSideBarLayout,
} from './layouts';
import {
  ManagerDashboard,
  StudentDashboard,
  EmailConfirmation,
  ForgotPassword,
  Home,
  Login,
  Profile,
  Register,
} from './pages';
import useAuthStore from './stores/auth';

const MANAGER_ROLE_KEYWORDS = [
  'admin',
  'manager',
  'gest',
  'diret',
  'presid',
  'coorden',
];

function hasManagerRole(role) {
  if (!role) return false;

  const normalizedRole = String(role).trim().toLocaleLowerCase('pt-BR');
  return MANAGER_ROLE_KEYWORDS.some((keyword) =>
    normalizedRole.includes(keyword),
  );
}

// For the routes that need the user to be logged in
function PrivateRoutes() {
  const auth = useAuthStore((state) => state?.auth);
  const { pathname: from } = useLocation();

  return !auth ? <Navigate to="/login" state={{ from }} /> : <Outlet />;
}

function ManagerPrivateRoutes() {
  const authUser = useAuthStore((state) => state.auth?.user);
  const { pathname: from } = useLocation();

  const { data: memberships = [], isLoading } = useGetLeagueMemberships({
    filters: { user: authUser?._id, isActive: true },
    enabled: Boolean(authUser?._id),
  });

  const hasManagementMembership = memberships.some((membership) =>
    hasManagerRole(membership?.role),
  );

  const canAccessManager =
    hasManagerRole(authUser?.globalRole) || hasManagementMembership;

  if (isLoading) return null;

  return canAccessManager ? (
    <Outlet />
  ) : (
    <Navigate to="/student/dashboard" replace state={{ from }} />
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route
          path="email-confirmation/:token"
          element={<EmailConfirmation />}
        />
        <Route element={<PrivateRoutes />}>
          <Route path="student" element={<StudentSideBarLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="events" element={<StudentDashboard />} />
            <Route path="certificates" element={<StudentDashboard />} />
            <Route path="team" element={<StudentDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<StudentDashboard />} />
          </Route>

          <Route element={<ManagerPrivateRoutes />}>
            <Route path="manager" element={<ManagerSideBarLayout />}>
              <Route path="dashboard" element={<ManagerDashboard />} />
              <Route path="cadastrar-membro" element={<Register />} />
              <Route path="perfil" element={<Profile />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<ManagerDashboard />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Route>,
  ),
);
export default function Routes() {
  return <RouterProvider router={router} />;
}
