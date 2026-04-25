export interface Alumnus {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  batch?: string;
  department?: string;
  currentCompany?: string;
  currentDesignation?: string;
  profileImageUrl?: string;
  linkedInUrl?: string;
  biography?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt?: string;
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

export interface AlumnusPaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDescending?: boolean;
  batch?: string;
  department?: string;
}
