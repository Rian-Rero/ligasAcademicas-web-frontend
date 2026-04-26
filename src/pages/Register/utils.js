import { z } from 'zod';

import { ERROR_CODES } from '../../utils/constants';

export const registerValidationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .nonempty('Favor digitar seu nome')
      .min(3, 'O nome não pode ter menos de 3 caracteres')
      .max(40, 'O nome não pode ter mais de 40 caracteres'),
    email: z
      .email('Insira um email no formato email@email.com')
      .trim()
      .nonempty('Favor digitar o email'),
    password: z
      .string()
      .nonempty('Favor digitar uma senha')
      .min(6, 'A senha não pode ter menos de 6 caracteres')
      .max(16, 'A senha não pode ter mais de 16 caracteres'),
    confirmPassword: z.string().nonempty('Favor confirmar sua senha'),
  })
  .refine((formData) => formData.password === formData.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem',
  });

const registerErrorMessages = {
  [ERROR_CODES.BAD_REQUEST]: 'Dados inválidos',
  [ERROR_CODES.FORBIDDEN]: 'Dados inválidos',
  [ERROR_CODES.CONFLICT]: 'Já existe uma conta com este e-mail',
};

const registerDefaultErrorMessage =
  'Erro ao realizar cadastro. Tente novamente mais tarde';

export function buildRegisterErrorMessage(err) {
  const code = err?.response?.data?.httpCode ?? err?.response?.status;
  return registerErrorMessages[code] || registerDefaultErrorMessage;
}
