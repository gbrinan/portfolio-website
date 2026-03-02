/**
 * Theme configuration for the portfolio website
 * Defines color palettes, typography, and animations for each theme
 */

import { ThemeConfig } from '@/types'

export const themes: Record<string, ThemeConfig> = {
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    colors: {
      background: '#0a0a0f',
      foreground: '#00ffff',
      primary: '#ff00ff',
      secondary: '#00ffff',
      accent: '#ffff00',
      muted: '#1a1a2e',
    },
    fonts: {
      sans: 'Orbitron, system-ui, sans-serif',
      display: 'Orbitron, system-ui, sans-serif',
    },
    animations: {
      enabled: true,
      intensity: 1,
    },
  },
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist',
    colors: {
      background: '#ffffff',
      foreground: '#000000',
      primary: '#000000',
      secondary: '#333333',
      accent: '#666666',
      muted: '#f5f5f5',
    },
    fonts: {
      sans: 'Inter, system-ui, sans-serif',
      display: 'Inter, system-ui, sans-serif',
    },
    animations: {
      enabled: true,
      intensity: 0.3,
    },
  },
  dreamy: {
    id: 'dreamy',
    name: 'Dreamy',
    colors: {
      background: '#fef3f2',
      foreground: '#8b5cf6',
      primary: '#a78bfa',
      secondary: '#f9a8d4',
      accent: '#c4b5fd',
      muted: '#f5f3ff',
    },
    fonts: {
      sans: 'Quicksand, system-ui, sans-serif',
      display: 'Quicksand, system-ui, sans-serif',
    },
    animations: {
      enabled: true,
      intensity: 0.7,
    },
  },
}

/**
 * Apply theme CSS variables to document root
 */
export function applyTheme(themeId: string): void {
  const theme = themes[themeId]
  if (!theme) return

  const root = document.documentElement

  // Apply colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value)
  })

  // Apply fonts
  Object.entries(theme.fonts).forEach(([key, value]) => {
    root.style.setProperty(`--font-${key}`, value)
  })

  // Apply animation intensity
  root.style.setProperty('--animation-intensity', theme.animations.intensity.toString())

  // Set data attribute for theme-specific CSS
  root.setAttribute('data-theme', themeId)
}

/**
 * Get theme by ID
 */
export function getTheme(themeId: string): ThemeConfig | undefined {
  return themes[themeId]
}

/**
 * Get all available themes
 */
export function getAllThemes(): ThemeConfig[] {
  return Object.values(themes)
}
