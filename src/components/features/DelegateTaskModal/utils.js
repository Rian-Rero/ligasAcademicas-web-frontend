import { z } from 'zod';

export const taskFormDefaultValues = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'MEDIUM',
  assignedTo: '',
};

export const taskValidationSchema = z.object({
  title: z
    .string()
    .trim()
    .nonempty('Nome da tarefa é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(120, 'Nome deve ter no máximo 120 caracteres'),
  description: z
    .string()
    .trim()
    .nonempty('Descrição é obrigatória')
    .min(3, 'Descrição deve ter pelo menos 3 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  dueDate: z
    .string()
    .trim()
    .nonempty('Data de entrega é obrigatória')
    .refine(
      (value) => !Number.isNaN(new Date(value).getTime()),
      'Informe uma data válida',
    )
    .refine((value) => {
      const selectedDate = new Date(value);
      selectedDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return selectedDate >= today;
    }, 'A data de entrega não pode ser anterior a hoje'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  assignedTo: z.string().trim().nonempty('Selecione um usuário'),
});

export function buildRequestErrorMessage(err, fallback) {
  const responseMessage = err?.response?.data?.message;

  if (Array.isArray(responseMessage)) {
    return responseMessage.join(', ');
  }

  if (typeof responseMessage === 'string' && responseMessage.trim()) {
    return responseMessage;
  }

  if (typeof err?.message === 'string' && err.message.trim()) {
    return err.message;
  }

  return fallback;
}
