import { useMemo, useState } from 'react';

import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { MdTaskAlt } from 'react-icons/md';

import {
  Content,
  HeaderSection,
  HeaderTitle,
  HeaderSubtitle,
  HeaderActions,
  AddButton,
  EmptyState,
  TasksContainer,
  TaskCard,
  TaskCardHeader,
  TaskCardTitle,
  TaskCardDescription,
  TaskCardMeta,
  TaskCardActions,
  PriorityBadge,
  UserBadge,
  DueDateWrapper,
  EditButton,
  DeleteButton,
  ConfirmDialog,
  DialogOverlay,
  DialogContent,
  DialogButtons,
  DialogButton,
} from './Styles';
import { DelegateTaskModal } from '../../../components/features';
import { useGetTasks, useDeleteTask } from '../../../hooks/query/task';
import { useGetUsers } from '../../../hooks/query/user';
import { notifyError, notifySuccess } from '../../../utils/toast';

function buildRequestErrorMessage(err, fallback) {
  const responseMessage = err?.response?.data?.message;
  if (Array.isArray(responseMessage)) {
    return responseMessage.join(', ');
  }
  return responseMessage || fallback;
}

function getPriorityColor(priority) {
  switch (priority) {
    case 'HIGH':
      return '#ef4444';
    case 'MEDIUM':
      return '#f59e0b';
    case 'LOW':
      return '#10b981';
    default:
      return '#6b7280';
  }
}

