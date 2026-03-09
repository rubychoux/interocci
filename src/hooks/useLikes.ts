import { useState, useCallback } from 'react';

const KEY = 'interocci_likes';

function getStored(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function useLikes() {
  const [likedIds, setLikedIds] = useState<string[]>(getStored);

  const toggleLike = useCallback((id: string) => {
    setLikedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isLiked = useCallback((id: string) => likedIds.includes(id), [likedIds]);

  return { likedIds, toggleLike, isLiked };
}
