import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import { GuestRoute } from '@/router/GuestRoute';

const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const FormDemoPage = lazy(() => import('@/pages/FormDemoPage'));
const ListDemoPage = lazy(() => import('@/pages/ListDemoPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));

export const router = createBrowserRouter([
  // Гостевые маршруты (только для неавторизованных)
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  // Защищённые маршруты
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'about', element: <AboutPage /> },
          { path: 'form-demo', element: <FormDemoPage /> },
          { path: 'list-demo', element: <ListDemoPage /> },
        ],
      },
    ],
  },
]);