function getPriorityLabel(priority) {
  switch (priority) {
    case 'HIGH':
      return 'Alta';
    case 'MEDIUM':
      return 'Média';
    case 'LOW':
      return 'Baixa';
    default:
      return priority;
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function isOverdue(dueDate, completed) {
  if (completed) return false;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return new Date(dueDate) < now;
}

export default function ManagerTasks() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const {
    data: tasks = [],
    isLoading: isLoadingTasks,
    refetch: refetchTasks,
  } = useGetTasks({
    onError: (err) => {
      const message = buildRequestErrorMessage(err, 'Erro ao carregar tarefas');
      notifyError(message);
    },
  });

  const { data: users = [] } = useGetUsers();

  const deleteTaskMutation = useDeleteTask({
    onSuccess: () => {
      notifySuccess('Tarefa removida com sucesso!');
      setTaskToDelete(null);
      refetchTasks();
    },
    onError: (err) => {
      const message = buildRequestErrorMessage(err, 'Erro ao remover tarefa');
      notifyError(message);
    },
  });

  const userMap = useMemo(() => {
    const map = {};
    users.forEach((user) => {
      map[user._id] = user;
    });
    return map;
  }, [users]);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      // Sort by completed status first (pending first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Then by due date
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }, [tasks]);

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTaskMutation.mutate(taskToDelete._id);
    }
  };

  const pendingTasks = sortedTasks.filter((t) => !t.completed);
  const completedTasks = sortedTasks.filter((t) => t.completed);

  return (
    <>
      <Content>
        <HeaderSection>
          <div>
            <HeaderTitle>📋 Gerenciar Tarefas</HeaderTitle>
            <HeaderSubtitle>
              Delegue e acompanhe as tarefas da sua equipe
            </HeaderSubtitle>
          </div>
          <HeaderActions>
            <AddButton onClick={() => setIsModalOpen(true)}>
              <FiPlus size={20} />
              Nova Tarefa
            </AddButton>
          </HeaderActions>
        </HeaderSection>

        {isLoadingTasks &&
        pendingTasks.length === 0 &&
        completedTasks.length === 0 ? (
          <EmptyState>
            <MdTaskAlt size={64} color="#d1d5db" />
            <h3>Nenhuma tarefa delegada</h3>
            <p>Comece delegando uma nova tarefa para sua equipe</p>
          </EmptyState>
        ) : (
          <>
            {/* Tarefas Pendentes */}
            {pendingTasks.length > 0 && (
              <div>
                <HeaderTitle
                  style={{
                    fontSize: '18px',
                    marginTop: '24px',
                    marginBottom: '16px',
                  }}
                >
                  ⏳ Tarefas Pendentes ({pendingTasks.length})
                </HeaderTitle>
                <TasksContainer>
                  {pendingTasks.map((task) => {
                    const assignedToUser = userMap[task.assignedTo];
                    const overdue = isOverdue(task.dueDate, task.completed);

                    return (
                      <TaskCard key={task._id} overdue={overdue}>
                        <TaskCardHeader>
                          <div>
                            <TaskCardTitle>{task.title}</TaskCardTitle>
                            <TaskCardDescription>
                              {task.description}
                            </TaskCardDescription>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              gap: '8px',
                              alignItems: 'center',
                            }}
                          >
                            <PriorityBadge
                              color={getPriorityColor(task.priority)}
                            >
                              {getPriorityLabel(task.priority)}
                            </PriorityBadge>
                          </div>
                        </TaskCardHeader>

                        <TaskCardMeta>
                          <DueDateWrapper overdue={overdue}>
                            📅 Prazo: {formatDate(task.dueDate)}
                            {overdue && ' (ATRASADO)'}
                          </DueDateWrapper>
                          {assignedToUser && (
                            <UserBadge>👤 {assignedToUser.name}</UserBadge>
                          )}
                        </TaskCardMeta>

                        <TaskCardActions>
                          <EditButton title="Editar tarefa" disabled>
                            <FiEdit2 size={18} />
                          </EditButton>
                          <DeleteButton
                            onClick={() => handleDeleteClick(task)}
                            disabled={deleteTaskMutation.isPending}
                          >
                            <FiTrash2 size={18} />
                          </DeleteButton>
                        </TaskCardActions>
                      </TaskCard>
                    );
                  })}
                </TasksContainer>
              </div>
            )}

            {/* Tarefas Concluídas */}
            {completedTasks.length > 0 && (
              <div>
                <HeaderTitle
                  style={{
                    fontSize: '18px',
                    marginTop: '32px',
                    marginBottom: '16px',
                  }}
                >
                  ✅ Tarefas Concluídas ({completedTasks.length})
                </HeaderTitle>
                <TasksContainer>
                  {completedTasks.map((task) => {
                    const assignedToUser = userMap[task.assignedTo];

                    return (
                      <TaskCard key={task._id} completed>
                        <TaskCardHeader>
                          <div>
                            <TaskCardTitle>{task.title}</TaskCardTitle>
                            <TaskCardDescription>
                              {task.description}
                            </TaskCardDescription>
                          </div>
                        </TaskCardHeader>

                        <TaskCardMeta>
                          <div>
                            📅 Concluída em: {formatDate(task.completedAt)}
                          </div>
                          {assignedToUser && (
                            <UserBadge>👤 {assignedToUser.name}</UserBadge>
                          )}
                        </TaskCardMeta>
                      </TaskCard>
                    );
                  })}
                </TasksContainer>
              </div>
            )}
          </>
        )}
      </Content>

      {/* Modal para delegar tarefa */}
      <DelegateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetchTasks}
      />

      {/* Dialog de Confirmação */}
      {taskToDelete && (
        <DialogOverlay onClick={() => setTaskToDelete(null)}>
          <ConfirmDialog onClick={(e) => e.stopPropagation()}>
            <DialogContent>
              <h2>Deletar tarefa</h2>
              <p>
                Tem certeza que deseja deletar a tarefa &quot;
                {taskToDelete.title}&quot;?
              </p>
            </DialogContent>
            <DialogButtons>
              <DialogButton
                variant="secondary"
                onClick={() => setTaskToDelete(null)}
              >
                Cancelar
              </DialogButton>
              <DialogButton
                variant="danger"
                onClick={confirmDelete}
                disabled={deleteTaskMutation.isPending}
              >
                {deleteTaskMutation.isPending ? 'Deletando...' : 'Deletar'}
              </DialogButton>
            </DialogButtons>
          </ConfirmDialog>
        </DialogOverlay>
      )}
    </>
  );
}
