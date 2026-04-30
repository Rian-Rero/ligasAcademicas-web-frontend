import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const adminAcademicLeagueSchema = z.object({
  university: z.string().trim().min(1, 'Selecione uma universidade'),
  name: z.string().trim().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z
    .string()
    .trim()
    .min(3, 'Descricao deve ter pelo menos 3 caracteres'),
  area: z.string().trim().optional(),
});

export const adminAcademicLeagueDefaultValues = {
  university: '',
  name: '',
  description: '',
  area: '',
};

export function useAdminAcademicLeagueForm() {
  return useForm({
    resolver: zodResolver(adminAcademicLeagueSchema),
    defaultValues: adminAcademicLeagueDefaultValues,
  });
}
