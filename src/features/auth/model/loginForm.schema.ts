/**
 * @module loginForm.schema
 * @description Zod-схема валидации формы входа (email + пароль) с локализованными сообщениями.
 */

import { z } from 'zod';

import type { TFunction } from '@/shared/i18n';

export function createLoginSchema(t: TFunction) {
  return z.object({
    email: z.email(t('validation.invalidEmail')),
    password: z.string().min(6, t('validation.minChars', { min: 6 })),
  });
}

export type TLoginForm = z.infer<ReturnType<typeof createLoginSchema>>;
