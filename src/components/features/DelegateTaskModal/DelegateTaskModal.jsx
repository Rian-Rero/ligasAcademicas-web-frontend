import { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

import {
  Body,
  CancelButton,
  CloseButton,
  Content,
  Footer,
  FormGroup,
  Header,
  Input,
  Label,
  SaveButton,
  Textarea,
  Title,
  Overlay,
  SelectWrapper,
  Select,
  DateInput,
  PriorityGroup,
  PriorityOption,
  ErrorMessage,
} from './Styles';
import {
  buildRequestErrorMessage,
  taskFormDefaultValues,
  taskValidationSchema,
} from './utils';
import { useCreateTask } from '../../../hooks/query/task';
import { useGetUsers } from '../../../hooks/query/user';
import { notifyError, notifySuccess } from '../../../utils/toast';

export default function DelegateTaskModal({
  isOpen,
  onClose,
  onSuccess = () => {},
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskValidationSchema),
    defaultValues: taskFormDefaultValues,
  });

  const { data: users = [] } = useGetUsers({
    enabled: isOpen,
    onError: (err) => {
      const message = buildRequestErrorMessage(
        err,
        'Erro ao carregar usuários',
      );
      notifyError(message);
    },
  });

  const filteredUsers = useMemo(() => {
    // Filter out the current user and show only students or specific roles
    return users.filter((u) => u._id); // Can add more filters here
  }, [users]);

  const createTaskMutation = useCreateTask({
    onSuccess: () => {
      notifySuccess('Tarefa delegada com sucesso!');
      reset(taskFormDefaultValues);
      onSuccess();
      onClose();
    },
    onError: (err) => {
      const message = buildRequestErrorMessage(err, 'Erro ao delegar tarefa');
      notifyError(message);
    },
  });

  const selectedPriority = watch('priority');

  const handleClose = () => {
    reset(taskFormDefaultValues);
    onClose();
  };

  const handleSave = (data) => {
    createTaskMutation.mutate(data);
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <Dialog.Portal>
        <Overlay />
        <Content>
          <Header>
            <Title>📋 Delegar Tarefa</Title>
            <Dialog.Close asChild>
              <CloseButton>
                <X size={24} />
              </CloseButton>
            </Dialog.Close>
          </Header>

          <form onSubmit={handleSubmit(handleSave)}>
            <Body>
              <FormGroup>
                <Label htmlFor="title">Nome da Tarefa *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Relatório mensal"
                  disabled={createTaskMutation.isPending}
                  {...register('title')}
                />
                {errors.title && (
                  <ErrorMessage>{errors.title.message}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva os detalhes da tarefa..."
                  rows={4}
                  disabled={createTaskMutation.isPending}
                  {...register('description')}
                />
                {errors.description && (
                  <ErrorMessage>{errors.description.message}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="assignedTo">Delegar para *</Label>
                <SelectWrapper>
                  <Select
                    id="assignedTo"
                    disabled={
                      createTaskMutation.isPending || filteredUsers.length === 0
                    }
                    {...register('assignedTo')}
                  >
                    <option value="">Selecione um usuário...</option>
                    {filteredUsers.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </Select>
                </SelectWrapper>
                {errors.assignedTo && (
                  <ErrorMessage>{errors.assignedTo.message}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="dueDate">Data de Entrega *</Label>
                <DateInput
                  id="dueDate"
                  type="date"
                  disabled={createTaskMutation.isPending}
                  min={new Date().toISOString().split('T')[0]}
                  {...register('dueDate')}
                />
                {errors.dueDate && (
                  <ErrorMessage>{errors.dueDate.message}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Prioridade</Label>
                <PriorityGroup>
                  <PriorityOption
                    type="button"
                    selected={selectedPriority === 'LOW'}
                    onClick={() =>
                      setValue('priority', 'LOW', { shouldValidate: true })
                    }
                    disabled={createTaskMutation.isPending}
                    color="#10b981"
                  >
                    🟢 Baixa
                  </PriorityOption>
                  <PriorityOption
                    type="button"
                    selected={selectedPriority === 'MEDIUM'}
                    onClick={() =>
                      setValue('priority', 'MEDIUM', { shouldValidate: true })
                    }
                    disabled={createTaskMutation.isPending}
                    color="#f59e0b"
                  >
                    🟡 Média
                  </PriorityOption>
                  <PriorityOption
                    type="button"
                    selected={selectedPriority === 'HIGH'}
                    onClick={() =>
                      setValue('priority', 'HIGH', { shouldValidate: true })
                    }
                    disabled={createTaskMutation.isPending}
                    color="#ef4444"
                  >
                    🔴 Alta
                  </PriorityOption>
                </PriorityGroup>
              </FormGroup>
            </Body>

            <Footer>
              <CancelButton
                type="button"
                onClick={handleClose}
                disabled={createTaskMutation.isPending}
              >
                Cancelar
              </CancelButton>
              <SaveButton type="submit" disabled={createTaskMutation.isPending}>
                {createTaskMutation.isPending
                  ? 'Delegando...'
                  : 'Delegar Tarefa'}
              </SaveButton>
            </Footer>
          </form>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
