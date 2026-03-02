/**
 * Storage utility functions for localStorage management
 * Provides type-safe wrappers for localStorage operations
 */

import { TabId, ThemeId, CustomizationSettings } from '@/types'

const STORAGE_KEYS = {
  ACTIVE_TAB: 'portfolio-active-tab',
  THEME: 'portfolio-theme',
  CUSTOMIZATION: 'portfolio-customization',
} as const

export class StorageManager {
  /**
   * Get active tab from localStorage
   */
  static getActiveTab(): TabId | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB)
      return stored && (stored === 'ai-artist' || stored === 'ax-expert')
        ? (stored as TabId)
        : null
    } catch {
      return null
    }
  }

  /**
   * Set active tab in localStorage
   */
  static setActiveTab(tab: TabId): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tab)
    } catch (error) {
      console.error('Failed to save active tab:', error)
    }
  }

  /**
   * Get theme from localStorage
   */
  static getTheme(): ThemeId | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.THEME)
      return stored && (stored === 'cyberpunk' || stored === 'minimalist' || stored === 'dreamy')
        ? (stored as ThemeId)
        : null
    } catch {
      return null
    }
  }

  /**
   * Set theme in localStorage
   */
  static setTheme(theme: ThemeId): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme)
    } catch (error) {
      console.error('Failed to save theme:', error)
    }
  }

  /**
   * Get customization settings from localStorage
   */
  static getCustomization(): CustomizationSettings | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMIZATION)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  /**
   * Set customization settings in localStorage
   */
  static setCustomization(settings: CustomizationSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMIZATION, JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save customization settings:', error)
    }
  }

  /**
   * Clear all portfolio-related storage
   */
  static clearAll(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error('Failed to clear storage:', error)
    }
  }
}
