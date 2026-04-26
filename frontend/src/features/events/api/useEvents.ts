import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/axios';
import type { Event, PagedResult, ApiResponse, EventQueryParams } from '../types';
import toast from 'react-hot-toast';
import { getHttpErrorMessage } from '../../../lib/httpError';

const EVENTS_KEY = 'events';

export const useGetEvents = (params: EventQueryParams) =>
  useQuery({
    queryKey: [EVENTS_KEY, params],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<PagedResult<Event>>>('/events', { params });
      return data.data;
    },
    placeholderData: prev => prev,
  });

export const useGetEventById = (id: string) =>
  useQuery({
    queryKey: [EVENTS_KEY, id],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Event>>(`/events/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

export const useRegisterForEvent = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post(`/events/${eventId}/register`);
      return data;
    },
    onSuccess: () => {
      toast.success('Successfully registered for the event!');
      // Invalidate both the list and the detail cache
      queryClient.invalidateQueries({ queryKey: [EVENTS_KEY] });
    },
    onError: (error: unknown) => {
      toast.error(getHttpErrorMessage(error, 'Failed to register. Please try again.'));
    },
  });
};

export const useUnregisterFromEvent = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.delete(`/events/${eventId}/register`);
      return data;
    },
    onSuccess: () => {
      toast.success('You have unregistered from this event.');
      queryClient.invalidateQueries({ queryKey: [EVENTS_KEY] });
    },
    onError: (error: unknown) => {
      toast.error(getHttpErrorMessage(error, 'Failed to unregister.'));
    },
  });
};
