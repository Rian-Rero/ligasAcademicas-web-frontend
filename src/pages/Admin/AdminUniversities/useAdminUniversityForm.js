import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const adminUniversitySchema = z.object({
  name: z.string().trim().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  street: z.string().trim().min(3, 'Rua deve ter pelo menos 3 caracteres'),
  number: z
    .string()
    .trim()
    .min(1, 'Numero e obrigatorio')
    .refine((value) => !Number.isNaN(Number(value)), 'Numero invalido'),
  complement: z.string().trim().optional(),
});

export const adminUniversityDefaultValues = {
  name: '',
  street: '',
  number: '',
  complement: '',
};

export function useAdminUniversityForm() {
  return useForm({
    resolver: zodResolver(adminUniversitySchema),
    defaultValues: adminUniversityDefaultValues,
  });
}
