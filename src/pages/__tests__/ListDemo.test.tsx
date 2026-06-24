import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach,describe, expect, it } from 'vitest';

import App from '@/App';

import { mockAuthenticated } from '../../__tests__/helpers/authHelpers';

describe('ListDemoPage', () => {
  beforeEach(() => {
    mockAuthenticated();
  });

  it('отображает виртуализированный список', async () => {
    const user = userEvent.setup();
    render(<App />);

    const listLink = await screen.findByText('Список');
    await user.click(listLink);

    expect(await screen.findByText('Виртуализированный список')).toBeInTheDocument();
    expect(screen.getByText(/элементов через react-window/i)).toBeInTheDocument();
  });
});
