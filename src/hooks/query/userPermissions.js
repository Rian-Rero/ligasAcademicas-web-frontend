import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  addPermissionToUser,
  addRoleToUser,
  getUserPermissions,
  removePermissionFromUser,
  removeRoleFromUser,
  updateUserPermissions,
} from '../../services/api/endpoints';

export function useGetUserPermissions({
  userId,
  academicLeague = null,
  enabled = true,
  queryKey = ['userPermissions', userId, academicLeague],
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getUserPermissions(userId, academicLeague),
    enabled: Boolean(userId) && enabled,
    onSuccess,
    onError,
  });
}

export function useUpdateUserPermissions({
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserPermissions,
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: ['userPermissions', variables.userId],
      });
      onSuccess(data, variables, context);
    },
    onError,
  });
}

export function useAddRoleToUser({
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRoleToUser,
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: ['userPermissions', variables.userId],
      });
      onSuccess(data, variables, context);
    },
    onError,
  });
}

export function useRemoveRoleFromUser({
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeRoleFromUser,
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: ['userPermissions', variables.userId],
      });
      onSuccess(data, variables, context);
    },
    onError,
  });
}

export function useAddPermissionToUser({
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addPermissionToUser,
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: ['userPermissions', variables.userId],
      });
      onSuccess(data, variables, context);
    },
    onError,
  });
}

export function useRemovePermissionFromUser({
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removePermissionFromUser,
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: ['userPermissions', variables.userId],
      });
      onSuccess(data, variables, context);
    },
    onError,
  });
}
