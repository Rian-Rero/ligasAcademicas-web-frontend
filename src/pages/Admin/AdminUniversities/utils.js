import { z } from 'zod';

import { ERROR_CODES } from '../../../utils/constants';
import { buildAdminRequestErrorMessage } from '../utils';

export const adminUniversitySchema = z.object({
  name: z.string().trim().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  street: z.string().trim().min(3, 'Rua deve ter pelo menos 3 caracteres'),
  number: z
    .string()
    .trim()
    .min(1, 'Número é obrigatório')
    .refine((value) => !Number.isNaN(Number(value)), 'Número inválido'),
  complement: z.string().trim().optional(),
});

export const adminUniversityDefaultValues = {
  name: '',
  street: '',
  number: '',
  complement: '',
};

const adminUniversityErrorMessages = {
  [ERROR_CODES.BAD_REQUEST]: 'Dados inválidos',
  [ERROR_CODES.UNAUTHORIZED]: 'Acesso não autorizado',
  [ERROR_CODES.FORBIDDEN]: 'Você não tem permissão para esta ação',
  [ERROR_CODES.NOT_FOUND]: 'Universidade não encontrada',
  [ERROR_CODES.CONFLICT]: 'Já existe uma universidade com esses dados',
};

export function buildAdminUniversityErrorMessage(err) {
  return buildAdminRequestErrorMessage(
    err,
    'Não foi possível salvar a universidade',
    adminUniversityErrorMessages,
  );
}
