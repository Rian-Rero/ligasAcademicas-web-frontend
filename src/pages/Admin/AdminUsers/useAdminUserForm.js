import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const adminUserSchema = z.object({
  name: z.string().trim().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.email('E-mail invalido').trim(),
  globalRole: z.string().trim().min(1, 'Selecione o perfil global'),
  emailVerified: z.enum(['true', 'false']),
  membershipUniversity: z.string().trim().optional(),
  academicLeague: z.string().trim().optional(),
  role: z.string().trim().optional(),
  squad: z.string().trim().optional(),
  isActive: z.enum(['true', 'false']),
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

export function useAdminUserForm() {
  return useForm({
    resolver: zodResolver(adminUserSchema),
    defaultValues: adminUserDefaultValues,
  });
}
