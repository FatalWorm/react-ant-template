import { z } from 'zod';

import type { TTranslations } from '@/shared/i18n/i18n.types';

export function createRegisterSchema(t: TTranslations) {
  return z
    .object({
      name: z
        .string()
        .min(2, t.validation.minChars.replace('{min}', '2'))
        .max(50, t.validation.maxChars.replace('{max}', '50')),
      email: z.string().email(t.validation.invalidEmail),
      password: z.string().min(6, t.validation.minChars.replace('{min}', '6')),
      passwordConfirm: z.string().min(6, t.validation.minChars.replace('{min}', '6')),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: t.validation.passwordsMismatch,
      path: ['passwordConfirm'],
    });
}

export type TRegisterForm = z.infer<ReturnType<typeof createRegisterSchema>>;
