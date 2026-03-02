/**
 * TC-005: Music-Reactive Cursor Effects Specification Test
 * Requirement: RQ-005 - Music-Reactive Cursor Effects
 */

import { renderHook, act } from '@testing-library/react'
import { useCursorEffects } from '@/hooks/useCursorEffects'
import { FrequencyData } from '@/types'

describe('TC-005: Cursor Effects (RQ-005)', () => {
  let mockFrequencyData: FrequencyData

  beforeEach(() => {
    mockFrequencyData = {
      dataArray: new Uint8Array(1024).fill(128),
      bass: 100,
      mid: 120,
      treble: 80,
      average: 100,
    }
  })

  describe('Effect Activation', () => {
    it('should activate effects only when music is playing', () => {
      const { result } = renderHook(() =>
        useCursorEffects({ isPlaying: false, frequencyData: mockFrequencyData })
      )

      expect(result.current.activeEffect).toBeNull()

      act(() => {
        result.current.setPlaying(true)
      })

      expect(result.current.activeEffect).toBeTruthy()
    })
  })

  describe('Particle Trails Effect', () => {
    it('should spawn particles at cursor position', () => {
      const { result } = renderHook(() =>
        useCursorEffects({
          isPlaying: true,
          frequencyData: mockFrequencyData,
          effectType: 'particles',
        })
      )

      act(() => {
        result.current.handleMouseMove({ x: 100, y: 200, timestamp: Date.now() })
      })

      expect(result.current.particles.length).toBeGreaterThan(0)
      expect(result.current.particles[0].x).toBe(100)
      expect(result.current.particles[0].y).toBe(200)
    })

    it('should adjust particle speed based on audio frequency', () => {
      const highFreqData = { ...mockFrequencyData, treble: 200 }
      const lowFreqData = { ...mockFrequencyData, treble: 50 }

      const { result: highFreq } = renderHook(() =>
        useCursorEffects({
          isPlaying: true,
          frequencyData: highFreqData,
          effectType: 'particles',
        })
      )

      const { result: lowFreq } = renderHook(() =>
        useCursorEffects({
          isPlaying: true,
          frequencyData: lowFreqData,
          effectType: 'particles',
        })
      )

      act(() => {
        highFreq.current.handleMouseMove({ x: 100, y: 200, timestamp: Date.now() })
        lowFreq.current.handleMouseMove({ x: 100, y: 200, timestamp: Date.now() })
      })

      // High frequency creates faster particles
      expect(highFreq.current.particles[0].speed).toBeGreaterThan(
        lowFreq.current.particles[0].speed
      )
    })

    it('should fade trail over 500ms', async () => {
      jest.useFakeTimers()

      const { result } = renderHook(() =>
        useCursorEffects({
          isPlaying: true,
          frequencyData: mockFrequencyData,
          effectType: 'particles',
        })
      )

      act(() => {
        result.current.handleMouseMove({ x: 100, y: 200, timestamp: Date.now() })
      })

      const initialOpacity = result.current.particles[0].opacity

      act(() => {
        jest.advanceTimersByTime(500)
      })

      expect(result.current.particles[0].opacity).toBeLessThan(initialOpacity)

      jest.useRealTimers()
    })
  })

  describe('Waveform Rings Effect', () => {
    it('should create concentric rings from cursor', () => {
      const { result } = renderHook(() =>
        useCursorEffects({
          isPlaying: true,
          frequencyData: mockFrequencyData,
          effectType: 'waveform',
        })
      )

      act(() => {
        result.current.handleMouseMove({ x: 100, y: 200, timestamp: Date.now() })
      })

      expect(result.current.rings.length).toBeGreaterThan(0)
    })

    it('should modulate ring size by audio amplitude', () => {
      const highAmpData = { ...mockFrequencyData, average: 200 }
      const lowAmpData = { ...mockFrequencyData, average: 50 }

      const { result: highAmp } = renderHook(() =>
        useCursorEffects({
          isPlaying: true,
          frequencyData: highAmpData,
          effectType: 'waveform',
        })
      )

      const { result: lowAmp } = renderHook(() =>
        useCursorEffects({
          isPlaying: true,
          frequencyData: lowAmpData,
          effectType: 'waveform',
        })
      )

      act(() => {
        highAmp.current.handleMouseMove({ x: 100, y: 200, timestamp: Date.now() })
        lowAmp.current.handleMouseMove({ x: 100, y: 200, timestamp: Date.now() })
      })

      // High amplitude creates larger rings
      expect(highAmp.current.rings[0].size).toBeGreaterThan(lowAmp.current.rings[0].size)
    })

    it('should shift ring color based on frequency bands', () => {
      const bassData = { ...mockFrequencyData, bass: 200, mid: 50, treble: 50 }
      const trebleData = { ...mockFrequencyData, bass: 50, mid: 50, treble: 200 }

      const { result: bassFreq } = renderHook(() =>
        useCursorEffects({
          isPlaying: true,
          frequencyData: bassData,
          effectType: 'waveform',
        })
      )

      const { result: trebleFreq } = renderHook(() =>
        useCursorEffects({
          isPlaying: true,
          frequencyData: trebleData,
          effectType: 'waveform',
        })
      )

      act(() => {
        bassFreq.current.handleMouseMove({ x: 100, y: 200, timestamp: Date.now() })
        trebleFreq.current.handleMouseMove({ x: 100, y: 200, timestamp: Date.now() })
      })

      // Bass triggers warm colors, treble triggers cool colors
      expect(bassFreq.current.rings[0].color).not.toBe(trebleFreq.current.rings[0].color)
    })
  })

  describe('Beat-Reactive Pulsing Effect', () => {
    it('should detect beats via low-frequency amplitude analysis', () => {
      const beatData = { ...mockFrequencyData, bass: 250 }
      const noBeatData = { ...mockFrequencyData, bass: 50 }

      const { result: beat } = renderHook(() =>
        useCursorEffects({
          isPlaying: true,
          frequencyData: beatData,
          effectType: 'pulsing',
        })
      )

      const { result: noBeat } = renderHook(() =>
        useCursorEffects({
          isPlaying: true,
          frequencyData: noBeatData,
          effectType: 'pulsing',
        })
      )

      act(() => {
        beat.current.updateFrequencyData(beatData)
        noBeat.current.updateFrequencyData(noBeatData)
      })

      expect(beat.current.isBeating).toBe(true)
      expect(noBeat.current.isBeating).toBe(false)
    })

    it('should pulse cursor size with beat strength', () => {
      const strongBeatData = { ...mockFrequencyData, bass: 255 }
      const weakBeatData = { ...mockFrequencyData, bass: 150 }

      const { result: strongBeat } = renderHook(() =>
        useCursorEffects({
          isPlaying: true,
          frequencyData: strongBeatData,
          effectType: 'pulsing',
        })
      )

      const { result: weakBeat } = renderHook(() =>
        useCursorEffects({
          isPlaying: true,
          frequencyData: weakBeatData,
          effectType: 'pulsing',
        })
      )

      act(() => {
        strongBeat.current.updateFrequencyData(strongBeatData)
        weakBeat.current.updateFrequencyData(weakBeatData)
      })

      expect(strongBeat.current.cursorScale).toBeGreaterThan(weakBeat.current.cursorScale)
    })

    it('should complete scaling animation within 100ms', async () => {
      jest.useFakeTimers()

      const { result } = renderHook(() =>
        useCursorEffects({
          isPlaying: true,
          frequencyData: { ...mockFrequencyData, bass: 250 },
          effectType: 'pulsing',
        })
      )

      act(() => {
        result.current.updateFrequencyData({ ...mockFrequencyData, bass: 250 })
      })

      const startTime = performance.now()

      act(() => {
        jest.advanceTimersByTime(100)
      })

      const endTime = performance.now()
      expect(endTime - startTime).toBeLessThanOrEqual(100)

      jest.useRealTimers()
    })
  })

  describe('Color Shifts Effect', () => {
    it('should shift cursor color through hue spectrum', () => {
      const { result } = renderHook(() =>
        useCursorEffects({
          isPlaying: true,
          frequencyData: mockFrequencyData,
          effectType: 'colorShift',
        })
      )

      const initialHue = result.current.cursorHue

      act(() => {
        result.current.updateFrequencyData(mockFrequencyData)
      })

      expect(result.current.cursorHue).not.toBe(initialHue)
    })

    it('should control shift speed by audio energy', () => {
      const highEnergyData = { ...mockFrequencyData, average: 200 }
      const lowEnergyData = { ...mockFrequencyData, average: 50 }

      const { result: highEnergy } = renderHook(() =>
        useCursorEffects({
          isPlaying: true,
          frequencyData: highEnergyData,
          effectType: 'colorShift',
        })
      )

      const { result: lowEnergy } = renderHook(() =>
        useCursorEffects({
          isPlaying: true,
          frequencyData: lowEnergyData,
          effectType: 'colorShift',
        })
      )

      const initialHue1 = highEnergy.current.cursorHue
      const initialHue2 = lowEnergy.current.cursorHue

      act(() => {
        highEnergy.current.updateFrequencyData(highEnergyData)
        lowEnergy.current.updateFrequencyData(lowEnergyData)
      })

      // High energy causes faster hue shift
      const shift1 = Math.abs(highEnergy.current.cursorHue - initialHue1)
      const shift2 = Math.abs(lowEnergy.current.cursorHue - initialHue2)
      expect(shift1).toBeGreaterThan(shift2)
    })

    it('should trigger warm colors for bass', () => {
      const bassData = { ...mockFrequencyData, bass: 200, mid: 50, treble: 50 }

      const { result } = renderHook(() =>
        useCursorEffects({
          isPlaying: true,
          frequencyData: bassData,
          effectType: 'colorShift',
        })
      )

      act(() => {
        result.current.updateFrequencyData(bassData)
      })

      // Bass triggers warm colors (red/orange, hue 0-60)
      expect(result.current.cursorHue).toBeGreaterThanOrEqual(0)
      expect(result.current.cursorHue).toBeLessThanOrEqual(60)
    })

    it('should trigger cool colors for treble', () => {
      const trebleData = { ...mockFrequencyData, bass: 50, mid: 50, treble: 200 }

      const { result } = renderHook(() =>
        useCursorEffects({
          isPlaying: true,
          frequencyData: trebleData,
          effectType: 'colorShift',
        })
      )

      act(() => {
        result.current.updateFrequencyData(trebleData)
      })

      // Treble triggers cool colors (blue/cyan, hue 180-240)
      expect(result.current.cursorHue).toBeGreaterThanOrEqual(180)
      expect(result.current.cursorHue).toBeLessThanOrEqual(240)
    })
  })

  describe('Performance', () => {
    it('should render effects at 60fps on desktop', async () => {
      const frameTimes: number[] = []

      const { result } = renderHook(() =>
        useCursorEffects({
          isPlaying: true,
          frequencyData: mockFrequencyData,
          effectType: 'particles',
        })
      )

      for (let i = 0; i < 60; i++) {
        const start = performance.now()
        act(() => {
          result.current.handleMouseMove({ x: 100 + i, y: 200, timestamp: Date.now() })
        })
        const end = performance.now()
        frameTimes.push(end - start)
      }

      const avgFrameTime = frameTimes.reduce((a, b) => a + b) / frameTimes.length
      expect(avgFrameTime).toBeLessThan(16.67) // 60fps = 16.67ms per frame
    })

    it('should degrade gracefully to 30fps on mobile', () => {
      // Simulate mobile environment
      Object.defineProperty(window, 'innerWidth', { value: 375 })

      const { result } = renderHook(() =>
        useCursorEffects({
          isPlaying: true,
          frequencyData: mockFrequencyData,
          effectType: 'particles',
        })
      )

      // Mobile should have reduced particle count
      expect(result.current.maxParticles).toBeLessThan(100)
    })

    it('should not interfere with UI interactions', () => {
      const { result } = renderHook(() =>
        useCursorEffects({
          isPlaying: true,
          frequencyData: mockFrequencyData,
          effectType: 'particles',
        })
      )

      // Effects should not block pointer events
      expect(result.current.effectsBlockInteraction).toBe(false)
    })
  })
})
