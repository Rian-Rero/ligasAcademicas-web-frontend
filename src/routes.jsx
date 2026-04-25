import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import { AppLayout, StudentSideBarLayout } from './layouts';
import {
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
          <Route path="dashboard" element={<StudentDashboard />} />
        </Route>
      </Route>
    </Route>,
  ),
);
export default function Routes() {
  return <RouterProvider router={router} />;
}
