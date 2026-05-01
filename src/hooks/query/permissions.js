import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import api from '../../services/api/instance';

/**
 * Hook para buscar todas as permissões
 */
export const useGetPermissions = (filters = {}) => {
  return useQuery({
    queryKey: ['permissions', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value);
        }
      });

      const response = await api.get(`/permissions/permissions?${params}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para buscar uma permissão por ID
 */
export const useGetPermissionById = (permissionId) => {
  return useQuery({
    queryKey: ['permission', permissionId],
    queryFn: async () => {
      const response = await api.get(
        `/permissions/permissions/${permissionId}`,
      );
      return response.data;
    },
    enabled: !!permissionId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para criar uma nova permissão
 */
export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (permissionData) => {
      const response = await api.post(
        '/permissions/permissions',
        permissionData,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
};

/**
 * Hook para atualizar uma permissão
 */
export const useUpdatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ permissionId, data }) => {
      const response = await api.patch(
        `/permissions/permissions/${permissionId}`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      queryClient.invalidateQueries({
        queryKey: ['permission', variables.permissionId],
      });
    },
  });
};

/**
 * Hook para deletar uma permissão
 */
export const useDeletePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (permissionId) => {
      await api.delete(`/permissions/permissions/${permissionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
};

/**
 * Hook para buscar todos os papéis
 */
export const useGetRoles = (filters = {}) => {
  return useQuery({
    queryKey: ['roles', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value);
        }
      });

      const response = await api.get(`/permissions/roles?${params}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para buscar um papel por ID
 */
export const useGetRoleById = (roleId) => {
  return useQuery({
    queryKey: ['role', roleId],
    queryFn: async () => {
      const response = await api.get(`/permissions/roles/${roleId}`);
      return response.data;
    },
    enabled: !!roleId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para criar um novo papel
 */
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roleData) => {
      const response = await api.post('/permissions/roles', roleData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

/**
 * Hook para atualizar um papel
 */
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roleId, data }) => {
      const response = await api.patch(`/permissions/roles/${roleId}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', variables.roleId] });
    },
  });
};

/**
 * Hook para deletar um papel
 */
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roleId) => {
      await api.delete(`/permissions/roles/${roleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

/**
 * Hook para adicionar uma permissão a um papel
 */
export const useAddPermissionToRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roleId, permissionId }) => {
      const response = await api.post(
        `/permissions/roles/${roleId}/permissions`,
        {
          permissionId,
        },
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['role', variables.roleId] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

/**
 * Hook para remover uma permissão de um papel
 */
export const useRemovePermissionFromRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roleId, permissionId }) => {
      const response = await api.delete(
        `/permissions/roles/${roleId}/permissions`,
        {
          data: { permissionId },
        },
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['role', variables.roleId] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

/**
 * Hook para buscar permissões de um usuário
 */
export const useGetUserPermissions = (userId, academicLeague = null) => {
  return useQuery({
    queryKey: ['userPermissions', userId, academicLeague],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (academicLeague) {
        params.append('academicLeague', academicLeague);
      }

      const response = await api.get(
        `/permissions/users/${userId}/permissions?${params}`,
      );
      return response.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para atualizar permissões de um usuário
 */
export const useUpdateUserPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, data }) => {
      const response = await api.patch(
        `/permissions/users/${userId}/permissions`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['userPermissions', variables.userId],
      });
    },
  });
};

/**
 * Hook para adicionar um papel a um usuário
 */
export const useAddRoleToUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, roleId, academicLeague = null }) => {
      const response = await api.post(`/permissions/users/${userId}/roles`, {
        roleId,
        academicLeague,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['userPermissions', variables.userId],
      });
    },
  });
};

/**
 * Hook para remover um papel de um usuário
 */
export const useRemoveRoleFromUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, roleId, academicLeague = null }) => {
      const response = await api.delete(`/permissions/users/${userId}/roles`, {
        data: { roleId, academicLeague },
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['userPermissions', variables.userId],
      });
    },
  });
};
