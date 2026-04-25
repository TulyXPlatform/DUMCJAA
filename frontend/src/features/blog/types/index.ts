export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;         // Rich text / markdown stored as HTML
  category: string;
  tags: string[];
  author: {
    name: string;
    avatarUrl?: string;
    role?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  coverImageUrl?: string;
  readTimeMinutes: number;
  isFeatured: boolean;
}

export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: { name: string; avatarUrl?: string };
  publishedAt: string;
  coverImageUrl?: string;
  readTimeMinutes: number;
  isFeatured: boolean;
}

export interface PostPagedResult {
  items: PostSummary[];
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
}

export const CATEGORIES = [
  'All',
  'Achievement',
  'Announcement',
  'Community',
  'Scholarship',
  'Research',
  'Interview',
] as const;

export type Category = typeof CATEGORIES[number];
