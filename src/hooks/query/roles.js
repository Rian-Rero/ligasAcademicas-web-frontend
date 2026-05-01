import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  addPermissionToRole,
  createRole,
  deleteRole,
  getRoleById,
  getRoles,
  removePermissionFromRole,
  updateRole,
} from '../../services/api/endpoints';

export function useGetRoles({
  filters = {},
  enabled = true,
  queryKey = ['roles', filters],
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getRoles(filters),
    enabled,
    onSuccess,
    onError,
  });
}

export function useGetRoleById({
  roleId,
  enabled = true,
  queryKey = ['role', roleId],
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getRoleById(roleId),
    enabled: Boolean(roleId) && enabled,
    onSuccess,
    onError,
  });
}

export function useCreateRole({
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRole,
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({ queryKey: ['roles'] });
      onSuccess(data, variables, context);
    },
    onError,
  });
}

export function useUpdateRole({
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRole,
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({ queryKey: ['roles'] });
      await queryClient.invalidateQueries({
        queryKey: ['role', variables.roleId],
      });
      onSuccess(data, variables, context);
    },
    onError,
  });
}

export function useDeleteRole({
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRole,
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({ queryKey: ['roles'] });
      onSuccess(data, variables, context);
    },
    onError,
  });
}

export function useAddPermissionToRole({
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addPermissionToRole,
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({ queryKey: ['roles'] });
      await queryClient.invalidateQueries({
        queryKey: ['role', variables.roleId],
      });
      onSuccess(data, variables, context);
    },
    onError,
  });
}

export function useRemovePermissionFromRole({
  onSuccess = () => {},
  onError = () => {},
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removePermissionFromRole,
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({ queryKey: ['roles'] });
      await queryClient.invalidateQueries({
        queryKey: ['role', variables.roleId],
      });
      onSuccess(data, variables, context);
    },
    onError,
  });
}
