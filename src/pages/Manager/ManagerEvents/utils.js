import { z } from 'zod';

import { ERROR_CODES } from '../../../utils/constants';

export const eventValidationSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, 'O título deve ter pelo menos 3 caracteres')
      .max(120, 'O título deve ter no maximo 120 caracteres'),
    description: z
      .string()
      .trim()
      .min(3, 'A descrição deve ter pelo menos 3 caracteres')
      .max(500, 'A descrição deve ter no maximo 500 caracteres'),
    dateTime: z
      .string()
      .trim()
      .nonempty('Informe a data e horario do evento')
      .refine(
        (value) => !Number.isNaN(new Date(value).getTime()),
        'Informe uma data valida',
      ),
    location: z
      .string()
      .trim()
      .min(2, 'O local deve ter pelo menos 2 caracteres')
      .max(180, 'O local deve ter no maximo 180 caracteres'),
    scope: z.enum(['global', 'squad']),
    squad: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.scope === 'squad' && !values.squad) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['squad'],
        message: 'Selecione a subequipe do evento',
      });
    }
  });

const eventErrorMessages = {
  [ERROR_CODES.BAD_REQUEST]: 'Dados invalidos para criar o evento',
  [ERROR_CODES.UNAUTHORIZED]: 'Sua sessao expirou. Faca login novamente',
  [ERROR_CODES.FORBIDDEN]: 'Apenas gestores podem cadastrar eventos',
  [ERROR_CODES.NOT_FOUND]: 'Liga ou subequipe nao encontrada',
  [ERROR_CODES.CONFLICT]: 'Nao foi possivel criar o evento para esta subequipe',
};

const eventDefaultErrorMessage =
  'Erro ao criar evento. Tente novamente mais tarde';

export function buildEventCreateErrorMessage(err) {
  const code = err?.response?.data?.httpCode ?? err?.response?.status;
  return eventErrorMessages[code] || eventDefaultErrorMessage;
}
