import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { GalleryWithArtist, GalleryWithAll } from '../types/database'

export function useGalleries() {
  const [galleries, setGalleries] = useState<GalleryWithArtist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('galleries')
      .select('*, profiles(*)')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setGalleries((data as GalleryWithArtist[]) ?? [])
        setLoading(false)
      })
  }, [])

  return { galleries, loading, error }
}

export function useGallery(id: string) {
  const [gallery, setGallery] = useState<GalleryWithAll | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('galleries')
      .select('*, profiles(*), artworks(*)')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setGallery(data as GalleryWithAll)
        setLoading(false)
      })
  }, [id])

  return { gallery, loading, error }
}
