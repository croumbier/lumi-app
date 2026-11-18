
import { buildCssFilter } from './filters'
import { applySharpness, drawTextLayers } from './render'
import type { VideoEdits } from './types'

const MIME_CANDIDATES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
  'video/mp4',
]

export function canExportVideo() {
  return (
    typeof window !== 'undefined' &&
    'MediaRecorder' in window &&
    'captureStream' in HTMLCanvasElement.prototype
  )
}

/**
 * Re-renders the video in real time onto a canvas (filters, sharpness + text)
 * and records it with MediaRecorder.
 */
export async function exportVideo(
  src: string,
  edits: VideoEdits,
  duration: number,
  onProgress: (fraction: number) => void,
  signal: AbortSignal,
): Promise<{ blob: Blob; extension: string }> {
  const mimeType =
    MIME_CANDIDATES.find((m) => MediaRecorder.isTypeSupported(m)) ?? ''

  const video = document.createElement('video')
  video.src = src
  video.crossOrigin = 'anonymous'
  video.playsInline = true
  video.preload = 'auto'

  Object.assign(video.style, {
    position: 'fixed',
    width: '1px',
    height: '1px',
    opacity: '0',
    pointerEvents: 'none',
  })

  document.body.appendChild(video)

  let audioCtx: AudioContext | null = null
  let frame = 0

  try {
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve()
      video.onerror = () => reject(new Error('No se pudo cargar el video'))
    })

    const start = Math.min(edits.trimStart, duration)
    const end = Math.min(edits.trimEnd ?? duration, duration)
    const scale = Math.min(
      1,
      1280 / Math.max(video.videoWidth, video.videoHeight),
    )

    const canvas = document.createElement('canvas')
    canvas.width = Math.round(video.videoWidth * scale) || 1280
    canvas.height = Math.round(video.videoHeight * scale) || 720

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas no disponible')

    const stream = canvas.captureStream(30)

    if (!edits.muted && edits.volume > 0) {
      audioCtx = new AudioContext()
      const source = audioCtx.createMediaElementSource(video)
      const gain = audioCtx.createGain()
      gain.gain.value = edits.volume

      const dest = audioCtx.createMediaStreamDestination()
      source.connect(gain).connect(dest)
      dest.stream.getAudioTracks().forEach((t) => stream.addTrack(t))
    } else {
      video.muted = true
    }

    video.currentTime = start

    await new Promise<void>((resolve) => {
      video.onseeked = () => resolve()
    })

    video.playbackRate = edits.speed

    const recorder = new MediaRecorder(
      stream,
      mimeType
        ? { mimeType, videoBitsPerSecond: 6_000_000 }
        : undefined,
    )

    const chunks: Blob[] = []

    recorder.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data)
    }

    const stopped = new Promise<void>((resolve) => {
      recorder.onstop = () => resolve()
    })

    const filter = buildCssFilter(edits.filterId, edits.adjustments)

    const draw = () => {
      ctx.filter = filter
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      ctx.filter = 'none'

      if (edits.adjustments.sharpness > 0) {
        applySharpness(canvas, edits.adjustments.sharpness)
      }

      drawTextLayers(ctx, edits.texts, canvas.width, canvas.height)

      onProgress(
        Math.min(
          1,
          (video.currentTime - start) / Math.max(0.01, end - start),
        ),
      )

      if (signal.aborted || video.currentTime >= end || video.ended) {
        video.pause()
        if (recorder.state !== 'inactive') recorder.stop()
        return
      }

      frame = requestAnimationFrame(draw)
    }

    recorder.start(250)
    await video.play()
    draw()
    await stopped

    if (signal.aborted) {
      throw new DOMException('Exportación cancelada', 'AbortError')
    }

    const type = recorder.mimeType || mimeType || 'video/webm'

    return {
      blob: new Blob(chunks, { type }),
      extension: type.includes('mp4') ? 'mp4' : 'webm',
    }
  } finally {
    cancelAnimationFrame(frame)
    video.pause()
    video.remove()
    audioCtx?.close()
  }
}
