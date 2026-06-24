import { z } from 'zod';

import type { TTranslations } from '@/i18n/i18n.types';

export function createFormDemoSchema(t: TTranslations) {
  return z.object({
    name: z.string()
      .min(2, t.validation.minChars.replace('{min}', '2'))
      .max(50, t.validation.maxChars.replace('{max}', '50')),
    email: z.string().email(t.validation.invalidEmail),
    message: z.string()
      .min(10, t.validation.minChars.replace('{min}', '10'))
      .max(500, t.validation.maxChars.replace('{max}', '500')),
    priority: z.enum(['low', 'medium', 'high'], {
      message: t.validation.selectPriority,
    }),
  });
}

export type TFormDemoData = z.infer<ReturnType<typeof createFormDemoSchema>>;
