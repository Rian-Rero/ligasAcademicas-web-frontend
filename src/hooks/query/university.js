/* eslint-disable no-console */
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createUniversity,
  deleteUniversity,
  getUniversities,
  getUniversityById,
  updateUniversity,
} from '../../services/api/endpoints';

export function useGetUniversities({
  filters,
  enabled = true,
  queryKey = ['universities', filters],
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getUniversities(filters),
    enabled,
    onSuccess,
    onError,
  });
}

export function useGetUniversityById({
  _id,
  enabled = true,
  queryKey = ['university', _id],
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getUniversityById(_id),
    enabled: Boolean(_id) && enabled,
    onSuccess,
    onError,
  });
}

export function useCreateUniversity({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: createUniversity,
    onSuccess,
    onError,
  });
}

export function useUpdateUniversity({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: updateUniversity,
    onSuccess,
    onError,
  });
}

export function useDeleteUniversity({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: deleteUniversity,
    onSuccess,
    onError,
  });
}
