import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach,describe, expect, it } from 'vitest';

import App from '@/App';

import { mockAuthenticated } from '../../__tests__/helpers/authHelpers';

describe('FormDemoPage', () => {
  beforeEach(() => {
    mockAuthenticated();
  });

  async function navigateToForm() {
    const user = userEvent.setup();
    render(<App />);
    const formLink = await screen.findByText('Форма');
    await user.click(formLink);
    await screen.findByText('Демо формы');
    return user;
  }

  it('показывает ошибки валидации при пустой отправке', async () => {
    const user = await navigateToForm();

    const submitButton = screen.getByText('Отправить');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Не менее 2 символов')).toBeInTheDocument();
    });
  });

  it('успешно отправляет форму с валидными данными', async () => {
    const user = await navigateToForm();

    await user.type(screen.getByPlaceholderText('Введите имя'), 'Тест Юзер');
    await user.type(screen.getByPlaceholderText('example@mail.com'), 'test@mail.ru');
    await user.type(screen.getByPlaceholderText('Опишите ваш запрос...'), 'Это тестовое сообщение для проверки формы');

    const submitButton = screen.getByText('Отправить');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('✅ Форма отправлена')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
