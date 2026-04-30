import { z } from 'zod';

import { ERROR_CODES } from '../../../utils/constants';
import { buildAdminRequestErrorMessage } from '../utils';

export const adminUserSchema = z
  .object({
    name: z.string().trim().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.email('E-mail invalido').trim(),
    globalRole: z.enum(['admin', 'manager', 'league-member'], {
      error: 'Selecione o perfil global',
    }),
    emailVerified: z.enum(['true', 'false']),
    membershipUniversity: z.string().trim().optional(),
    academicLeague: z.string().trim().optional(),
    role: z.string().trim().optional(),
    squad: z.string().trim().optional(),
    isActive: z.enum(['true', 'false']),
  })
  .superRefine((values, ctx) => {
    const hasMembershipData = Boolean(
      values.academicLeague || values.squad || values.role?.trim(),
    );

    if (!hasMembershipData) return;

    if (!values.academicLeague) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['academicLeague'],
        message: 'Selecione uma liga',
      });
    }

    if (!values.squad) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['squad'],
        message: 'Selecione uma subequipe',
      });
    }

    if (!values.role?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['role'],
        message: 'Informe o papel na liga',
      });
    }
  });

export const adminUserDefaultValues = {
  name: '',
  email: '',
  globalRole: 'league-member',
  emailVerified: 'false',
  membershipUniversity: '',
  academicLeague: '',
  role: '',
  squad: '',
  isActive: 'true',
};

const adminUserErrorMessages = {
  [ERROR_CODES.BAD_REQUEST]: 'Dados inválidos',
  [ERROR_CODES.UNAUTHORIZED]: 'Acesso não autorizado',
  [ERROR_CODES.FORBIDDEN]: 'Você não tem permissão para esta ação',
  [ERROR_CODES.NOT_FOUND]: 'Usuário não encontrado',
  [ERROR_CODES.CONFLICT]: 'Já existe um usuário com esses dados',
};

export function buildAdminUserErrorMessage(err) {
  return buildAdminRequestErrorMessage(
    err,
    'Nao foi possivel salvar o usuario',
    adminUserErrorMessages,
  );
}
