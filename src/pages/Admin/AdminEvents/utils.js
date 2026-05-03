import { z } from 'zod';

import { ERROR_CODES } from '../../../utils/constants';
import { buildAdminRequestErrorMessage } from '../utils';

export const adminEventSchema = z
  .object({
    academicLeague: z.string().trim().min(1, 'Selecione uma liga'),
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
      .nonempty('Informe a data e horário do evento')
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
    squad: z.string().trim().optional(),
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

export const adminEventDefaultValues = {
  academicLeague: '',
  title: '',
  description: '',
  dateTime: '',
  location: '',
  scope: 'global',
  squad: '',
};

const adminEventErrorMessages = {
  [ERROR_CODES.BAD_REQUEST]: 'Dados inválidos',
  [ERROR_CODES.UNAUTHORIZED]: 'Acesso não autorizado',
  [ERROR_CODES.FORBIDDEN]: 'Você não tem permissão para esta ação',
  [ERROR_CODES.NOT_FOUND]: 'Evento não encontrado',
  [ERROR_CODES.CONFLICT]: 'Já existe um evento com esses dados',
};

export function buildAdminEventErrorMessage(err) {
  return buildAdminRequestErrorMessage(
    err,
    'Não foi possível salvar o evento',
    adminEventErrorMessages,
  );
}
