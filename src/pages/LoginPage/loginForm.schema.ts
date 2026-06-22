import { z } from 'zod';
import type { TTranslations } from '@/i18n';

export function createLoginSchema(t: TTranslations) {
  return z.object({
    email: z.email(t.validation.invalidEmail),
    password: z.string().min(6, t.validation.minChars.replace('{min}', '6')),
  });
}

export type TLoginForm = z.infer<ReturnType<typeof createLoginSchema>>;
