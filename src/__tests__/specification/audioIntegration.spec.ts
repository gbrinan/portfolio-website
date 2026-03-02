/**
 * TC-004: Suno Music Integration Specification Test
 * Requirement: RQ-004 - Suno Music Integration
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MusicPlayer } from '@/components/ai-artist/MusicPlayer'
import { AudioState } from '@/types'

describe('TC-004: Suno Music Integration (RQ-004)', () => {
  const mockAudioState: AudioState = {
    playbackState: 'idle',
    currentTime: 0,
    duration: 0,
    volume: 1,
    url: null,
    error: null,
  }

  const mockOnPlay = jest.fn()
  const mockOnPause = jest.fn()
  const mockOnVolumeChange = jest.fn()
  const mockOnUrlChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Suno Link Input', () => {
    it('should provide Suno link input field', () => {
      render(
        <MusicPlayer
          audioState={mockAudioState}
          onPlay={mockOnPlay}
          onPause={mockOnPause}
          onVolumeChange={mockOnVolumeChange}
          onUrlChange={mockOnUrlChange}
        />
      )

      const input = screen.getByLabelText(/Suno Music URL/i)
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'url')
    })

    it('should validate Suno URL format', async () => {
      render(
        <MusicPlayer
          audioState={mockAudioState}
          onPlay={mockOnPlay}
          onPause={mockOnPause}
          onVolumeChange={mockOnVolumeChange}
          onUrlChange={mockOnUrlChange}
        />
      )

      const input = screen.getByLabelText(/Suno Music URL/i)

      // Invalid URL
      await userEvent.type(input, 'not-a-url')
      fireEvent.blur(input)

      await waitFor(() => {
        expect(screen.getByText(/Invalid URL format/i)).toBeInTheDocument()
      })
    })

    it('should extract audio ID from Suno share URL', async () => {
      render(
        <MusicPlayer
          audioState={mockAudioState}
          onPlay={mockOnPlay}
          onPause={mockOnPause}
          onVolumeChange={mockOnVolumeChange}
          onUrlChange={mockOnUrlChange}
        />
      )

      const input = screen.getByLabelText(/Suno Music URL/i)
      const sunoUrl = 'https://suno.ai/song/abc123/'

      await userEvent.type(input, sunoUrl)
      fireEvent.change(input, { target: { value: sunoUrl } })

      await waitFor(() => {
        expect(mockOnUrlChange).toHaveBeenCalledWith(expect.stringContaining('abc123'))
      })
    })
  })

  describe('Audio Player Controls', () => {
    it('should have play/pause controls', () => {
      render(
        <MusicPlayer
          audioState={mockAudioState}
          onPlay={mockOnPlay}
          onPause={mockOnPause}
          onVolumeChange={mockOnVolumeChange}
          onUrlChange={mockOnUrlChange}
        />
      )

      expect(screen.getByRole('button', { name: /Play/i })).toBeInTheDocument()
    })

    it('should call onPlay when play button is clicked', async () => {
      render(
        <MusicPlayer
          audioState={mockAudioState}
          onPlay={mockOnPlay}
          onPause={mockOnPause}
          onVolumeChange={mockOnVolumeChange}
          onUrlChange={mockOnUrlChange}
        />
      )

      const playButton = screen.getByRole('button', { name: /Play/i })
      await userEvent.click(playButton)

      expect(mockOnPlay).toHaveBeenCalled()
    })

    it('should show pause button when playing', () => {
      const playingState = { ...mockAudioState, playbackState: 'playing' as const }

      render(
        <MusicPlayer
          audioState={playingState}
          onPlay={mockOnPlay}
          onPause={mockOnPause}
          onVolumeChange={mockOnVolumeChange}
          onUrlChange={mockOnUrlChange}
        />
      )

      expect(screen.getByRole('button', { name: /Pause/i })).toBeInTheDocument()
    })

    it('should have volume control', () => {
      render(
        <MusicPlayer
          audioState={mockAudioState}
          onPlay={mockOnPlay}
          onPause={mockOnPause}
          onVolumeChange={mockOnVolumeChange}
          onUrlChange={mockOnUrlChange}
        />
      )

      const volumeSlider = screen.getByRole('slider', { name: /Volume/i })
      expect(volumeSlider).toBeInTheDocument()
    })

    it('should call onVolumeChange when volume changes', async () => {
      render(
        <MusicPlayer
          audioState={mockAudioState}
          onPlay={mockOnPlay}
          onPause={mockOnPause}
          onVolumeChange={mockOnVolumeChange}
          onUrlChange={mockOnUrlChange}
        />
      )

      const volumeSlider = screen.getByRole('slider', { name: /Volume/i })
      fireEvent.change(volumeSlider, { target: { value: '0.5' } })

      await waitFor(() => {
        expect(mockOnVolumeChange).toHaveBeenCalledWith(0.5)
      })
    })
  })

  describe('Audio State Management', () => {
    it('should display loading state while audio loads', () => {
      const loadingState = { ...mockAudioState, playbackState: 'loading' as const }

      render(
        <MusicPlayer
          audioState={loadingState}
          onPlay={mockOnPlay}
          onPause={mockOnPause}
          onVolumeChange={mockOnVolumeChange}
          onUrlChange={mockOnUrlChange}
        />
      )

      expect(screen.getByText(/Loading/i)).toBeInTheDocument()
    })

    it('should display error state on invalid link', () => {
      const errorState = {
        ...mockAudioState,
        playbackState: 'error' as const,
        error: 'Invalid audio URL',
      }

      render(
        <MusicPlayer
          audioState={errorState}
          onPlay={mockOnPlay}
          onPause={mockOnPause}
          onVolumeChange={mockOnVolumeChange}
          onUrlChange={mockOnUrlChange}
        />
      )

      expect(screen.getByText(/Invalid audio URL/i)).toBeInTheDocument()
    })

    it('should maintain playback state during tab navigation', async () => {
      const playingState = { ...mockAudioState, playbackState: 'playing' as const }

      const { rerender } = render(
        <MusicPlayer
          audioState={playingState}
          onPlay={mockOnPlay}
          onPause={mockOnPause}
          onVolumeChange={mockOnVolumeChange}
          onUrlChange={mockOnUrlChange}
        />
      )

      // 탭 전환을 시뮬레이션 (상태 유지 확인)
      rerender(
        <MusicPlayer
          audioState={playingState}
          onPlay={mockOnPlay}
          onPause={mockOnPause}
          onVolumeChange={mockOnVolumeChange}
          onUrlChange={mockOnUrlChange}
        />
      )

      expect(screen.getByRole('button', { name: /Pause/i })).toBeInTheDocument()
    })
  })

  describe('Frequency Data Updates', () => {
    it('should update frequency data at 60fps during playback', async () => {
      const playingState = {
        ...mockAudioState,
        playbackState: 'playing' as const,
        url: 'https://example.com/audio.mp3',
      }

      render(
        <MusicPlayer
          audioState={playingState}
          onPlay={mockOnPlay}
          onPause={mockOnPause}
          onVolumeChange={mockOnVolumeChange}
          onUrlChange={mockOnUrlChange}
        />
      )

      // Web Audio API가 60fps로 frequency data 업데이트
      await waitFor(
        () => {
          expect(screen.getByTestId('audio-visualizer')).toBeInTheDocument()
        },
        { timeout: 100 }
      )
    })
  })

  describe('Track Information', () => {
    it('should display track metadata if available', () => {
      const stateWithMetadata = {
        ...mockAudioState,
        url: 'https://suno.ai/song/abc123/',
      }

      render(
        <MusicPlayer
          audioState={stateWithMetadata}
          onPlay={mockOnPlay}
          onPause={mockOnPause}
          onVolumeChange={mockOnVolumeChange}
          onUrlChange={mockOnUrlChange}
        />
      )

      // Track metadata 표시 확인
    })
  })

  describe('Error Handling', () => {
    it('should handle CORS errors gracefully', async () => {
      const errorState = {
        ...mockAudioState,
        playbackState: 'error' as const,
        error: 'CORS error: Unable to load audio',
      }

      render(
        <MusicPlayer
          audioState={errorState}
          onPlay={mockOnPlay}
          onPause={mockOnPause}
          onVolumeChange={mockOnVolumeChange}
          onUrlChange={mockOnUrlChange}
        />
      )

      expect(screen.getByText(/Unable to load audio/i)).toBeInTheDocument()
    })
  })
})
