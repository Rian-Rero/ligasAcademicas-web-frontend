import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const adminSquadSchema = z.object({
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

export function useAdminSquadForm() {
  return useForm({
    resolver: zodResolver(adminSquadSchema),
    defaultValues: adminSquadDefaultValues,
  });
}
