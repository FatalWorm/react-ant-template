import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

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

    expect(await screen.findByText('Технологический стек')).toBeInTheDocument();
  });
});
