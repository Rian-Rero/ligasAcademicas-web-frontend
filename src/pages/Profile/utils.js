import { z } from 'zod';

import { ERROR_CODES } from '../../utils/constants';

export const profileValidationSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty('Favor digitar seu nome')
    .min(3, 'O nome não pode ter menos de 3 caracteres')
    .max(40, 'O nome não pode ter mais de 40 caracteres'),
});

const profileUpdateErrorMessages = {
  [ERROR_CODES.BAD_REQUEST]: 'Dados inválidos',
  [ERROR_CODES.UNAUTHORIZED]: 'Sua sessão expirou. Faça login novamente',
  [ERROR_CODES.FORBIDDEN]: 'Você não tem permissão para atualizar este perfil',
  [ERROR_CODES.NOT_FOUND]: 'Usuário não encontrado',
};

const profileUpdateDefaultErrorMessage =
  'Erro ao atualizar perfil. Tente novamente mais tarde';

export function buildProfileUpdateErrorMessage(err) {
  const code = err?.response?.data?.httpCode ?? err?.response?.status;
  return profileUpdateErrorMessages[code] || profileUpdateDefaultErrorMessage;
}
