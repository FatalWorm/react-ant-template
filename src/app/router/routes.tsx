/**
 * @module routes
 * @description Конфигурация маршрутов приложения (react-router-dom v7, lazy-loading).
 */

import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { MainLayout } from '@/Widgets/MainLayout';

import { GuestRoute } from './GuestRoute';
import { ProtectedRoute } from './ProtectedRoute';

const HomePage = lazy(() => import('@/Pages/Home'));
const AboutPage = lazy(() => import('@/Pages/About'));
const LoginPage = lazy(() => import('@/Pages/Login'));
const RegisterPage = lazy(() => import('@/Pages/Register'));
const ProductsPage = lazy(() => import('@/Pages/Products'));
const PostsPage = lazy(() => import('@/Pages/Posts'));

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
          { path: 'posts', element: <PostsPage /> },
        ],
      },
    ],
  },
]);
