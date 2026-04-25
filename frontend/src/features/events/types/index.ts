export interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  endDate?: string;
  location: string;
  bannerImageUrl?: string;
  maxAttendees?: number;
  currentRegistrationsCount: number;
  isFull: boolean;
  isRegistered?: boolean;
  createdAt: string;
}

export interface EventRegistration {
  eventId: string;
  registeredAt: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

export interface EventQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  upcoming?: boolean;
}
