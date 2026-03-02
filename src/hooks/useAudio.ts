/**
 * Hook for managing audio playback and analysis
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import { AudioState, FrequencyData } from '@/types'
import { AudioAnalyzer, isValidSunoUrl, extractSunoAudioId } from '@/lib/audio'

export function useAudio() {
  const [audioState, setAudioState] = useState<AudioState>({
    playbackState: 'idle',
    currentTime: 0,
    duration: 0,
    volume: 1,
    url: null,
    error: null,
  })

  const [frequencyData, setFrequencyData] = useState<FrequencyData>({
    dataArray: new Uint8Array(1024),
    bass: 0,
    mid: 0,
    treble: 0,
    average: 0,
  })

  const audioRef = useRef<HTMLAudioElement>(null)
  const analyzerRef = useRef<AudioAnalyzer | null>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio()
    audio.crossOrigin = 'anonymous'
    audioRef.current = audio

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)

      if (analyzerRef.current) {
        analyzerRef.current.dispose()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setAudioState(prev => ({
        ...prev,
        currentTime: audioRef.current!.currentTime,
      }))
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioState(prev => ({
        ...prev,
        duration: audioRef.current!.duration,
        playbackState: 'idle',
      }))
    }
  }

  const handleEnded = () => {
    setAudioState(prev => ({
      ...prev,
      playbackState: 'idle',
    }))
    stopFrequencyAnalysis()
  }

  const handleError = () => {
    setAudioState(prev => ({
      ...prev,
      playbackState: 'error',
      error: 'Failed to load audio',
    }))
  }

  // Start frequency analysis
  const startFrequencyAnalysis = useCallback(() => {
    if (!audioRef.current || !analyzerRef.current) return

    const analyze = () => {
      if (!analyzerRef.current) return

      const data = analyzerRef.current.getFrequencyData()
      setFrequencyData(data)

      animationFrameRef.current = requestAnimationFrame(analyze)
    }

    analyze()
  }, [])

  // Stop frequency analysis
  const stopFrequencyAnalysis = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  // Play audio
  const play = useCallback(async () => {
    if (!audioRef.current) return

    try {
      setAudioState(prev => ({ ...prev, playbackState: 'loading' }))

      // Initialize analyzer if not already done
      if (!analyzerRef.current && audioRef.current) {
        analyzerRef.current = new AudioAnalyzer()
        await analyzerRef.current.initialize(audioRef.current)
      }

      await audioRef.current.play()

      setAudioState(prev => ({ ...prev, playbackState: 'playing' }))
      startFrequencyAnalysis()
    } catch (error) {
      setAudioState(prev => ({
        ...prev,
        playbackState: 'error',
        error: error instanceof Error ? error.message : 'Failed to play audio',
      }))
    }
  }, [startFrequencyAnalysis])

  // Pause audio
  const pause = useCallback(() => {
    if (!audioRef.current) return

    audioRef.current.pause()
    setAudioState(prev => ({ ...prev, playbackState: 'paused' }))
    stopFrequencyAnalysis()
  }, [stopFrequencyAnalysis])

  // Set volume
  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume))
      setAudioState(prev => ({ ...prev, volume }))
    }
  }, [])

  // Load audio URL
  const loadUrl = useCallback((url: string) => {
    if (!isValidSunoUrl(url)) {
      setAudioState(prev => ({
        ...prev,
        error: 'Invalid Suno URL format',
      }))
      return
    }

    const audioId = extractSunoAudioId(url)
    if (!audioId) {
      setAudioState(prev => ({
        ...prev,
        error: 'Could not extract audio ID from URL',
      }))
      return
    }

    if (audioRef.current) {
      audioRef.current.src = url
      audioRef.current.load()

      setAudioState(prev => ({
        ...prev,
        url,
        playbackState: 'loading',
        error: null,
      }))
    }
  }, [])

  return {
    audioState,
    frequencyData,
    play,
    pause,
    setVolume,
    loadUrl,
    audioRef,
  }
}
