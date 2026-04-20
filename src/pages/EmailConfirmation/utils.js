import { ERROR_CODES } from '../../utils/constants';

const invalidOrExpiredLinkMessage =
  'Esse link de confirmação é inválido ou já expirou.';

const emailConfirmationErrorMessages = {
  [ERROR_CODES.BAD_REQUEST]: invalidOrExpiredLinkMessage,
  [ERROR_CODES.FORBIDDEN]: invalidOrExpiredLinkMessage,
  [ERROR_CODES.UNAUTHORIZED]: invalidOrExpiredLinkMessage,
  [ERROR_CODES.NOT_FOUND]: 'Não encontramos uma conta associada a esse link.',
};

const emailConfirmationDefaultErrorMessage =
  'Não foi possível confirmar seu e-mail agora. Solicite um novo link e tente novamente.';

export function buildEmailConfirmationErrorMessage(err) {
  const code = err?.response?.data?.httpCode ?? err?.response?.status;
  return (
    emailConfirmationErrorMessages[code] || emailConfirmationDefaultErrorMessage
  );
}
