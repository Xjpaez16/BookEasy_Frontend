import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { DashboardPage } from '../../pages/dashboard/DashboardPage';
import { LoginPage } from '../../pages/auth/LoginPage';
import { RegisterPage } from '../../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../../pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from '../../pages/auth/VerifyEmailPage';
import { RequireAuth } from '../../features/auth/RequireAuth';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },

  // Public auth routes.
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/verify-email', element: <VerifyEmailPage /> },

  // Protected app routes.
  {
    path: '/dashboard',
    element: (
      <RequireAuth>
        <DashboardPage />
      </RequireAuth>
    ),
  },

  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
