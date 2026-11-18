
import type { Adjustments, AspectId, PhotoEdits, VideoEdits } from './types'

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  warmth: 0,
  fade: 0,
  blur: 0,
  sharpness: 0,
}

export interface FilterPreset {
  id: string
  name: string
  sepia?: number
  hue?: number
  grayscale?: number
  brightness?: number
  contrast?: number
  saturation?: number
}

export const FILTER_PRESETS: FilterPreset[] = [
  { id: 'none', name: 'Original' },
  { id: 'lilac', name: 'Lila', hue: -12, saturation: 10, brightness: 4, sepia: 8 },
  { id: 'blush', name: 'Rubor', sepia: 18, hue: -20, saturation: 12, brightness: 5 },
  { id: 'dream', name: 'Sueño', brightness: 8, contrast: -12, saturation: -8 },
  { id: 'vintage', name: 'Vintage', sepia: 40, contrast: -6, brightness: 2 },
  { id: 'glow', name: 'Brillo', brightness: 12, contrast: 8, saturation: 14 },
  { id: 'cool', name: 'Fresco', hue: 18, saturation: -6, brightness: 2 },
  { id: 'mono', name: 'Mono', grayscale: 100, contrast: 10 },
  { id: 'noir', name: 'Noir', grayscale: 100, contrast: 35, brightness: -6 },
]

export const ADJUSTMENT_CONTROLS: {
  key: keyof Adjustments
  label: string
  min: number
  max: number
  unit?: string
}[] = [
  { key: 'brightness', label: 'Brillo', min: -50, max: 50 },
  { key: 'contrast', label: 'Contraste', min: -50, max: 50 },
  { key: 'saturation', label: 'Saturación', min: -100, max: 100 },
  { key: 'warmth', label: 'Calidez', min: -50, max: 50 },
  { key: 'fade', label: 'Desvanecer', min: 0, max: 60 },
  { key: 'blur', label: 'Desenfoque', min: 0, max: 10, unit: 'px' },
  { key: 'sharpness', label: 'Nitidez', min: 0, max: 100 },
]

export function buildCssFilter(filterId: string, adj: Adjustments): string {
  const preset = FILTER_PRESETS.find((f) => f.id === filterId) ?? FILTER_PRESETS[0]
  const brightness = 100 + adj.brightness + (preset.brightness ?? 0) + adj.fade * 0.25
  const contrast = 100 + adj.contrast + (preset.contrast ?? 0) - adj.fade * 0.6
  const saturation = 100 + adj.saturation + (preset.saturation ?? 0)
  const sepia = (preset.sepia ?? 0) + Math.max(0, adj.warmth) * 0.6
  const hue = (preset.hue ?? 0) + (adj.warmth < 0 ? -adj.warmth * 0.4 : -adj.warmth * 0.1)
  const parts = [
    `brightness(${brightness}%)`,
    `contrast(${Math.max(0, contrast)}%)`,
    `saturate(${Math.max(0, saturation)}%)`,
  ]
  if (sepia) parts.push(`sepia(${sepia}%)`)
  if (hue) parts.push(`hue-rotate(${hue}deg)`)
  if (preset.grayscale) parts.push(`grayscale(${preset.grayscale}%)`)
  if (adj.blur) parts.push(`blur(${adj.blur}px)`)
  return parts.join(' ')
}

export const ASPECT_OPTIONS: { id: AspectId; label: string; ratio: number | null }[] = [
  { id: 'original', label: 'Original', ratio: null },
  { id: '1:1', label: 'Cuadrado', ratio: 1 },
  { id: '4:5', label: 'Retrato 4:5', ratio: 4 / 5 },
  { id: '9:16', label: 'Historia 9:16', ratio: 9 / 16 },
  { id: '16:9', label: 'Panorámico 16:9', ratio: 16 / 9 },
  { id: '3:2', label: 'Clásico 3:2', ratio: 3 / 2 },
]

export const TEXT_COLORS = ['#ffffff', '#2d1b3d', '#b18cdb', '#f6b6cf', '#8b5cf6', '#fde68a']

export function createDefaultPhotoEdits(): PhotoEdits {
  return {
    filterId: 'none',
    adjustments: { ...DEFAULT_ADJUSTMENTS },
    rotation: 0,
    flipH: false,
    flipV: false,
    aspect: 'original',
    texts: [],
  }
}

export function createDefaultVideoEdits(): VideoEdits {
  return {
    filterId: 'none',
    adjustments: { ...DEFAULT_ADJUSTMENTS },
    trimStart: 0,
    trimEnd: null,
    speed: 1,
    volume: 1,
    muted: false,
    texts: [],
  }
}
