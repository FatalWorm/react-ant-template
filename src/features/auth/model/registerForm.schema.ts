/**
 * @module registerForm.schema
 * @description Zod-схема валидации формы регистрации с проверкой совпадения паролей.
 */

import { z } from 'zod';

import type { TFunction } from '@/shared/i18n';

export function createRegisterSchema(t: TFunction) {
  return z
    .object({
      name: z
        .string()
        .min(2, t('validation.minChars', { min: 2 }))
        .max(50, t('validation.maxChars', { max: 50 })),
      email: z.string().email(t('validation.invalidEmail')),
      password: z.string().min(6, t('validation.minChars', { min: 6 })),
      passwordConfirm: z.string().min(6, t('validation.minChars', { min: 6 })),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: t('validation.passwordsMismatch'),
      path: ['passwordConfirm'],
    });
}

export type TRegisterForm = z.infer<ReturnType<typeof createRegisterSchema>>;
