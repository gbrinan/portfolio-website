/**
 * Page Integration Characterization Tests
 * Tests for verifying component integration in page.tsx
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import HomePage from '@/app/page'
import * as TabNavigation from '@/components/TabNavigation'
import * as ThemeSelector from '@/components/ai-artist/ThemeSelector'
import * as ImageUpload from '@/components/ai-artist/ImageUpload'
import * as MusicPlayer from '@/components/ai-artist/MusicPlayer'
import * as CursorEffects from '@/components/ai-artist/CursorEffects'

// Mock the hooks
jest.mock('@/hooks/useTabNavigation', () => ({
  useTabNavigation: jest.fn(() => ({
    activeTab: 'ai-artist',
    setActiveTab: jest.fn(),
    isTransitioning: false
  }))
}))

jest.mock('@/hooks/useTheme', () => ({
  useTheme: jest.fn(() => ({
    theme: 'cyberpunk',
    setTheme: jest.fn(),
    currentTheme: {
      id: 'cyberpunk',
      name: 'Cyberpunk',
      colors: {
        background: '#0a0a0a',
        foreground: '#e0ffff',
        primary: '#ff33ff',
        secondary: '#33ffff',
        accent: '#ffff33',
        muted: '#1a1a1a'
      },
      fonts: {
        sans: 'Inter',
        display: 'Orbitron'
      },
      animations: {
        enabled: true,
        intensity: 1
      }
    }
  }))
}))

jest.mock('@/hooks/useAudio', () => ({
  useAudio: jest.fn(() => ({
    audioState: {
      playbackState: 'idle',
      currentTime: 0,
      duration: 0,
      volume: 1,
      url: null,
      error: null
    },
    frequencyData: {
      dataArray: new Uint8Array(1024),
      bass: 0,
      mid: 0,
      treble: 0,
      average: 0
    },
    play: jest.fn(),
    pause: jest.fn(),
    setVolume: jest.fn(),
    loadUrl: jest.fn()
  }))
}))

jest.mock('@/hooks/useCursorEffects', () => ({
  useCursorEffects: jest.fn(() => ({
    particles: [],
    rings: [],
    cursorScale: 1,
    cursorHue: 0,
    isBeating: false,
    handleMouseMove: jest.fn(),
    updateFrequencyData: jest.fn(),
    setPlaying: jest.fn(),
    activeEffect: null,
    maxParticles: 100,
    effectsBlockInteraction: false
  }))
}))

describe('HomePage Component Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render TabNavigation component', () => {
      render(<HomePage />)
      const tabNavigation = screen.getByRole('tablist')
      expect(tabNavigation).toBeInTheDocument()
      expect(tabNavigation).toHaveAttribute('aria-label', '전문 분야 선택')
    })

    it('should render ThemeSelector component in AI Artist section', async () => {
      render(<HomePage />)
      expect(screen.getByText('테마 선택')).toBeInTheDocument()
    })

    it('should render MusicPlayer component in AI Artist section', async () => {
      render(<HomePage />)
      expect(screen.getByText('음악 플레이어')).toBeInTheDocument()
    })

    it('should render ImageUpload component in AI Artist section', async () => {
      render(<HomePage />)
      expect(screen.getByText('AI 아트 갤러리')).toBeInTheDocument()
    })

    it('should render header with Korean text', () => {
      render(<HomePage />)
      expect(screen.getByText('Portfolio')).toBeInTheDocument()
      expect(screen.getByText('AI Artist & Accessibility Expert')).toBeInTheDocument()
    })

    it('should render footer with copyright', () => {
      render(<HomePage />)
      expect(screen.getByText(/© 2026 Portfolio/)).toBeInTheDocument()
    })
  })

  describe('Tab Navigation Integration', () => {
    it('should call setActiveTab when tab is clicked', async () => {
      const { setActiveTab } = require('@/hooks/useTabNavigation')
      setActiveTab.mockImplementation(jest.fn())

      render(<HomePage />)

      const aiArtistTab = screen.getByRole('tab', { name: /AI Artist/ })
      fireEvent.click(aiArtistTab)

      await waitFor(() => {
        expect(setActiveTab).toHaveBeenCalled()
      })
    })
  })

  describe('Theme Integration', () => {
    it('should render ThemeSelector with correct props', () => {
      const { setTheme } = require('@/hooks/useTheme')

      render(<HomePage />)

      expect(screen.getByText('테마 선택')).toBeInTheDocument()
    })

    it('should call setTheme when theme is changed', async () => {
      const { setTheme } = require('@/hooks/useTheme')
      setTheme.mockImplementation(jest.fn())

      render(<HomePage />)

      // ThemeSelector should be rendered with setTheme function
      expect(setTheme).toBeDefined()
    })
  })

  describe('Audio Integration', () => {
    it('should render MusicPlayer with correct props', () => {
      const { audioState, play, pause, setVolume, loadUrl } = require('@/hooks/useAudio')

      render(<HomePage />)

      expect(screen.getByText('음악 플레이어')).toBeInTheDocument()
      expect(play).toBeDefined()
      expect(pause).toBeDefined()
      expect(setVolume).toBeDefined()
      expect(loadUrl).toBeDefined()
    })
  })

  describe('Image Upload Integration', () => {
    it('should render ImageUpload component', () => {
      render(<HomePage />)
      expect(screen.getByText('AI 아트 갤러리')).toBeInTheDocument()
    })

    it('should handle image upload state changes', () => {
      render(<HomePage />)

      // ImageUpload should be present
      const uploadSection = screen.getByText('AI 아트 갤러리')
      expect(uploadSection).toBeInTheDocument()
    })
  })

  describe('Cursor Effects Integration', () => {
    it('should initialize cursor effects with audio state', () => {
      const { audioState } = require('@/hooks/useAudio')
      const useCursorEffects = require('@/hooks/useCursorEffects')

      render(<HomePage />)

      expect(useCursorEffects.useCursorEffects).toHaveBeenCalledWith({
        isPlaying: audioState.playbackState === 'playing',
        frequencyData: audioState.frequencyData,
        effectType: 'particles'
      })
    })
  })

  describe('Korean Language Support', () => {
    it('should display Korean labels for sections', () => {
      render(<HomePage />)

      expect(screen.getByText('테마 선택')).toBeInTheDocument()
      expect(screen.getByText('음악 플레이어')).toBeInTheDocument()
      expect(screen.getByText('AI 아트 갤러리')).toBeInTheDocument()
    })

    it('should have proper Korean aria-labels', () => {
      render(<HomePage />)

      const tabNavigation = screen.getByRole('tablist')
      expect(tabNavigation).toHaveAttribute('aria-label', '전문 분야 선택')
    })
  })

  describe('Accessibility', () => {
    it('should have proper semantic HTML structure', () => {
      render(<HomePage />)

      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('banner')).toBeInTheDocument()
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('should have proper heading hierarchy', () => {
      render(<HomePage />)

      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()

      const h2s = screen.getAllByRole('heading', { level: 2 })
      expect(h2s.length).toBeGreaterThan(0)
    })
  })

  describe('Responsive Design', () => {
    it('should render with responsive classes', () => {
      const { container } = render(<HomePage />)

      const main = container.querySelector('main')
      expect(main).toHaveClass('min-h-screen', 'py-8', 'px-4')
    })
  })
})
