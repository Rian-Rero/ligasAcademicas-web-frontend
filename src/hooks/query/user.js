/* eslint-disable no-console */
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createUser,
  deleteUser,
  forgotPassword,
  getUserById,
  getUsers,
  redefinePassword,
  updateUser,
  verifyEmail,
} from '../../services/api/endpoints';

export function useGetUsers({
  filters,
  enabled = true,
  queryKey = ['users', filters],
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getUsers(filters),
    enabled,
    onSuccess,
    onError,
  });
}

export function useGetUserById({
  _id,
  enabled = true,
  queryKey = ['user', _id],
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getUserById(_id),
    enabled: Boolean(_id) && enabled,
    onSuccess,
    onError,
  });
}

export function useGetUsersByIds({
  userIds = [],
  enabled = true,
  queryKey = ['users-by-ids', userIds],
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const usersById = await Promise.all(
        userIds.map((userId) => getUserById(userId)),
      );
      return usersById.filter(Boolean);
    },
    enabled: userIds.length > 0 && enabled,
    onSuccess,
    onError,
  });
}

export function useForgotPassword({
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess,
    onError,
  });
}

export function useRedefinePassword({
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useMutation({
    mutationFn: redefinePassword,
    onSuccess,
    onError,
  });
}

export function useCreateUser({
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useMutation({
    mutationFn: createUser,
    onSuccess,
    onError,
  });
}

export function useVerifyUser({
  token,
  enabled = true,
  queryKey = ['verifyEmail', token],
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => verifyEmail(token),
    enabled: Boolean(token) && enabled,
    onSuccess,
    onError,
  });
}

export function useUpdateUser({
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useMutation({
    mutationFn: updateUser,
    onSuccess,
    onError,
  });
}

export function useDeleteUser({
  onSuccess = () => {},
  onError = (err) => console.log(err),
} = {}) {
  return useMutation({
    mutationFn: deleteUser,
    onSuccess,
    onError,
  });
}
