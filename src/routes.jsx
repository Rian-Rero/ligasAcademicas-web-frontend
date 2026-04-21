import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import { AppLayout } from './layouts';
import {
  Manager,
  Student,
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
        <Route path="student" element={<Student />} />
        <Route
          path="email-confirmation/:token"
          element={<EmailConfirmation />}
        />
      </Route>
      <Route path="manager">
        <Route path="dashboard" element={<Manager />} />
      </Route>
    </Route>,
  ),
);
export default function Routes() {
  return <RouterProvider router={router} />;
}
