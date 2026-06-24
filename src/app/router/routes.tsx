/**
 * @module routes
 * @description Конфигурация маршрутов приложения (react-router-dom v7, lazy-loading).
 */

import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { MainLayout } from '@/widgets/main-layout';

import { GuestRoute } from './GuestRoute';
import { ProtectedRoute } from './ProtectedRoute';

const HomePage = lazy(() => import('@/pages/Home'));
const AboutPage = lazy(() => import('@/pages/About'));
const LoginPage = lazy(() => import('@/pages/Login'));
const RegisterPage = lazy(() => import('@/pages/Register'));
const ProductsPage = lazy(() => import('@/pages/Products'));

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
          { path: 'products', element: <ProductsPage /> },
        ],
      },
    ],
  },
]);
