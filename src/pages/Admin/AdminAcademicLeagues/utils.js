import { z } from 'zod';

import { ERROR_CODES } from '../../../utils/constants';
import { buildAdminRequestErrorMessage } from '../utils';

export const adminAcademicLeagueSchema = z.object({
  university: z.string().trim().min(1, 'Selecione uma universidade'),
  name: z.string().trim().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z
    .string()
    .trim()
    .min(3, 'Descrição deve ter pelo menos 3 caracteres'),
  area: z.string().trim().optional(),
});

export const adminAcademicLeagueDefaultValues = {
  university: '',
  name: '',
  description: '',
  area: '',
};

const adminAcademicLeagueErrorMessages = {
  [ERROR_CODES.BAD_REQUEST]: 'Dados inválidos',
  [ERROR_CODES.UNAUTHORIZED]: 'Acesso não autorizado',
  [ERROR_CODES.FORBIDDEN]: 'Você não tem permissão para esta ação',
  [ERROR_CODES.NOT_FOUND]: 'Liga acadêmica não encontrada',
  [ERROR_CODES.CONFLICT]: 'Já existe uma liga acadêmica com esses dados',
};

export function buildAdminAcademicLeagueErrorMessage(err) {
  return buildAdminRequestErrorMessage(
    err,
    'Nao foi possivel salvar a liga acadêmica',
    adminAcademicLeagueErrorMessages,
  );
}
