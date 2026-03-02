/**
 * Home Page
 * Main portfolio page with tab navigation for dual identity
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TabNavigation } from '@/components/TabNavigation'
import { useTabNavigation } from '@/hooks/useTabNavigation'
import { useTheme } from '@/hooks/useTheme'
import { useAudio } from '@/hooks/useAudio'
import { TabId } from '@/types'

// Lazy load section components for performance
const AIArtistSection = () => {
  const { theme, setTheme } = useTheme()
  const { audioState, frequencyData, play, pause, setVolume, loadUrl } = useAudio()

  return (
    <div className="space-y-8">
      {/* Theme Selector */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Select Theme</h2>
        <div className="flex justify-center">
          <button
            onClick={() => setTheme('cyberpunk')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
            aria-label="사이버펑크 테마 선택"
          >
            Cyberpunk
          </button>
          <button
            onClick={() => setTheme('minimalist')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded ml-2 hover:opacity-90 transition-opacity"
            aria-label="미니멀 테마 선택"
          >
            Minimalist
          </button>
          <button
            onClick={() => setTheme('dreamy')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded ml-2 hover:opacity-90 transition-opacity"
            aria-label="드리미 테마 선택"
          >
            Dreamy
          </button>
        </div>
      </section>

      {/* Music Player */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Music Player</h2>
        <div className="max-w-md mx-auto">
          <button
            onClick={play}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            aria-label="음악 재생"
          >
            Play
          </button>
          <button
            onClick={pause}
            className="px-4 py-2 bg-red-500 text-white rounded ml-2 hover:bg-red-600 transition-colors"
            aria-label="음악 일시정지"
          >
            Pause
          </button>
        </div>
      </section>

      {/* Image Upload */}
      <section>
        <h2 className="text-2xl font-bold mb-4">AI Art Gallery</h2>
        <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary transition-colors">
          <p className="text-muted-foreground">Image upload component will be here</p>
        </div>
      </section>
    </div>
  )
}

const AXExpertSection = () => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">About</h2>
        <p className="text-muted-foreground">
          Professional AX Expert portfolio content will be displayed here.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Explore AX Projects</h2>
        <p className="text-muted-foreground">
          Project showcase will be displayed here.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Contact</h2>
        <p className="text-muted-foreground">
          Contact information will be displayed here.
        </p>
      </section>
    </div>
  )
}

export default function HomePage() {
  const { activeTab, isTransitioning } = useTabNavigation()

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Portfolio
          </h1>
          <p className="text-muted-foreground text-lg">
            AI Artist & Accessibility Expert
          </p>
        </header>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={() => {}} />

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[500px]"
          >
            {activeTab === 'ai-artist' ? <AIArtistSection /> : <AXExpertSection />}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground py-8">
          <p>© 2026 Portfolio. Built with Next.js 16 and TypeScript.</p>
        </footer>
      </div>
    </main>
  )
}
