
import { ASPECT_OPTIONS, buildCssFilter } from './filters'
import type { PhotoEdits, TextFont, TextLayer } from './types'

const MONO_STACK = 'ui-monospace, SFMono-Regular, Menlo, monospace'
const FONT_VARS: Record<Exclude<TextFont, 'mono'>, { cssVar: string; fallback: string }> = {
  sans: { cssVar: '--font-jakarta', fallback: 'system-ui, sans-serif' },
  serif: { cssVar: '--font-fraunces', fallback: 'Georgia, serif' },
}

export function cssFontFamily(font: TextFont) {
  if (font === 'mono') return MONO_STACK
  const { cssVar, fallback } = FONT_VARS[font]
  return `var(${cssVar}), ${fallback}`
}

function canvasFontFamily(font: TextFont) {
  if (font === 'mono') return MONO_STACK
  const { cssVar, fallback } = FONT_VARS[font]
  const resolved = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim()
  return resolved ? `${resolved}, ${fallback}` : fallback
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('No se pudo cargar la imagen'))
    img.src = src
  })
}

export function drawPhotoGeometry(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  edits: PhotoEdits,
  options: { maxSize?: number; filter?: string } = {},
) {
  const { naturalWidth: w, naturalHeight: h } = img
  const sideways = edits.rotation % 180 !== 0
  const rw = sideways ? h : w
  const rh = sideways ? w : h

  const ratio = ASPECT_OPTIONS.find((a) => a.id === edits.aspect)?.ratio ?? null
  let cw = rw
  let ch = rh

  if (ratio) {
    if (rw / rh > ratio) cw = rh * ratio
    else ch = rw / ratio
  }

  const scale = options.maxSize ? Math.min(1, options.maxSize / Math.max(cw, ch)) : 1
  canvas.width = Math.round(cw * scale)
  canvas.height = Math.round(ch * scale)

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.save()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  if (options.filter) ctx.filter = options.filter
  ctx.scale(scale, scale)
  ctx.translate(cw / 2, ch / 2)
  ctx.rotate((edits.rotation * Math.PI) / 180)
  ctx.scale(edits.flipH ? -1 : 1, edits.flipV ? -1 : 1)
  ctx.drawImage(img, -w / 2, -h / 2)
  ctx.restore()
}

export function applySharpness(canvas: HTMLCanvasElement, strength: number) {
  if (strength <= 0) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height
  const image = ctx.getImageData(0, 0, width, height)
  const source = new Uint8ClampedArray(image.data)
  const output = image.data
  const amount = (Math.min(100, strength) / 100) * 0.7

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = (y * width + x) * 4

      for (let c = 0; c < 3; c++) {
        const center = source[i + c]
        const top = source[i - width * 4 + c]
        const bottom = source[i + width * 4 + c]
        const left = source[i - 4 + c]
        const right = source[i + 4 + c]

        output[i + c] = center + amount * (
          center * 4 - top - bottom - left - right
        )
      }
    }
  }

  ctx.putImageData(image, 0, 0)
}

export function drawTextLayers(
  ctx: CanvasRenderingContext2D,
  texts: TextLayer[],
  width: number,
  height: number,
) {
  for (const layer of texts) {
    if (!layer.text.trim()) continue

    const fontSize = (layer.size / 100) * width
    ctx.save()
    ctx.font = `${layer.bold ? 700 : 500} ${fontSize}px ${canvasFontFamily(layer.font)}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const x = (layer.x / 100) * width
    const y = (layer.y / 100) * height
    const lines = layer.text.split('\n')
    const lineHeight = fontSize * 1.2
    const startY = y - ((lines.length - 1) * lineHeight) / 2

    if (layer.background) {
      const maxWidth = Math.max(...lines.map((l) => ctx.measureText(l).width))
      const padX = fontSize * 0.45
      const padY = fontSize * 0.25

      ctx.fillStyle = layer.color === '#ffffff'
        ? 'rgba(45,27,61,0.55)'
        : 'rgba(255,255,255,0.8)'

      ctx.beginPath()
      ctx.roundRect(
        x - maxWidth / 2 - padX,
        startY - lineHeight / 2 - padY,
        maxWidth + padX * 2,
        lines.length * lineHeight + padY * 2,
        fontSize * 0.35,
      )
      ctx.fill()
    } else {
      ctx.shadowColor = 'rgba(0,0,0,0.25)'
      ctx.shadowBlur = fontSize * 0.15
    }

    ctx.fillStyle = layer.color
    lines.forEach((line, i) => ctx.fillText(line, x, startY + i * lineHeight))
    ctx.restore()
  }
}

export async function exportPhoto(src: string, edits: PhotoEdits): Promise<Blob> {
  const img = await loadImage(src)
  const canvas = document.createElement('canvas')

  drawPhotoGeometry(canvas, img, edits, {
    maxSize: 4096,
    filter: buildCssFilter(edits.filterId, edits.adjustments),
  })

  applySharpness(canvas, edits.adjustments.sharpness)

  const ctx = canvas.getContext('2d')
  if (ctx) drawTextLayers(ctx, edits.texts, canvas.width, canvas.height)

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Error al exportar'))),
      'image/png',
    ),
  )
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function baseName(fileName: string) {
  return fileName.replace(/\.[^.]+$/, '')
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function formatRelative(timestamp: number) {
  const diff = Date.now() - timestamp
  const minutes = Math.round(diff / 60000)

  if (minutes < 1) return 'Hace un momento'
  if (minutes < 60) return `Hace ${minutes} min`

  const hours = Math.round(minutes / 60)
  if (hours < 24) return `Hace ${hours} h`

  const days = Math.round(hours / 24)
  return days === 1 ? 'Ayer' : `Hace ${days} días`
}

export function createId() {
  return Math.random().toString(36).slice(2, 10)
}
