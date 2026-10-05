import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { DashboardPage } from '../../pages/dashboard/DashboardPage';
import { LoginPage } from '../../pages/auth/LoginPage';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/dashboard', element: <DashboardPage /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
