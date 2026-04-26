/* eslint-disable no-console */
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createAcademicLeague,
  deleteAcademicLeague,
  getAcademicLeagueById,
  getAcademicLeagues,
  updateAcademicLeague,
} from '../../services/api/endpoints';

export function useGetAcademicLeagues({
  filters,
  enabled = true,
  queryKey = ['academic-leagues', filters],
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getAcademicLeagues(filters),
    enabled,
    onSuccess,
    onError,
  });
}

export function useGetAcademicLeagueById({
  _id,
  enabled = true,
  queryKey = ['academic-league', _id],
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getAcademicLeagueById(_id),
    enabled: Boolean(_id) && enabled,
    onSuccess,
    onError,
  });
}

export function useCreateAcademicLeague({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: createAcademicLeague,
    onSuccess,
    onError,
  });
}

export function useUpdateAcademicLeague({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: updateAcademicLeague,
    onSuccess,
    onError,
  });
}

export function useDeleteAcademicLeague({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: deleteAcademicLeague,
    onSuccess,
    onError,
  });
}
