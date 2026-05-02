import { useMemo } from 'react';

import { FiCheckCircle, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { MdTaskAlt } from 'react-icons/md';

import {
  Content,
  HeaderSection,
  HeaderTitle,
  HeaderSubtitle,
  EmptyState,
  TasksContainer,
  TaskCard,
  TaskCardHeader,
  TaskCardTitle,
  TaskCardDescription,
  TaskCardMeta,
  TaskCardActions,
  CompleteButton,
  DeleteButton,
  PriorityBadge,
  StatusBadge,
  DueDateWrapper,
} from './Styles';
import { useGetTasks, useCompleteTask } from '../../../hooks/query/task';
import useAuthStore from '../../../stores/auth';
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

function isOverdue(dueDate) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return new Date(dueDate) < now;
}

function isToday(dueDate) {
  const today = new Date();
  const due = new Date(dueDate);
  return (
    today.getFullYear() === due.getFullYear() &&
    today.getMonth() === due.getMonth() &&
    today.getDate() === due.getDate()
  );
}

export default function StudentTasks() {
  const user = useAuthStore((state) => state.auth?.user);
  const userId = String(user?._id || '');

  const {
    data: tasks = [],
    isLoading: isLoadingTasks,
    refetch: refetchTasks,
  } = useGetTasks({
    filters: { assignedTo: userId, completed: false },
    enabled: Boolean(userId),
    onError: (err) => {
      const message = buildRequestErrorMessage(err, 'Erro ao carregar tarefas');
      notifyError(message);
    },
  });

  const { data: completedTasks = [], isLoading: isLoadingCompleted } =
    useGetTasks({
      filters: { assignedTo: userId, completed: true },
      enabled: Boolean(userId),
      queryKey: ['tasks-completed', userId],
      onError: (err) => {
        const message = buildRequestErrorMessage(
          err,
          'Erro ao carregar tarefas concluídas',
        );
        notifyError(message);
      },
    });

  const completeTaskMutation = useCompleteTask({
    onSuccess: () => {
      notifySuccess('Tarefa marcada como concluída!');
      refetchTasks();
    },
    onError: (err) => {
      const message = buildRequestErrorMessage(err, 'Erro ao concluir tarefa');
      notifyError(message);
    },
  });

  const sortedPendingTasks = useMemo(() => {
    return [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [tasks]);

  const sortedCompletedTasks = useMemo(() => {
    return [...completedTasks].sort(
      (a, b) => new Date(b.completedAt) - new Date(a.completedAt),
    );
  }, [completedTasks]);

  const handleCompleteTask = (taskId) => {
    completeTaskMutation.mutate(taskId);
  };

  const isLoading = isLoadingTasks || isLoadingCompleted;

  return (
    <Content>
      <HeaderSection>
        <div>
          <HeaderTitle>📋 Minhas Tarefas</HeaderTitle>
          <HeaderSubtitle>Acompanhe as tarefas delegadas a você</HeaderSubtitle>
        </div>
      </HeaderSection>

      {/* Tarefas Pendentes */}
      {!isLoading &&
      sortedPendingTasks.length === 0 &&
      sortedCompletedTasks.length === 0 ? (
        <EmptyState>
          <MdTaskAlt size={64} color="#d1d5db" />
          <h3>Nenhuma tarefa no momento</h3>
          <p>Você não tem tarefas pendentes. Ótimo trabalho! 🎉</p>
        </EmptyState>
      ) : (
        <>
          {sortedPendingTasks.length > 0 && (
            <div>
              <HeaderTitle
                style={{
                  fontSize: '18px',
                  marginTop: '24px',
                  marginBottom: '16px',
                }}
              >
                ⏳ Tarefas Pendentes ({sortedPendingTasks.length})
              </HeaderTitle>
              <TasksContainer>
                {sortedPendingTasks.map((task) => {
                  const overdue = isOverdue(task.dueDate);
                  const today = isToday(task.dueDate);

                  return (
                    <TaskCard key={task._id} overdue={overdue}>
                      <TaskCardHeader>
                        <div>
                          <TaskCardTitle>{task.title}</TaskCardTitle>
                          <TaskCardDescription>
                            {task.description}
                          </TaskCardDescription>
                        </div>
                        <PriorityBadge color={getPriorityColor(task.priority)}>
                          {getPriorityLabel(task.priority)}
                        </PriorityBadge>
                      </TaskCardHeader>

                      <TaskCardMeta>
                        <DueDateWrapper overdue={overdue}>
                          {overdue && <FiAlertCircle size={16} />}
                          📅 Prazo: {formatDate(task.dueDate)}
                          {today && ' (Hoje)'}
                          {overdue && ' (ATRASADO)'}
                        </DueDateWrapper>
                      </TaskCardMeta>

                      <TaskCardActions>
                        <CompleteButton
                          onClick={() => handleCompleteTask(task._id)}
                          disabled={completeTaskMutation.isPending}
                        >
                          <FiCheckCircle size={18} />
                          Marcar como concluída
                        </CompleteButton>
                        <DeleteButton
                          title="Apenas quem delegou pode deletar"
                          disabled
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
          {sortedCompletedTasks.length > 0 && (
            <div>
              <HeaderTitle
                style={{
                  fontSize: '18px',
                  marginTop: '32px',
                  marginBottom: '16px',
                }}
              >
                ✅ Tarefas Concluídas ({sortedCompletedTasks.length})
              </HeaderTitle>
              <TasksContainer>
                {sortedCompletedTasks.map((task) => (
                  <TaskCard key={task._id} completed>
                    <TaskCardHeader>
                      <div>
                        <TaskCardTitle>{task.title}</TaskCardTitle>
                        <TaskCardDescription>
                          {task.description}
                        </TaskCardDescription>
                      </div>
                      <StatusBadge completed>Concluída</StatusBadge>
                    </TaskCardHeader>

                    <TaskCardMeta>
                      <div>📅 Concluída em: {formatDate(task.completedAt)}</div>
                    </TaskCardMeta>
                  </TaskCard>
                ))}
              </TasksContainer>
            </div>
          )}
        </>
      )}
    </Content>
  );
}
