import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/axios';
import type { Alumnus, PagedResult, ApiResponse, AlumnusPaginationParams } from '../types';

export const useGetAlumni = (params: AlumnusPaginationParams) => {
  return useQuery({
    queryKey: ['alumni', params],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<PagedResult<Alumnus>>>('/alumni', { params });
      return data.data;
    },
    // Keep previous data while fetching new pages/filters to avoid layout shift
    placeholderData: (previousData) => previousData,
  });
};
