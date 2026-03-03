/**
 * Home Page
 * Main portfolio page with tab navigation for dual identity
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TabNavigation } from '@/components/TabNavigation'
import { ThemeSelector } from '@/components/ai-artist/ThemeSelector'
import { ImageUpload } from '@/components/ai-artist/ImageUpload'
import { MusicPlayer } from '@/components/ai-artist/MusicPlayer'
import { CursorEffects } from '@/components/ai-artist/CursorEffects'
import { useTabNavigation } from '@/hooks/useTabNavigation'
import { useTheme } from '@/hooks/useTheme'
import { useAudio } from '@/hooks/useAudio'
import { useCursorEffects } from '@/hooks/useCursorEffects'
import { TabId, UploadedImage } from '@/types'

// Lazy load section components for performance
const AIArtistSection = () => {
  const { theme, setTheme } = useTheme()
  const { audioState, frequencyData, play, pause, setVolume, loadUrl } = useAudio()
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])

  return (
    <div className="space-y-8">
      {/* Theme Selector */}
      <section className="p-6 bg-muted/30 rounded-lg backdrop-blur-sm shadow-md transition-all duration-300">
        <h2 className="text-2xl font-bold mb-4">테마 선택</h2>
        <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
      </section>

      {/* Music Player */}
      <section className="p-6 bg-muted/30 rounded-lg backdrop-blur-sm shadow-md transition-all duration-300">
        <h2 className="text-2xl font-bold mb-4">음악 플레이어</h2>
        <MusicPlayer
          audioState={audioState}
          onPlay={play}
          onPause={pause}
          onVolumeChange={setVolume}
          onUrlChange={loadUrl}
        />
      </section>

      {/* Image Upload */}
      <section className="p-6 bg-muted/30 rounded-lg backdrop-blur-sm shadow-md transition-all duration-300">
        <h2 className="text-2xl font-bold mb-4">AI 아트 갤러리</h2>
        <ImageUpload
          onUpload={setUploadedImages}
          existingImages={uploadedImages}
        />
      </section>
    </div>
  )
}

const AXExpertSection = () => {
  return (
    <div className="space-y-8">
      <section className="p-6 bg-muted/30 rounded-lg backdrop-blur-sm shadow-md transition-all duration-300">
        <h2 className="text-2xl font-bold mb-4">About</h2>
        <p className="text-muted-foreground">
          Professional AX Expert portfolio content will be displayed here.
        </p>
      </section>

      <section className="p-6 bg-muted/30 rounded-lg backdrop-blur-sm shadow-md transition-all duration-300">
        <h2 className="text-2xl font-bold mb-4">Explore AX Projects</h2>
        <p className="text-muted-foreground">
          Project showcase will be displayed here.
        </p>
      </section>

      <section className="p-6 bg-muted/30 rounded-lg backdrop-blur-sm shadow-md transition-all duration-300">
        <h2 className="text-2xl font-bold mb-4">Contact</h2>
        <p className="text-muted-foreground">
          Contact information will be displayed here.
        </p>
      </section>
    </div>
  )
}

export default function HomePage() {
  const { activeTab, setActiveTab, isTransitioning } = useTabNavigation()
  const { audioState, frequencyData } = useAudio()

  // Cursor effects setup
  const cursorEffects = useCursorEffects({
    isPlaying: audioState.playbackState === 'playing',
    frequencyData,
    effectType: 'particles'
  })

  return (
    <main
      className="min-h-screen py-8 px-4 transition-colors duration-300"
      onMouseMove={(e) => cursorEffects.handleMouseMove({ x: e.clientX, y: e.clientY, timestamp: Date.now() })}
    >
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
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

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

      {/* Cursor Effects */}
      <CursorEffects
        isActive={audioState.playbackState === 'playing'}
        frequencyData={frequencyData}
        effectType="particles"
        particles={cursorEffects.particles}
        rings={cursorEffects.rings}
        cursorScale={cursorEffects.cursorScale}
        cursorHue={cursorEffects.cursorHue}
      />
    </main>
  )
}
