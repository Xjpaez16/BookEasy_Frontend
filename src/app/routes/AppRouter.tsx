import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { RequireToken } from '../../features/auth/RequireToken';
import { RequireBusiness } from '../../features/business/RequireBusiness';
import { RequireAuthForBooking } from '../../features/storefront/RequireAuthForBooking';

/*
 * Route-level code splitting. Each page is its own lazy chunk, so the public
 * marketplace (first paint for most visitors) doesn't ship the owner-only
 * dashboard code or the motion library until it's actually needed.
 */
const MarketplacePage = lazy(() =>
  import('../../pages/public/MarketplacePage').then((m) => ({ default: m.MarketplacePage })),
);
const StorefrontPage = lazy(() =>
  import('../../pages/public/StorefrontPage').then((m) => ({ default: m.StorefrontPage })),
);
const BookingPage = lazy(() =>
  import('../../pages/public/BookingPage').then((m) => ({ default: m.BookingPage })),
);
const MyAppointmentsPage = lazy(() =>
  import('../../pages/public/MyAppointmentsPage').then((m) => ({ default: m.MyAppointmentsPage })),
);
const LoginPage = lazy(() =>
  import('../../pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import('../../pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })),
);
const ForgotPasswordPage = lazy(() =>
  import('../../pages/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })),
);
const ResetPasswordPage = lazy(() =>
  import('../../pages/auth/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })),
);
const VerifyEmailPage = lazy(() =>
  import('../../pages/auth/VerifyEmailPage').then((m) => ({ default: m.VerifyEmailPage })),
);
const OnboardingPage = lazy(() =>
  import('../../pages/onboarding/OnboardingPage').then((m) => ({ default: m.OnboardingPage })),
);
const DashboardPage = lazy(() =>
  import('../../pages/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const BusinessSettingsPage = lazy(() =>
  import('../../pages/settings/BusinessSettingsPage').then((m) => ({ default: m.BusinessSettingsPage })),
);
const BusinessHoursPage = lazy(() =>
  import('../../pages/settings/BusinessHoursPage').then((m) => ({ default: m.BusinessHoursPage })),
);
const StaffPage = lazy(() =>
  import('../../pages/settings/StaffPage').then((m) => ({ default: m.StaffPage })),
);
const ServicesPage = lazy(() =>
  import('../../pages/catalog/ServicesPage').then((m) => ({ default: m.ServicesPage })),
);
const CustomersPage = lazy(() =>
  import('../../pages/catalog/CustomersPage').then((m) => ({ default: m.CustomersPage })),
);
const CalendarPage = lazy(() =>
  import('../../pages/calendar/CalendarPage').then((m) => ({ default: m.CalendarPage })),
);

/** Full-viewport fallback while a route chunk loads. */
function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-body">
      <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
    </div>
  );
}

/** Wraps a lazy page element in Suspense. */
function page(node: ReactNode) {
  return <Suspense fallback={<PageFallback />}>{node}</Suspense>;
}

const router = createBrowserRouter([
  // Public marketplace (unauthenticated storefront).
  { path: '/', element: page(<MarketplacePage />) },
  { path: '/b/:slug', element: page(<StorefrontPage />) },
  {
    path: '/b/:slug/book',
    element: page(
      <RequireAuthForBooking>
        <BookingPage />
      </RequireAuthForBooking>,
    ),
  },
  {
    path: '/b/:slug/my-appointments',
    element: page(
      <RequireAuthForBooking>
        <MyAppointmentsPage />
      </RequireAuthForBooking>,
    ),
  },

  // Public auth routes.
  { path: '/login', element: page(<LoginPage />) },
  { path: '/register', element: page(<RegisterPage />) },
  { path: '/forgot-password', element: page(<ForgotPasswordPage />) },
  { path: '/reset-password', element: page(<ResetPasswordPage />) },
  { path: '/verify-email', element: page(<VerifyEmailPage />) },

  // Authenticated but pre-business: create a business.
  {
    path: '/onboarding',
    element: page(
      <RequireToken>
        <OnboardingPage />
      </RequireToken>,
    ),
  },

  // Protected app routes — require an active business (which also proves auth).
  {
    path: '/dashboard',
    element: page(
      <RequireBusiness>
        <DashboardPage />
      </RequireBusiness>,
    ),
  },
  {
    path: '/calendar',
    element: page(
      <RequireBusiness>
        <CalendarPage />
      </RequireBusiness>,
    ),
  },
  {
    path: '/settings/business',
    element: page(
      <RequireBusiness>
        <BusinessSettingsPage />
      </RequireBusiness>,
    ),
  },
  {
    path: '/settings/hours',
    element: page(
      <RequireBusiness>
        <BusinessHoursPage />
      </RequireBusiness>,
    ),
  },
  {
    path: '/settings/staff',
    element: page(
      <RequireBusiness>
        <StaffPage />
      </RequireBusiness>,
    ),
  },
  {
    path: '/catalog/services',
    element: page(
      <RequireBusiness>
        <ServicesPage />
      </RequireBusiness>,
    ),
  },
  {
    path: '/catalog/customers',
    element: page(
      <RequireBusiness>
        <CustomersPage />
      </RequireBusiness>,
    ),
  },

  { path: '*', element: <Navigate to="/" replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
