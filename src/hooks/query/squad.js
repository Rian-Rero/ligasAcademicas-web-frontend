/* eslint-disable no-console */
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createSquad,
  deleteSquad,
  getSquadById,
  getSquads,
  updateSquad,
} from '../../services/api/endpoints';

export function useGetSquads({
  filters,
  enabled = true,
  queryKey = ['squads', filters],
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getSquads(filters),
    enabled,
    onSuccess,
    onError,
  });
}

export function useGetSquadById({
  _id,
  enabled = true,
  queryKey = ['squad', _id],
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getSquadById(_id),
    enabled: Boolean(_id) && enabled,
    onSuccess,
    onError,
  });
}

export function useCreateSquad({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: createSquad,
    onSuccess,
    onError,
  });
}

export function useUpdateSquad({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: updateSquad,
    onSuccess,
    onError,
  });
}

export function useDeleteSquad({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: deleteSquad,
    onSuccess,
    onError,
  });
}
