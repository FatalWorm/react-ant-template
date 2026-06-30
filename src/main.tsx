/**
 * @module main
 * @description Точка входа: инициализация i18n, рендеринг React-дерева в DOM.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';

import '@/Shared/I18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
