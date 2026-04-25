export interface GalleryItem {
  id: string;
  title: string;
  caption?: string;
  category: GalleryCategory;
  imageUrl: string;
  thumbUrl?: string;   // Optional lower-res thumbnail for faster initial grid load
  width: number;       // Original dimensions help CSS pre-allocate space (no layout shift)
  height: number;
  photographerName?: string;
  takenAt?: string;
}

export const GALLERY_CATEGORIES = [
  'All',
  'Reunions',
  'Convocation',
  'Sports',
  'Cultural',
  'Seminars',
  'Campus Life',
] as const;

export type GalleryCategory = typeof GALLERY_CATEGORIES[number];
