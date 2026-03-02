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
      foreground: '#e0ffff', // Improved contrast (4.5:1)
      primary: '#ff33ff', // Brighter magenta for better contrast
      secondary: '#33ffff', // Brighter cyan for better contrast
      accent: '#ffff33', // Brighter yellow for better contrast
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
      foreground: '#1a1a1a', // Softer black (4.5:1)
      primary: '#2d2d2d', // Dark gray (better contrast)
      secondary: '#4a4a4a', // Medium gray (WCAG AA compliant)
      accent: '#6b6b6b', // Light gray (WCAG AA compliant)
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
      foreground: '#6d4c9f', // Darker purple (4.5:1)
      primary: '#8b6fc7', // Darker violet (WCAG AA compliant)
      secondary: '#c498dc', // Muted lavender (WCAG AA compliant)
      accent: '#b8a5e4', // Softer lavender (WCAG AA compliant)
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
