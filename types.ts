export type MediaType = 'photo' | 'video'

export type ViewId = 'home' | 'projects' | 'photo' | 'video' | 'favorites' | 'rewards' | 'premium' | 'tutorial'

export type SubscriptionPeriod = 'monthly' | 'yearly'

export interface LumiSubscription {
  plan: LumiPlan
  period: SubscriptionPeriod
  selectedAt: number
}

export type PhotoToolId = 'filters' | 'adjust' | 'crop' | 'rotate' | 'text' | 'enhance'
export type VideoToolId = 'trim' | 'speed' | 'filters' | 'adjust' | 'enhance' | 'text' | 'audio'

export interface Adjustments {
  brightness: number
  contrast: number
  saturation: number
  warmth: number
  fade: number
  blur: number
  sharpness: number
}

export type AspectId = 'original' | '1:1' | '4:5' | '16:9' | '9:16' | '3:2'

export type TextFont = 'sans' | 'serif' | 'mono'

export interface TextLayer {
  id: string
  text: string
  /** Center position as a percentage of the canvas (0–100). */
  x: number
  y: number
  /** Font size as a percentage of the canvas width. */
  size: number
  color: string
  font: TextFont
  bold: boolean
  background: boolean
}

export interface PhotoEdits {
  filterId: string
  adjustments: Adjustments
  rotation: 0 | 90 | 180 | 270
  flipH: boolean
  flipV: boolean
  aspect: AspectId
  texts: TextLayer[]
}

export interface VideoEdits {
  filterId: string
  adjustments: Adjustments
  trimStart: number
  trimEnd: number | null
  speed: number
  volume: number
  muted: boolean
  texts: TextLayer[]
}

interface BaseProject {
  id: string
  name: string
  src: string
  fileName: string
  createdAt: number
  updatedAt: number
  favorite: boolean
}

export interface PhotoProject extends BaseProject {
  type: 'photo'
  edits: PhotoEdits
}

export interface VideoProject extends BaseProject {
  type: 'video'
  edits: VideoEdits
  duration?: number
}

export type Project = PhotoProject | VideoProject
