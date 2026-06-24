import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach,describe, expect, it } from 'vitest';

import App from '@/App';

import { mockAuthenticated } from './helpers/authHelpers';

describe('Навигация', () => {
  beforeEach(() => {
    mockAuthenticated();
  });

  it('переходит на страницу "О проекте"', async () => {
    const user = userEvent.setup();
    render(<App />);

    const aboutLink = await screen.findByText('О проекте');
    await user.click(aboutLink);

    expect(await screen.findByText('Что включено')).toBeInTheDocument();
  });

  it('переходит на страницу формы', async () => {
    const user = userEvent.setup();
    render(<App />);

    const formLink = await screen.findByText('Форма');
    await user.click(formLink);

    expect(await screen.findByText('Демо формы')).toBeInTheDocument();
  });

  it('переходит на страницу списка', async () => {
    const user = userEvent.setup();
    render(<App />);

    const listLink = await screen.findByText('Список');
    await user.click(listLink);

    expect(await screen.findByText('Виртуализированный список')).toBeInTheDocument();
  });
});
