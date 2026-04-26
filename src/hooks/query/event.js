/* eslint-disable no-console */
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createEvent,
  deleteEvent,
  getEventById,
  getEventEngagementById,
  getEvents,
  updateEvent,
} from '../../services/api/endpoints';

export function useGetEvents({
  filters,
  enabled = true,
  queryKey = ['events', filters],
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getEvents(filters),
    enabled,
    onSuccess,
    onError,
  });
}

export function useGetEventById({
  _id,
  enabled = true,
  queryKey = ['event', _id],
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getEventById(_id),
    enabled: Boolean(_id) && enabled,
    onSuccess,
    onError,
  });
}

export function useGetEventEngagementById({
  _id,
  enabled = true,
  queryKey = ['event-engagement', _id],
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useQuery({
    queryKey,
    queryFn: () => getEventEngagementById(_id),
    enabled: Boolean(_id) && enabled,
    onSuccess,
    onError,
  });
}

export function useCreateEvent({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: createEvent,
    onSuccess,
    onError,
  });
}

export function useUpdateEvent({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: updateEvent,
    onSuccess,
    onError,
  });
}

export function useDeleteEvent({
  onSuccess = () => {},
  onError = (err) => console.error(err),
} = {}) {
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess,
    onError,
  });
}
