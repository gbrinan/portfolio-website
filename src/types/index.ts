// 탭 관련 타입 (RQ-001)
export type TabId = 'ai-artist' | 'ax-expert'

export interface TabState {
  activeTab: TabId
  transitionProgress: number
}

// 테마 관련 타입 (RQ-002)
export type ThemeId = 'cyberpunk' | 'minimalist' | 'dreamy'

export interface ThemeConfig {
  id: ThemeId
  name: string
  colors: {
    background: string
    foreground: string
    primary: string
    secondary: string
    accent: string
    muted: string
  }
  fonts: {
    sans: string
    display: string
  }
  animations: {
    enabled: boolean
    intensity: number
  }
}

// 이미지 업로드 관련 타입 (RQ-003)
export interface UploadedImage {
  id: string
  url: string
  name: string
  size: number
  type: string
  uploadedAt: Date
}

export interface ImageUploadState {
  images: UploadedImage[]
  isUploading: boolean
  error: string | null
}

// 오디오 관련 타입 (RQ-004, RQ-005)
export type AudioPlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

export interface AudioState {
  playbackState: AudioPlaybackState
  currentTime: number
  duration: number
  volume: number
  url: string | null
  error: string | null
}

export interface FrequencyData {
  dataArray: Uint8Array
  bass: number
  mid: number
  treble: number
  average: number
}

// 커서 효과 관련 타입 (RQ-005)
export type CursorEffectType = 'particles' | 'waveform' | 'pulsing' | 'colorShift'

export interface CursorEffect {
  type: CursorEffectType
  enabled: boolean
  intensity: number
}

// Particle and Ring types for cursor effects
export interface Particle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
  size: number
  opacity: number
}

export interface Ring {
  id: string
  x: number
  y: number
  radius: number
  opacity: number
  color: string
  size: number
}

export interface CursorPosition {
  x: number
  y: number
  timestamp: number
}

// 커스터마이징 관련 타입 (RQ-006)
export interface CustomizationSettings {
  fontSize: {
    base: number
    scale: number
  }
  animations: {
    enabled: boolean
    intensity: number
    reducedMotion: boolean
  }
  fonts: {
    selected: string
  }
}

// 애플리케이션 전체 상태
export interface AppState {
  tab: TabState
  theme: ThemeId
  images: ImageUploadState
  audio: AudioState
  cursorEffects: CursorEffect[]
  customization: CustomizationSettings
}
