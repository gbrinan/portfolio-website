/**
 * CursorEffects Component
 * Renders music-reactive visual effects at cursor position
 * Requirement: RQ-005
 */

'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Particle, Ring, FrequencyData, CursorEffectType } from '@/types'
import { cn } from '@/lib/utils'

interface CursorEffectsProps {
  isActive: boolean
  frequencyData: FrequencyData
  effectType: CursorEffectType
  particles: Particle[]
  rings: Ring[]
  cursorScale: number
  cursorHue: number
  className?: string
}

export function CursorEffects({
  isActive,
  frequencyData,
  effectType,
  particles,
  rings,
  cursorScale,
  cursorHue,
  className,
}: CursorEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!isActive || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Render particles
      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()
      })

      // Render rings
      rings.forEach((ring) => {
        ctx.beginPath()
        ctx.arc(ring.x, ring.y, ring.size, 0, Math.PI * 2)
        ctx.strokeStyle = ring.color
        ctx.lineWidth = 2
        ctx.globalAlpha = ring.opacity
        ctx.stroke()
      })

      ctx.globalAlpha = 1

      animationFrameRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isActive, particles, rings])

  if (!isActive) return null

  return (
    <div
      className={cn(
        'fixed inset-0 pointer-events-none z-50',
        className
      )}
      style={{ zIndex: 9999 }}
    >
      {/* Canvas for particle and ring effects */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Cursor glow for color shift effect */}
      {effectType === 'colorShift' && (
        <div
          className="fixed w-8 h-8 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, hsla(${cursorHue}, 100%, 50%, 0.3) 0%, transparent 70%)`,
            transform: `scale(${cursorScale})`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}

      {/* Beat reactive cursor */}
      {effectType === 'pulsing' && (
        <motion.div
          className="fixed w-8 h-8 rounded-full border-2 border-primary pointer-events-none"
          animate={{
            scale: cursorScale,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          style={{
            borderColor: `hsl(${cursorHue}, 100%, 50%)`,
          }}
        />
      )}
    </div>
  )
}
