/**
 * Hook for managing tab navigation state
 */

import { useState, useEffect, useCallback } from 'react'
import { TabId } from '@/types'
import { StorageManager } from '@/lib/storage'

export function useTabNavigation() {
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    // Initialize from localStorage
    return StorageManager.getActiveTab() || 'ai-artist'
  })

  const [isTransitioning, setIsTransitioning] = useState(false)

  // Persist tab changes to localStorage
  useEffect(() => {
    StorageManager.setActiveTab(activeTab)
  }, [activeTab])

  // Handle tab change with transition animation
  const changeTab = useCallback((tab: TabId) => {
    if (tab === activeTab || isTransitioning) return

    setIsTransitioning(true)

    // Wait for transition animation (300ms)
    setTimeout(() => {
      setActiveTab(tab)
      setIsTransitioning(false)
    }, 300)
  }, [activeTab, isTransitioning])

  return {
    activeTab,
    setActiveTab: changeTab,
    isTransitioning,
  }
}
