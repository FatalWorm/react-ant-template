import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '@/App';
import { mockAuthenticated } from './helpers/authHelpers';

describe('App', () => {
  beforeEach(() => {
    mockAuthenticated();
  });

  it('рендерится без ошибок', () => {
    render(<App />);
    expect(document.getElementById('root') || document.body).toBeTruthy();
  });

  it('отображает логотип в шапке', async () => {
    render(<App />);
    const logo = await screen.findByText('⚡ React Template');
    expect(logo).toBeInTheDocument();
  });

  it('отображает навигационные ссылки', async () => {
    render(<App />);
    expect(await screen.findByText('Главная')).toBeInTheDocument();
    expect(await screen.findByText('О проекте')).toBeInTheDocument();
    expect(await screen.findByText('Форма')).toBeInTheDocument();
    expect(await screen.findByText('Список')).toBeInTheDocument();
  });
});
