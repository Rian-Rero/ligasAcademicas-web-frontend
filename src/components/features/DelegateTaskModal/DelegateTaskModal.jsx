import { useDeferredValue, useMemo, useState } from 'react';

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
  SearchInput,
  SearchResultsMeta,
  SearchResultsList,
  SearchResultsEmpty,
  UserOption,
  UserOptionEmail,
  UserOptionName,
  UserOptionText,
  UserOptionAvatar,
  SelectedUserCard,
  SelectedUserLabel,
  SelectedUserValue,
  SaveButton,
  Textarea,
  Title,
  Overlay,
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
import { useGetLeagueMemberships } from '../../../hooks/query/leagueMembership';
import { useCreateTask } from '../../../hooks/query/task';
import { useGetUsers } from '../../../hooks/query/user';
import useAuthStore from '../../../stores/auth';
import { notifyError, notifySuccess } from '../../../utils/toast';

export default function DelegateTaskModal({
  isOpen,
  onClose,
  onSuccess = () => {},
}) {
  const authUser = useAuthStore((state) => state.auth?.user);
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);

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

  const { data: activeMemberships = [] } = useGetLeagueMemberships({
    filters: { user: authUser?._id, isActive: true },
    enabled: Boolean(isOpen && authUser?._id),
    queryKey: ['manager-task-active-memberships', authUser?._id],
  });

  const activeMembership = activeMemberships[0];

  const { data: leagueMemberships = [] } = useGetLeagueMemberships({
    filters: {
      academicLeague: activeMembership?.academicLeague,
      isActive: true,
    },
    enabled: Boolean(isOpen && activeMembership?.academicLeague),
    queryKey: [
      'manager-task-league-memberships',
      activeMembership?.academicLeague,
    ],
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

  const leagueUsers = useMemo(() => {
    const leagueUserIds = new Set(
      leagueMemberships
        .map((membership) => String(membership.user || ''))
        .filter(Boolean),
    );

    return users
      .filter((user) => leagueUserIds.has(String(user?._id || '')))
      .filter((user) => String(user?._id || '') !== String(authUser?._id || ''))
      .sort((left, right) => {
        const leftName = String(left?.name || '').toLocaleLowerCase('pt-BR');
        const rightName = String(right?.name || '').toLocaleLowerCase('pt-BR');

        return leftName.localeCompare(rightName, 'pt-BR');
      });
  }, [authUser?._id, leagueMemberships, users]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = deferredSearchTerm
      .trim()
      .toLocaleLowerCase('pt-BR');

    if (!normalizedSearch) return leagueUsers;

    return leagueUsers.filter((user) => {
      const haystack = `${user?.name || ''} ${user?.email || ''}`
        .toLocaleLowerCase('pt-BR')
        .trim();

      return haystack.includes(normalizedSearch);
    });
  }, [deferredSearchTerm, leagueUsers]);

  const assignedTo = watch('assignedTo');

  const selectedUser = useMemo(() => {
    return leagueUsers.find((user) => String(user._id) === String(assignedTo));
  }, [assignedTo, leagueUsers]);

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
                <Label htmlFor="assignedTo-search">Delegar para *</Label>
                <SearchInput
                  id="assignedTo-search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Pesquisar por nome ou e-mail"
                  disabled={createTaskMutation.isPending}
                />

                {selectedUser && (
                  <SelectedUserCard>
                    <SelectedUserLabel>Selecionado</SelectedUserLabel>
                    <SelectedUserValue>{selectedUser.name}</SelectedUserValue>
                    <span>{selectedUser.email}</span>
                  </SelectedUserCard>
                )}

                <input type="hidden" {...register('assignedTo')} />

                <SearchResultsMeta>
                  {filteredUsers.length} pessoa(s) encontrada(s) na sua liga
                </SearchResultsMeta>

                <SearchResultsList>
                  {filteredUsers.length === 0 ? (
                    <SearchResultsEmpty>
                      {deferredSearchTerm.trim()
                        ? 'Nenhum membro encontrado para esta busca.'
                        : 'Nenhum membro ativo encontrado na sua liga.'}
                    </SearchResultsEmpty>
                  ) : (
                    filteredUsers.map((user) => {
                      const isSelected =
                        String(user._id) === String(selectedUser?._id);

                      return (
                        <UserOption
                          key={user._id}
                          type="button"
                          $selected={isSelected}
                          onClick={() =>
                            setValue('assignedTo', user._id, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          disabled={createTaskMutation.isPending}
                        >
                          <UserOptionAvatar>
                            {String(user.name || '?')
                              .trim()
                              .charAt(0)
                              .toUpperCase()}
                          </UserOptionAvatar>
                          <UserOptionText>
                            <UserOptionName>{user.name}</UserOptionName>
                            <UserOptionEmail>{user.email}</UserOptionEmail>
                          </UserOptionText>
                        </UserOption>
                      );
                    })
                  )}
                </SearchResultsList>

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
