# API Documentation

Portfolio Website API reference for components, hooks, and utilities.

## Table of Contents

- [Types](#types)
- [Hooks](#hooks)
- [Libraries](#libraries)
- [Components](#components)

---

## Types

All types are exported from `@/types/index.ts`

### Tab Types

#### `TabId`

Union type for tab identifiers.

```typescript
type TabId = 'ai-artist' | 'ax-expert'
```

#### `TabState`

Interface for tab navigation state.

```typescript
interface TabState {
  activeTab: TabId
  transitionProgress: number
}
```

**Properties:**
- `activeTab`: Currently active tab identifier
- `transitionProgress`: Animation progress (0-1)

### Theme Types

#### `ThemeId`

Union type for theme identifiers.

```typescript
type ThemeId = 'cyberpunk' | 'minimalist' | 'dreamy'
```

#### `ThemeConfig`

Interface for theme configuration.

```typescript
interface ThemeConfig {
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
```

**Properties:**
- `id`: Theme identifier
- `name`: Display name
- `colors`: Color palette with 6 color values
- `fonts`: Font configuration
- `animations`: Animation settings

### Image Upload Types

#### `UploadedImage`

Interface for uploaded image data.

```typescript
interface UploadedImage {
  id: string
  url: string
  name: string
  size: number
  type: string
  uploadedAt: Date
}
```

**Properties:**
- `id`: Unique identifier
- `url`: Object URL or base64 string
- `name`: Original filename
- `size`: File size in bytes
- `type`: MIME type
- `uploadedAt`: Upload timestamp

#### `ImageUploadState`

Interface for image upload state.

```typescript
interface ImageUploadState {
  images: UploadedImage[]
  isUploading: boolean
  error: string | null
}
```

### Audio Types

#### `AudioPlaybackState`

Union type for audio playback states.

```typescript
type AudioPlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error'
```

#### `AudioState`

Interface for audio player state.

```typescript
interface AudioState {
  playbackState: AudioPlaybackState
  currentTime: number
  duration: number
  volume: number
  url: string | null
  error: string | null
}
```

**Properties:**
- `playbackState`: Current playback state
- `currentTime`: Current playback position (seconds)
- `duration`: Total duration (seconds)
- `volume`: Volume level (0-1)
- `url`: Audio source URL
- `error`: Error message if failed

#### `FrequencyData`

Interface for audio frequency analysis data.

```typescript
interface FrequencyData {
  dataArray: Uint8Array
  bass: number
  mid: number
  treble: number
  average: number
}
```

**Properties:**
- `dataArray`: Raw frequency data (0-255)
- `bass`: Average bass frequency (0-255)
- `mid`: Average mid frequency (0-255)
- `treble`: Average treble frequency (0-255)
- `average`: Overall average (0-255)

### Cursor Effect Types

#### `CursorEffectType`

Union type for cursor effect types.

```typescript
type CursorEffectType = 'particles' | 'waveform' | 'pulsing' | 'colorShift'
```

#### `CursorEffect`

Interface for cursor effect configuration.

```typescript
interface CursorEffect {
  type: CursorEffectType
  enabled: boolean
  intensity: number
}
```

#### `CursorPosition`

Interface for cursor position tracking.

```typescript
interface CursorPosition {
  x: number
  y: number
  timestamp: number
}
```

### Customization Types

#### `CustomizationSettings`

Interface for customization settings.

```typescript
interface CustomizationSettings {
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
```

### Application State

#### `AppState`

Interface for global application state.

```typescript
interface AppState {
  tab: TabState
  theme: ThemeId
  images: ImageUploadState
  audio: AudioState
  cursorEffects: CursorEffect[]
  customization: CustomizationSettings
}
```

---

## Hooks

### `useTabNavigation()`

Hook for managing tab navigation state.

**Import:**
```typescript
import { useTabNavigation } from '@/hooks/useTabNavigation'
```

**Returns:**
```typescript
{
  activeTab: TabId
  setActiveTab: (tab: TabId) => void
  isTransitioning: boolean
}
```

**Behavior:**
- Initializes from localStorage or defaults to 'ai-artist'
- Persists changes to localStorage
- Handles 300ms transition animations
- Prevents duplicate tab changes during transition

### `useTheme()`

Hook for managing theme selection and application.

**Import:**
```typescript
import { useTheme } from '@/hooks/useTheme'
```

**Returns:**
```typescript
{
  theme: ThemeId
  setTheme: (theme: ThemeId) => void
  themeConfig: ThemeConfig
}
```

**Behavior:**
- Applies CSS variables for theme colors
- Persists theme preference to localStorage
- Updates document with new theme

### `useAudio()`

Hook for managing audio playback and frequency analysis.

**Import:**
```typescript
import { useAudio } from '@/hooks/useAudio'
```

**Returns:**
```typescript
{
  state: AudioState
  loadAudio: (url: string) => Promise<void>
  play: () => void
  pause: () => void
  setVolume: (volume: number) => void
  seek: (time: number) => void
  getFrequencyData: () => FrequencyData | null
}
```

**Methods:**
- `loadAudio(url)`: Load audio from URL
- `play()`: Start/resume playback
- `pause()`: Pause playback
- `setVolume(volume)`: Set volume (0-1)
- `seek(time)`: Seek to position (seconds)
- `getFrequencyData()`: Get current frequency analysis

### `useCursorEffects()`

Hook for managing music-reactive cursor effects.

**Import:**
```typescript
import { useCursorEffects } from '@/hooks/useCursorEffects'
```

**Returns:**
```typescript
{
  effects: CursorEffect[]
  toggleEffect: (type: CursorEffectType) => void
  setIntensity: (type: CursorEffectType, intensity: number) => void
  position: CursorPosition | null
}
```

**Methods:**
- `toggleEffect(type)`: Enable/disable effect
- `setIntensity(type, intensity)`: Set effect intensity (0-1)
- Updates position on mouse move

---

## Libraries

### `lib/storage.ts`

StorageManager class for type-safe localStorage operations.

#### `StorageManager.getActiveTab(): TabId | null`

Get active tab from localStorage.

**Returns:** Active tab ID or null

#### `StorageManager.setActiveTab(tab: TabId): void`

Set active tab in localStorage.

**Parameters:**
- `tab`: Tab ID to store

#### `StorageManager.getTheme(): ThemeId | null`

Get theme from localStorage.

**Returns:** Theme ID or null

#### `StorageManager.setTheme(theme: ThemeId): void`

Set theme in localStorage.

**Parameters:**
- `theme`: Theme ID to store

#### `StorageManager.getCustomization(): CustomizationSettings | null`

Get customization settings from localStorage.

**Returns:** Customization settings or null

#### `StorageManager.setCustomization(settings: CustomizationSettings): void`

Set customization settings in localStorage.

**Parameters:**
- `settings`: Customization settings to store

#### `StorageManager.clearAll(): void`

Clear all portfolio-related storage.

### `lib/themes.ts`

Theme configuration objects.

#### `THEMES: Record<ThemeId, ThemeConfig>`

Object containing all theme configurations.

**Usage:**
```typescript
import { THEMES } from '@/lib/themes'

const cyberpunkTheme = THEMES.cyberpunk
```

### `lib/audio.ts`

Audio utility functions.

#### `validateSunoUrl(url: string): boolean`

Validate Suno music URL.

**Parameters:**
- `url`: URL to validate

**Returns:** True if valid Suno URL

#### `createAudioContext(): AudioContext`

Create and configure Web Audio API context.

**Returns:** Configured AudioContext

#### `createAnalyser(context: AudioContext): AnalyserNode`

Create frequency analyzer node.

**Parameters:**
- `context`: AudioContext to use

**Returns:** Configured AnalyserNode

### `lib/utils.ts`

General utility functions.

#### `cn(...classes: (string | undefined | null | false)[]): string`

Concatenate class names with Tailwind merge.

**Parameters:**
- `...classes`: Class names to merge

**Returns:** Merged class string

#### `formatFileSize(bytes: number): string`

Format bytes to human-readable size.

**Parameters:**
- `bytes`: Size in bytes

**Returns:** Formatted string (e.g., "1.5 MB")

#### `validateImageFile(file: File): { valid: boolean; error?: string }`

Validate image file for upload.

**Parameters:**
- `file`: File to validate

**Returns:** Validation result with optional error

---

## Components

### `TabNavigation`

Dual identity tab navigation component.

**Props:**
```typescript
interface TabNavigationProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  isTransitioning?: boolean
}
```

**Usage:**
```typescript
<TabNavigation
  activeTab={activeTab}
  onTabChange={setActiveTab}
  isTransitioning={isTransitioning}
/>
```

### `ThemeSelector`

Theme selection component with preview.

**Props:**
```typescript
interface ThemeSelectorProps {
  currentTheme: ThemeId
  onThemeChange: (theme: ThemeId) => void
}
```

**Usage:**
```typescript
<ThemeSelector
  currentTheme={theme}
  onThemeChange={setTheme}
/>
```

### `ImageUpload`

Drag-and-drop image upload component.

**Props:**
```typescript
interface ImageUploadProps {
  images: UploadedImage[]
  onImagesChange: (images: UploadedImage[]) => void
  isUploading?: boolean
  maxFiles?: number
  maxSize?: number
}
```

**Usage:**
```typescript
<ImageUpload
  images={images}
  onImagesChange={setImages}
  isUploading={isUploading}
  maxFiles={10}
  maxSize={5 * 1024 * 1024}
/>
```

### `MusicPlayer`

Audio player with Suno integration.

**Props:**
```typescript
interface MusicPlayerProps {
  audioState: AudioState
  onPlay: () => void
  onPause: () => void
  onVolumeChange: (volume: number) => void
  onSeek: (time: number) => void
  onLoad: (url: string) => Promise<void>
}
```

**Usage:**
```typescript
<MusicPlayer
  audioState={audioState}
  onPlay={play}
  onPause={pause}
  onVolumeChange={setVolume}
  onSeek={seek}
  onLoad={loadAudio}
/>
```

### `CursorEffects`

Music-reactive cursor effects canvas.

**Props:**
```typescript
interface CursorEffectsProps {
  effects: CursorEffect[]
  frequencyData: FrequencyData | null
  position: CursorPosition | null
}
```

**Usage:**
```typescript
<CursorEffects
  effects={effects}
  frequencyData={frequencyData}
  position={cursorPosition}
/>
```

---

## Event Handlers

### Tab Change Events

```typescript
const handleTabChange = (tab: TabId) => {
  // Tab changed to 'ai-artist' or 'ax-expert'
  console.log('Active tab:', tab)
}
```

### Theme Change Events

```typescript
const handleThemeChange = (theme: ThemeId) => {
  // Theme changed to 'cyberpunk', 'minimalist', or 'dreamy'
  console.log('New theme:', theme)
}
```

### Image Upload Events

```typescript
const handleImagesChange = (images: UploadedImage[]) => {
  // Images array updated
  console.log('Total images:', images.length)
}
```

### Audio Player Events

```typescript
const handleAudioLoad = async (url: string) => {
  // Load audio from URL
  await loadAudio(url)
}

const handlePlay = () => {
  // Resume playback
  play()
}

const handlePause = () => {
  // Pause playback
  pause()
}
```

---

## Accessibility

All components implement WCAG 2.1 AA compliance:

- ARIA labels for complex components
- Keyboard navigation support
- Focus indicators
- Color contrast ≥ 4.5:1
- Reduced motion preference support

---

**Document Version:** 1.0.0
**Last Updated:** 2026-03-02
**SPEC Reference:** SPEC-PORTFOLIO-001
