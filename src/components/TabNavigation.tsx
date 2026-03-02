/**
 * TabNavigation Component
 * Provides dual identity navigation between AI Artist and AX Expert sections
 * Requirement: RQ-001
 */

'use client'

import { motion } from 'framer-motion'
import { TabId } from '@/types'
import { cn } from '@/lib/utils'

interface TabNavigationProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  className?: string
}

export function TabNavigation({ activeTab, onTabChange, className }: TabNavigationProps) {
  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'ai-artist', label: 'AI Artist', icon: '🎨' },
    { id: 'ax-expert', label: 'AX Expert', icon: '💼' },
  ]

  return (
    <nav
      role="tablist"
      aria-label="전문 분야 선택"
      className={cn(
        'flex items-center justify-center gap-2 p-2 bg-muted/50 rounded-lg backdrop-blur-sm',
        className
      )}
    >
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`${tab.id}-panel`}
          tabIndex={activeTab === tab.id ? 0 : -1}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'relative px-6 py-3 rounded-md font-medium transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            activeTab === tab.id
              ? 'text-foreground bg-primary shadow-lg'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <span className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </span>

          {activeTab === tab.id && (
            <motion.div
              className="absolute inset-0 rounded-md bg-primary/20"
              layoutId="activeTab"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </nav>
  )
}
