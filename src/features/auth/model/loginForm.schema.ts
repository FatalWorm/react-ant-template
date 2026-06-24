import { z } from 'zod';

import type { TTranslations } from '@/shared/i18n/i18n.types';

export function createLoginSchema(t: TTranslations) {
  return z.object({
    email: z.email(t.validation.invalidEmail),
    password: z.string().min(6, t.validation.minChars.replace('{min}', '6')),
  });
}

export type TLoginForm = z.infer<ReturnType<typeof createLoginSchema>>;
