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
  AdminSideBarLayout,
  StudentSideBarLayout,
  ManagerSideBarLayout,
} from './layouts';
import {
  AdminAcademicLeagues,
  AdminDashboard,
  AdminUniversities,
  AdminUsers,
  ManagerDashboard,
  ManagerEvents,
  ManagerEventsList,
  ManagerMembers,
  ManagerSquads,
  StudentEvents,
  StudentDashboard,
  StudentTeam,
  EmailConfirmation,
  ForgotPassword,
  RedefinePassword,
  ChangePassword,
  Home,
  Login,
  Profile,
  Register,
} from './pages';
import useAuthStore from './stores/auth';
import { hasAdminRole, hasManagerRole } from './utils/roles';

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

function AdminPrivateRoutes() {
  const authUser = useAuthStore((state) => state.auth?.user);
  const { pathname: from } = useLocation();

  return hasAdminRole(authUser?.globalRole) ? (
    <Outlet />
  ) : (
    <Navigate to="/manager/dashboard" replace state={{ from }} />
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="redefinir-senha/:token" element={<RedefinePassword />} />
        <Route
          path="email-confirmation/:token"
          element={<EmailConfirmation />}
        />
        <Route element={<PrivateRoutes />}>
          <Route path="change-password" element={<ChangePassword />} />

          <Route element={<AdminPrivateRoutes />}>
            <Route path="admin" element={<AdminSideBarLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="universidades" element={<AdminUniversities />} />
              <Route
                path="ligas-academicas"
                element={<AdminAcademicLeagues />}
              />
              <Route path="usuarios" element={<AdminUsers />} />
              <Route path="perfil" element={<Profile />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<AdminDashboard />} />
            </Route>
          </Route>

          <Route path="student" element={<StudentSideBarLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="events" element={<StudentEvents />} />
            <Route path="certificates" element={<StudentDashboard />} />
            <Route path="team" element={<StudentTeam />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<StudentDashboard />} />
          </Route>

          <Route element={<ManagerPrivateRoutes />}>
            <Route path="manager" element={<ManagerSideBarLayout />}>
              <Route path="dashboard" element={<ManagerDashboard />} />
              <Route path="eventos" element={<ManagerEventsList />} />
              <Route path="criar-evento" element={<ManagerEvents />} />
              <Route path="membros" element={<ManagerMembers />} />
              <Route path="subequipes" element={<ManagerSquads />} />
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
