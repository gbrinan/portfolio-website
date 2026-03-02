/**
 * Hook for managing music-reactive cursor effects
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import { CursorEffectType, CursorPosition, FrequencyData } from '@/types'
import { throttle, isMobile, prefersReducedMotion } from '@/lib/utils'

interface Particle {
  id: string
  x: number
  y: number
  opacity: number
  speed: number
  color: string
}

interface Ring {
  id: string
  x: number
  y: number
  size: number
  opacity: number
  color: string
}

interface UseCursorEffectsOptions {
  isPlaying: boolean
  frequencyData: FrequencyData
  effectType?: CursorEffectType
}

interface UseCursorEffectsReturn {
  particles: Particle[]
  rings: Ring[]
  cursorScale: number
  cursorHue: number
  isBeating: boolean
  handleMouseMove: (position: CursorPosition) => void
  updateFrequencyData: (data: FrequencyData) => void
  setPlaying: (playing: boolean) => void
  activeEffect: CursorEffectType | null
  maxParticles: number
  effectsBlockInteraction: boolean
}

export function useCursorEffects(options: UseCursorEffectsOptions): UseCursorEffectsReturn {
  const { isPlaying, frequencyData, effectType = 'particles' } = options

  const [particles, setParticles] = useState<Particle[]>([])
  const [rings, setRings] = useState<Ring[]>([])
  const [cursorScale, setCursorScale] = useState(1)
  const [cursorHue, setCursorHue] = useState(0)
  const [isBeating, setIsBeating] = useState(false)

  const maxParticles = isMobile() ? 30 : 100
  const effectsBlockInteraction = false

  // Throttled mouse move handler
  const handleMouseMoveThrottled = useCallback(
    throttle((position: CursorPosition) => {
      if (!isPlaying || prefersReducedMotion()) return

      switch (effectType) {
        case 'particles':
          addParticle(position.x, position.y, frequencyData)
          break
        case 'waveform':
          addRing(position.x, position.y, frequencyData)
          break
        case 'pulsing':
          updatePulsing(frequencyData)
          break
        case 'colorShift':
          updateColorShift(frequencyData)
          break
      }
    }, 16), // ~60fps
    [isPlaying, effectType, frequencyData]
  )

  const addParticle = useCallback((x: number, y: number, freqData: FrequencyData) => {
    const speed = 1 + (freqData.treble / 255) * 3
    const brightness = Math.floor((freqData.average / 255) * 100)

    setParticles(prev => {
      const newParticle: Particle = {
        id: `${Date.now()}-${Math.random()}`,
        x,
        y,
        opacity: 1,
        speed,
        color: `hsl(${cursorHue}, 100%, ${brightness}%)`,
      }

      const updated = [...prev, newParticle]
      return updated.slice(-maxParticles)
    })
  }, [cursorHue, maxParticles])

  const addRing = useCallback((x: number, y: number, freqData: FrequencyData) => {
    const size = 20 + (freqData.average / 255) * 100

    // Color based on frequency bands
    let color: string
    if (freqData.bass > freqData.treble) {
      color = `hsl(0, 100%, 50%)` // Red for bass
    } else {
      color = `hsl(200, 100%, 50%)` // Blue for treble
    }

    setRings(prev => {
      const newRing: Ring = {
        id: `${Date.now()}-${Math.random()}`,
        x,
        y,
        size,
        opacity: 1,
        color,
      }

      const updated = [...prev, newRing]
      return updated.slice(-20)
    })
  }, [])

  const updatePulsing = useCallback((freqData: FrequencyData) => {
    const beatThreshold = 150
    const hasBeat = freqData.bass > beatThreshold

    setIsBeating(hasBeat)

    if (hasBeat) {
      const scale = 1 + (freqData.bass / 255) * 0.5
      setCursorScale(scale)
    } else {
      setCursorScale(1)
    }
  }, [])

  const updateColorShift = useCallback((freqData: FrequencyData) => {
    const energy = freqData.average / 255
    const hueShift = energy * 10

    if (freqData.bass > 150) {
      // Warm colors for bass (red/orange)
      setCursorHue(prev => (prev + hueShift) % 60)
    } else if (freqData.treble > 150) {
      // Cool colors for treble (blue/cyan)
      setCursorHue(180 + ((180 + hueShift) % 60))
    } else {
      setCursorHue(prev => (prev + hueShift) % 360)
    }
  }, [])

  // Animation loop for particle fading
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setParticles(prev => {
        return prev
          .map(p => ({
            ...p,
            opacity: p.opacity - 0.02,
          }))
          .filter(p => p.opacity > 0)
      })

      setRings(prev => {
        return prev
          .map(r => ({
            ...r,
            opacity: r.opacity - 0.02,
            size: r.size + 2,
          }))
          .filter(r => r.opacity > 0)
      })
    }, 16)

    return () => clearInterval(interval)
  }, [isPlaying])

  const handleMouseMove = useCallback((position: CursorPosition) => {
    handleMouseMoveThrottled(position)
  }, [handleMouseMoveThrottled])

  const updateFrequencyData = useCallback((data: FrequencyData) => {
    // Handled by throttled function
  }, [])

  const setPlaying = useCallback((playing: boolean) => {
    // State managed by parent
  }, [])

  return {
    particles,
    rings,
    cursorScale,
    cursorHue,
    isBeating,
    handleMouseMove,
    updateFrequencyData,
    setPlaying,
    activeEffect: isPlaying ? effectType : null,
    maxParticles,
    effectsBlockInteraction,
  }
}
