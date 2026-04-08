import { z } from 'zod';

import { ERROR_CODES } from '../../utils/constants';

export const forgotPasswordValidationSchema = z.object({
  email: z
    .email('Insira um email no formato email@email.com')
    .trim()
    .nonempty('Favor digitar o email'),
});

const forgotPasswordErrorMessages = {
  [ERROR_CODES.BAD_REQUEST]: 'Dados inválidos',
  [ERROR_CODES.NOT_FOUND]: 'E-mail não encontrado ou não verificado',
};

const forgotPasswordDefaultErrorMessage =
  'Erro ao enviar o e-mail. Tente novamente mais tarde';

export function buildForgotPasswordErrorMessage(err) {
  const code = err?.response?.data?.httpCode ?? err?.response?.status;
  return forgotPasswordErrorMessages[code] || forgotPasswordDefaultErrorMessage;
}
