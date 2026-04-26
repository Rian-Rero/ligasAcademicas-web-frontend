import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
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
} from './pages';

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
        <Route path="student" element={<StudentSideBarLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="events" element={<StudentDashboard />} />
          <Route path="certificates" element={<StudentDashboard />} />
          <Route path="team" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentDashboard />} />
          <Route path="*" element={<StudentDashboard />} />
        </Route>
        <Route path="manager" element={<ManagerSideBarLayout />}>
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="*" element={<ManagerDashboard />} />
        </Route>
      </Route>
    </Route>,
  ),
);
export default function Routes() {
  return <RouterProvider router={router} />;
}
