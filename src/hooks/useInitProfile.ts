import { useEffect } from 'react'
import { useProfile } from '../store/useStore'
import { IMPORTED_CONTEXT } from '../data/importedContext'

export function useInitProfile() {
  const { profile, updateProfile } = useProfile()

  useEffect(() => {
    const initialized = localStorage.getItem('profile_initialized_v3')
    if (initialized) return

    updateProfile({
      name: profile.name || 'Nolan',
      age: profile.age || '34',
      skinType: profile.skinType || 'Sensitive, POTS-related autonomic sensitivity',
      skinGoals: profile.skinGoals || 'Anti-aging (11 lines, under-eye), texture, long-term skin health',
      hairType: profile.hairType || 'Styled diagonally, London Formal silhouette',
      hairGoals: profile.hairGoals || 'Clean structured flow, volume, healthy scalp',
      apiKey: profile.apiKey || '',
      importedContext: IMPORTED_CONTEXT,
    })

    localStorage.setItem('profile_initialized_v3', 'true')
  }, [])
}
