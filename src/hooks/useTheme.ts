/**
 * Hook for managing theme state
 */

import { useState, useEffect, useCallback } from 'react'
import { ThemeId } from '@/types'
import { StorageManager } from '@/lib/storage'
import { applyTheme, getTheme } from '@/lib/themes'

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    return StorageManager.getTheme() || 'cyberpunk'
  })

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(theme)
    StorageManager.setTheme(theme)
  }, [theme])

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = StorageManager.getTheme()
    if (savedTheme) {
      setThemeState(savedTheme)
      applyTheme(savedTheme)
    } else {
      applyTheme(theme)
    }
  }, [])

  const setTheme = useCallback((newTheme: ThemeId) => {
    if (getTheme(newTheme)) {
      setThemeState(newTheme)
    }
  }, [])

  const currentThemeConfig = getTheme(theme)

  return {
    theme,
    setTheme,
    currentTheme: currentThemeConfig,
  }
}
