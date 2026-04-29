import { z } from 'zod';

export const changePasswordValidationSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, 'A senha deve ter no mínimo 6 caracteres')
      .max(16, 'A senha deve ter no máximo 16 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  });
