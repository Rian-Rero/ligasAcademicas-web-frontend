import { z } from 'zod';

// Schema when user is forced to change password (first login) - no current password required
export const changePasswordValidationSchemaForced = z
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

// Schema when user is changing password normally - current password required
export const changePasswordValidationSchema = z
  .object({
    currentPassword: z
      .string({ required_error: 'Senha atual é obrigatória' })
      .min(1),
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
