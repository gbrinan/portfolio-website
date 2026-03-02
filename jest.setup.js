import '@testing-library/jest-dom'

// Mock Web Audio API
global.AudioContext = class AudioContext {
  constructor() {
    this.state = 'suspended'
  }
  createAnalyser() {
    return {
      fftSize: 2048,
      frequencyBinCount: 1024,
      getByteFrequencyData: jest.fn(),
    }
  }
  createMediaElementSource() {
    return {}
  }
  resume() {
    return Promise.resolve()
  }
}

global.HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve())
global.HTMLMediaElement.prototype.pause = jest.fn()

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback) => setTimeout(callback, 16)
global.cancelAnimationFrame = jest.fn()
