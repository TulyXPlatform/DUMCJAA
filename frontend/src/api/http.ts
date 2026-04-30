import type { AxiosResponse } from 'axios';

/** Standard backend envelope used by DUMCJAA API. */
export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

/**
 * Unwraps API envelope payload safely.
 * Use this in all feature services to keep data access consistent.
 */
export const unwrap = <T>(response: AxiosResponse<ApiEnvelope<T>>): T => response.data.data;
