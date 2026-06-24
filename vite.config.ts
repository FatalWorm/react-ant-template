/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig({
  // Плагины расширяют базовые возможности Vite
  plugins: [
    // Поддержка React (JSX, HMR - горячая замена модулей без перезагрузки)
    react(),

    // Автоматическое сжатие файлов сборки алгоритмом Brotli для ускорения загрузки статики на продакшене
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),

    // Генерирует интерактивную HTML-карту (stats.html) для анализа размера и состава итогового бандла
    visualizer({
      filename: 'dist/stats.html',
      open: false, // Измените на true, чтобы карта автоматически открывалась в браузере после сборки
    }),
  ],

  // Настройки резолва модулей и путей
  resolve: {
    alias: {
      // Алиас '@' указывает на папку 'src' (позволяет писать импорты вида '@/components/Button')
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Настройки процесса сборки (build)
  build: {
    // Тонкая настройка Rollup (движка сборки Vite)
    rollupOptions: {
      output: {
        // Разделение большого бандла на мелкие чанки (Code Splitting) для оптимального кеширования в браузере
        manualChunks(id) {
          // Выделяем ядро React и роутинга в отдельный чанк 'vendor-react'
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router')
          ) {
            return 'vendor-react';
          }
          // Выделяем внутренние зависимости Ant Design (иконки, базовые утилиты)
          if (id.includes('node_modules/@ant-design')) {
            return 'vendor-ant-design';
          }
          // Выделяем низкоуровневые react-компоненты (на которых построен antd)
          if (id.includes('node_modules/rc-')) {
            return 'vendor-rc';
          }
          // Выделяем саму библиотеку antd
          if (id.includes('node_modules/antd')) {
            return 'vendor-antd';
          }
          // Выделяем библиотеку для работы со временем (luxon)
          if (id.includes('node_modules/luxon')) {
            return 'vendor-luxon';
          }
        },
      },
    },
    // Увеличиваем лимит размера чанка до 1MB перед тем как Vite начнет выдавать предупреждение (т.к. antd довольно большой)
    chunkSizeWarningLimit: 1000,
  },

  // Настройки для юнит-тестов (Vitest)
  test: {
    // Включаем глобальные переменные для тестов (describe, it, expect), чтобы не импортировать их в каждом файле
    globals: true,
    // Эмулируем браузерную среду через jsdom (необходимо для тестирования React компонентов)
    environment: 'jsdom',
    // Файл, который запускается перед всеми тестами (обычно там импортируются кастомные матчеры @testing-library/jest-dom)
    setupFiles: './src/__tests__/setup.ts',
    // Включаем поддержку обработки CSS в тестах
    css: true,
  },
});
