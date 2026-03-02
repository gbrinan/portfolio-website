/**
 * MusicPlayer Component
 * Integrates Suno music with audio player and visualization
 * Requirement: RQ-004
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AudioState } from '@/types'
import { isValidSunoUrl, extractSunoAudioId } from '@/lib/audio'
import { cn } from '@/lib/utils'

interface MusicPlayerProps {
  audioState: AudioState
  onPlay: () => void
  onPause: () => void
  onVolumeChange: (volume: number) => void
  onUrlChange: (url: string) => void
  className?: string
}

export function MusicPlayer({
  audioState,
  onPlay,
  onPause,
  onVolumeChange,
  onUrlChange,
  className,
}: MusicPlayerProps) {
  const [urlInput, setUrlInput] = useState('')
  const [urlError, setUrlError] = useState<string | null>(null)

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!urlInput.trim()) {
      setUrlError('Please enter a Suno music URL')
      return
    }

    if (!isValidSunoUrl(urlInput)) {
      setUrlError('Invalid Suno URL format. Example: https://suno.ai/song/abc123/')
      return
    }

    const audioId = extractSunoAudioId(urlInput)
    if (!audioId) {
      setUrlError('Could not extract audio ID from URL')
      return
    }

    setUrlError(null)
    onUrlChange(urlInput)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn('space-y-4 p-4 bg-muted/30 rounded-lg backdrop-blur-sm', className)}>
      {/* URL Input */}
      <form onSubmit={handleUrlSubmit} className="space-y-2">
        <label htmlFor="suno-url" className="block text-sm font-medium">
          Suno Music URL
        </label>
        <div className="flex gap-2">
          <input
            id="suno-url"
            type="url"
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value)
              setUrlError(null)
            }}
            placeholder="https://suno.ai/song/abc123/"
            className={cn(
              'flex-1 px-3 py-2 rounded-md border bg-background',
              'focus:outline-none focus:ring-2 focus:ring-primary',
              urlError && 'border-destructive'
            )}
            aria-invalid={!!urlError}
            aria-describedby={urlError ? 'url-error' : undefined}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Load
          </button>
        </div>
        {urlError && (
          <p id="url-error" className="text-sm text-destructive" role="alert">
            {urlError}
          </p>
        )}
      </form>

      {/* Player Controls */}
      {audioState.url && (
        <div className="space-y-4">
          {/* Track Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-md flex items-center justify-center text-2xl">
              🎵
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">AI Generated Music</p>
              <p className="text-sm text-muted-foreground truncate">
                From Suno
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{
                  width: audioState.duration > 0
                    ? `${(audioState.currentTime / audioState.duration) * 100}%`
                    : '0%',
                }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(audioState.currentTime)}</span>
              <span>{formatTime(audioState.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={audioState.playbackState === 'playing' ? onPause : onPlay}
              disabled={audioState.playbackState === 'loading'}
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center text-xl',
                'bg-primary text-primary-foreground hover:bg-primary/90 transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              aria-label={audioState.playbackState === 'playing' ? 'Pause' : 'Play'}
            >
              {audioState.playbackState === 'loading' ? '⏳' : audioState.playbackState === 'playing' ? '⏸️' : '▶️'}
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <span className="text-sm">🔈</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={audioState.volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-muted rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${audioState.volume * 100}%, var(--muted) ${audioState.volume * 100}%, var(--muted) 100%)`,
              }}
              aria-label="Volume"
            />
            <span className="text-sm">🔊</span>
            <span className="text-xs text-muted-foreground w-8 text-right">
              {Math.round(audioState.volume * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {audioState.error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-destructive/10 text-destructive rounded-md text-sm"
          role="alert"
        >
          {audioState.error}
        </motion.div>
      )}

      {/* Audio Visualizer Placeholder */}
      {audioState.playbackState === 'playing' && (
        <div data-testid="audio-visualizer" className="h-16 flex items-end justify-center gap-1">
          {Array.from({ length: 32 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-primary rounded-t"
              animate={{
                height: [8, 32, 8],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.02,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
