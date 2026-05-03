/* eslint-disable no-console */
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createLeagueMembership,
  deleteLeagueMembership,
  getLeagueMembershipById,
  getLeagueMemberships,
  updateLeagueMembership,
  getInactiveLeagueMemberships,
  endLeagueMembership,
} from '../../services/api/endpoints';

export function useGetLeagueMemberships({
  filters,
  enabled = true,
  queryKey = ['league-memberships', filters],
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getLeagueMemberships(filters),
    enabled,
    onSuccess,
    onError,
  });
}

export function useGetInactiveLeagueMemberships({
  filters,
  enabled = true,
  queryKey = ['league-memberships-inactive', filters],
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getInactiveLeagueMemberships(filters),
    enabled,
    onSuccess,
    onError,
  });
}

export function useGetLeagueMembershipById({
  _id,
  enabled = true,
  queryKey = ['league-membership', _id],
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getLeagueMembershipById(_id),
    enabled: Boolean(_id) && enabled,
    onSuccess,
    onError,
  });
}

export function useCreateLeagueMembership({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: createLeagueMembership,
    onSuccess,
    onError,
  });
}

export function useGetLeagueMembershipsOnDemand({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: getLeagueMemberships,
    onSuccess,
    onError,
  });
}

export function useUpdateLeagueMembership({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: updateLeagueMembership,
    onSuccess,
    onError,
  });
}

export function useDeleteLeagueMembership({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: deleteLeagueMembership,
    onSuccess,
    onError,
  });
}

export function useEndLeagueMembership({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: endLeagueMembership,
    onSuccess,
    onError,
  });
}
