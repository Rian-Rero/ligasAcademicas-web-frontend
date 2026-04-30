import { z } from 'zod';

import { ERROR_CODES } from '../../../utils/constants';
import { buildAdminRequestErrorMessage } from '../utils';

export const adminSquadSchema = z.object({
  university: z.string().trim().optional(),
  academicLeague: z.string().trim().min(1, 'Selecione uma liga'),
  name: z.string().trim().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z
    .string()
    .trim()
    .min(3, 'Descrição deve ter pelo menos 3 caracteres'),
  function: z.string().trim().optional(),
});

export const adminSquadDefaultValues = {
  university: '',
  academicLeague: '',
  name: '',
  description: '',
  function: '',
};

const adminSquadErrorMessages = {
  [ERROR_CODES.BAD_REQUEST]: 'Dados inválidos',
  [ERROR_CODES.UNAUTHORIZED]: 'Acesso não autorizado',
  [ERROR_CODES.FORBIDDEN]: 'Você não tem permissão para esta ação',
  [ERROR_CODES.NOT_FOUND]: 'Subequipe não encontrada',
  [ERROR_CODES.CONFLICT]: 'Já existe uma subequipe com esses dados',
};

export function buildAdminSquadErrorMessage(err) {
  return buildAdminRequestErrorMessage(
    err,
    'Nao foi possivel salvar a subequipe',
    adminSquadErrorMessages,
  );
}
