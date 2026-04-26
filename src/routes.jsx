import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  useLocation,
  Navigate,
  Outlet,
} from 'react-router-dom';

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

// For the routes that need the user to be logged in
function PrivateRoutes() {
  const auth = useAuthStore((state) => state?.auth);
  const { pathname: from } = useLocation();

  return !auth ? <Navigate to="/login" state={{ from }} /> : <Outlet />;
}
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
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
          <Route path="manager" element={<ManagerSideBarLayout />}>
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route path="perfil" element={<Profile />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<ManagerDashboard />} />
          </Route>
        </Route>
      </Route>
    </Route>,
  ),
);
export default function Routes() {
  return <RouterProvider router={router} />;
}
