export interface Artist {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  location: string;
  followers: number;
  verified: boolean;
}

export interface Artwork {
  id: string;
  title: string;
  artist: Artist;
  imageUrl: string;
  medium: string;
  year: number;
  dimensions?: string;
  description: string;
}

export interface Gallery {
  id: string;
  title: string;
  artist: Artist;
  coverImage: string;
  artworks: Artwork[];
  tags: string[];
  style: GalleryStyle;
  views: number;
  likes: number;
  createdAt: string;
  description: string;
  featured?: boolean;
}

export type GalleryStyle =
  | 'minimalist'
  | 'immersive'
  | 'surreal'
  | 'classical'
  | 'digital'
  | 'abstract';

export type SortOption = 'trending' | 'newest' | 'most-viewed' | 'most-liked';

export interface FilterState {
  search: string;
  style: GalleryStyle | 'all';
  sort: SortOption;
}
