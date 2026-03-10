export interface Profile {
  id: string
  name: string | null
  handle: string | null
  location: string | null
  bio: string | null
  avatar_url: string | null
  followers: number
  created_at: string
}

export interface GalleryRow {
  id: string
  artist_id: string
  title: string
  description: string | null
  style: string
  tags: string[]
  views: number
  likes: number
  cover_image: string | null
  featured: boolean
  created_at: string
}

export interface ArtworkRow {
  id: string
  gallery_id: string
  artist_id: string
  title: string
  medium: string | null
  year: number | null
  description: string | null
  image_url: string | null
  display_order: number
}

export type GalleryWithArtist = GalleryRow & { profiles: Profile }
export type GalleryWithAll = GalleryRow & { profiles: Profile; artworks: ArtworkRow[] }
