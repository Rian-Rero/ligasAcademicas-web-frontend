/* eslint-disable no-console */
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  confirmAttendance,
  createAttendance,
  deleteAttendance,
  getAttendanceById,
  getAttendances,
  markAttendance,
  updateAttendance,
} from '../../services/api/endpoints';

export function useGetAttendances({
  filters,
  enabled = true,
  queryKey = ['attendances', filters],
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getAttendances(filters),
    enabled,
    onSuccess,
    onError,
  });
}

export function useGetAttendanceById({
  _id,
  enabled = true,
  queryKey = ['attendance', _id],
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getAttendanceById(_id),
    enabled: Boolean(_id) && enabled,
    onSuccess,
    onError,
  });
}

export function useCreateAttendance({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: createAttendance,
    onSuccess,
    onError,
  });
}

export function useUpdateAttendance({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: updateAttendance,
    onSuccess,
    onError,
  });
}

export function useDeleteAttendance({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: deleteAttendance,
    onSuccess,
    onError,
  });
}

export function useConfirmAttendance({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: confirmAttendance,
    onSuccess,
    onError,
  });
}

export function useMarkAttendance({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: markAttendance,
    onSuccess,
    onError,
  });
}
