/* eslint-disable no-console */
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
  completeTask,
} from '../../services/api/endpoints';

export function useGetTasks({
  filters,
  enabled = true,
  queryKey = ['tasks', filters],
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getTasks(filters),
    enabled,
    onSuccess,
    onError,
  });
}

export function useGetTaskById({
  _id,
  enabled = true,
  queryKey = ['task', _id],
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getTaskById(_id),
    enabled: Boolean(_id) && enabled,
    onSuccess,
    onError,
  });
}

export function useCreateTask({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: createTask,
    onSuccess,
    onError,
  });
}

export function useUpdateTask({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: updateTask,
    onSuccess,
    onError,
  });
}

export function useCompleteTask({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: completeTask,
    onSuccess,
    onError,
  });
}

export function useDeleteTask({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: deleteTask,
    onSuccess,
    onError,
  });
}
