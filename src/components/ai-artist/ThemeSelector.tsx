/**
 * ThemeSelector Component
 * Allows users to select between Cyberpunk, Minimalist, and Dreamy themes
 * Requirement: RQ-002
 */

'use client'

import { motion } from 'framer-motion'
import { ThemeId } from '@/types'
import { themes } from '@/lib/themes'
import { cn } from '@/lib/utils'

interface ThemeSelectorProps {
  currentTheme: ThemeId
  onThemeChange: (theme: ThemeId) => void
  className?: string
}

export function ThemeSelector({ currentTheme, onThemeChange, className }: ThemeSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Theme selection"
      className={cn('flex flex-wrap gap-4 p-4', className)}
    >
      {Object.values(themes).map((theme) => (
        <motion.button
          key={theme.id}
          role="radio"
          aria-checked={currentTheme === theme.id}
          onClick={() => onThemeChange(theme.id as ThemeId)}
          className={cn(
            'relative group px-6 py-4 rounded-lg border-2 transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            currentTheme === theme.id
              ? 'border-primary shadow-lg scale-105'
              : 'border-muted hover:border-muted-foreground/50'
          )}
          style={{
            backgroundColor: theme.colors.muted,
            borderColor: currentTheme === theme.id ? theme.colors.primary : undefined,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {/* Theme Preview */}
          <div
            className="w-16 h-16 rounded-md mb-3 mx-auto"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
            }}
          />

          {/* Theme Name */}
          <span
            className="block text-sm font-medium text-center"
            style={{ color: theme.colors.foreground }}
          >
            {theme.name}
          </span>

          {/* Color Palette Preview */}
          <div className="flex justify-center gap-1 mt-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: theme.colors.background }}
              title="Background"
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: theme.colors.foreground }}
              title="Foreground"
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: theme.colors.primary }}
              title="Primary"
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: theme.colors.secondary }}
              title="Secondary"
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: theme.colors.accent }}
              title="Accent"
            />
          </div>

          {/* Active Indicator */}
          {currentTheme === theme.id && (
            <motion.div
              className="absolute inset-0 rounded-lg ring-2 ring-primary ring-offset-2"
              layoutId="activeTheme"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  )
}
