import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { DashboardPage } from '../../pages/dashboard/DashboardPage';
import { LoginPage } from '../../pages/auth/LoginPage';
import { RegisterPage } from '../../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../../pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from '../../pages/auth/VerifyEmailPage';
import { OnboardingPage } from '../../pages/onboarding/OnboardingPage';
import { BusinessSettingsPage } from '../../pages/settings/BusinessSettingsPage';
import { StaffPage } from '../../pages/settings/StaffPage';
import { ServicesPage } from '../../pages/catalog/ServicesPage';
import { CustomersPage } from '../../pages/catalog/CustomersPage';
import { RequireToken } from '../../features/auth/RequireToken';
import { RequireBusiness } from '../../features/business/RequireBusiness';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },

  // Public auth routes.
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/verify-email', element: <VerifyEmailPage /> },

  // Authenticated but pre-business: create a business.
  {
    path: '/onboarding',
    element: (
      <RequireToken>
        <OnboardingPage />
      </RequireToken>
    ),
  },

  // Protected app routes — require an active business (which also proves auth).
  {
    path: '/dashboard',
    element: (
      <RequireBusiness>
        <DashboardPage />
      </RequireBusiness>
    ),
  },
  {
    path: '/settings/business',
    element: (
      <RequireBusiness>
        <BusinessSettingsPage />
      </RequireBusiness>
    ),
  },
  {
    path: '/settings/staff',
    element: (
      <RequireBusiness>
        <StaffPage />
      </RequireBusiness>
    ),
  },
  {
    path: '/catalog/services',
    element: (
      <RequireBusiness>
        <ServicesPage />
      </RequireBusiness>
    ),
  },
  {
    path: '/catalog/customers',
    element: (
      <RequireBusiness>
        <CustomersPage />
      </RequireBusiness>
    ),
  },

  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
