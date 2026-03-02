/**
 * Audio utility functions for Web Audio API integration
 * Handles audio analysis, frequency data extraction, and beat detection
 */

import { FrequencyData } from '@/types'

export class AudioAnalyzer {
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private source: MediaElementAudioSourceNode | null = null
  private dataArray: Uint8Array | null = null

  /**
   * Initialize audio context and analyser
   */
  async initialize(audioElement: HTMLAudioElement): Promise<void> {
    try {
      this.audioContext = new AudioContext()
      this.analyser = this.audioContext.createAnalyser()
      this.source = this.audioContext.createMediaElementSource(audioElement)

      // Configure analyser
      this.analyser.fftSize = 2048
      this.analyser.smoothingTimeConstant = 0.8

      // Connect audio graph
      this.source.connect(this.analyser)
      this.analyser.connect(this.audioContext.destination)

      // Create data array for frequency data
      const bufferLength = this.analyser.frequencyBinCount
      this.dataArray = new Uint8Array(bufferLength)

      await this.audioContext.resume()
    } catch (error) {
      console.error('Failed to initialize audio analyzer:', error)
      throw error
    }
  }

  /**
   * Get current frequency data
   */
  getFrequencyData(): FrequencyData {
    if (!this.analyser || !this.dataArray) {
      return {
        dataArray: new Uint8Array(1024) as Uint8Array<ArrayBuffer>,
        bass: 0,
        mid: 0,
        treble: 0,
        average: 0,
      }
    }

    this.analyser.getByteFrequencyData(this.dataArray as Uint8Array<ArrayBuffer>)

    // Calculate frequency bands
    const bass = this.getAverageFrequency(0, 10)
    const mid = this.getAverageFrequency(10, 100)
    const treble = this.getAverageFrequency(100, 500)
    const average = this.getAverageFrequency(0, 500)

    return {
      dataArray: this.dataArray,
      bass,
      mid,
      treble,
      average,
    }
  }

  /**
   * Get average frequency for a range
   */
  private getAverageFrequency(start: number, end: number): number {
    if (!this.dataArray) return 0

    let sum = 0
    for (let i = start; i < end && i < this.dataArray.length; i++) {
      sum += this.dataArray[i]
    }
    return sum / (end - start)
  }

  /**
   * Detect beat based on bass frequency
   */
  detectBeat(frequencyData: FrequencyData, threshold: number = 150): boolean {
    return frequencyData.bass > threshold
  }

  /**
   * Clean up audio resources
   */
  dispose(): void {
    if (this.source) {
      this.source.disconnect()
    }
    if (this.analyser) {
      this.analyser.disconnect()
    }
    if (this.audioContext) {
      this.audioContext.close()
    }

    this.audioContext = null
    this.analyser = null
    this.source = null
    this.dataArray = null
  }
}

/**
 * Extract audio ID from Suno URL
 */
export function extractSunoAudioId(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/').filter(Boolean)

    // Suno URL format: https://suno.ai/song/{id}/
    if (pathParts[0] === 'song' && pathParts[1]) {
      return pathParts[1]
    }

    return null
  } catch {
    return null
  }
}

/**
 * Validate Suno URL format
 */
export function isValidSunoUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.includes('suno.ai')
  } catch {
    return false
  }
}

/**
 * Construct audio URL from Suno audio ID
 */
export function constructAudioUrl(audioId: string): string {
  return `https://suno.ai/song/${audioId}/`
}
