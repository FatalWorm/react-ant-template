/**
 * @module App
 * @description Корневой компонент приложения: провайдеры + роутер.
 */

import { RouterProvider } from 'react-router-dom';

import { AppProviders } from '@/App/Providers';
import { router } from '@/App/Router/Routes';

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
