import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createPermission,
  deletePermission,
  getPermissionById,
  getPermissions,
  updatePermission,
} from '../../services/api/endpoints';

export function useGetPermissions({
  filters = {},
  enabled = true,
  queryKey = ['permissions', filters],
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getPermissions(filters),
    enabled,
    onSuccess,
    onError,
  });
}

export function useGetPermissionById({
  permissionId,
  enabled = true,
  queryKey = ['permission', permissionId],
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getPermissionById(permissionId),
    enabled: Boolean(permissionId) && enabled,
    onSuccess,
    onError,
  });
}

export function useCreatePermission({
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPermission,
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({ queryKey: ['permissions'] });
      onSuccess(data, variables, context);
    },
    onError,
  });
}

export function useUpdatePermission({
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePermission,
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({ queryKey: ['permissions'] });
      await queryClient.invalidateQueries({
        queryKey: ['permission', variables.permissionId],
      });
      onSuccess(data, variables, context);
    },
    onError,
  });
}

export function useDeletePermission({
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePermission,
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({ queryKey: ['permissions'] });
      onSuccess(data, variables, context);
    },
    onError,
  });
}
