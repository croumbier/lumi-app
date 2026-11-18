
'use client'

import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useId, useRef, useState, type RefObject } from 'react'
import { buildCssFilter } from '@/lib/lumi/filters'
import { useElementWidth } from '@/lib/lumi/hooks'
import { formatTime } from '@/lib/lumi/render'
import type { TextLayer, VideoEdits } from '@/lib/lumi/types'
import { TextOverlay } from '../editor/text-overlay'

export function VideoStage({
  videoRef,
  src,
  edits,
  duration,
  textInteractive,
  selectedTextId,
  onSelectText,
  onTextsChange,
  onDuration,
}: {
  videoRef: RefObject<HTMLVideoElement | null>
  src: string
  edits: VideoEdits
  duration: number
  textInteractive: boolean
  selectedTextId: string | null
  onSelectText: (id: string) => void
  onTextsChange: (texts: TextLayer[]) => void
  onDuration: (duration: number) => void
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const stageWidth = useElementWidth(frameRef)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const filterId = useId().replace(/:/g, '')
  
  const start = edits.trimStart
  const end = edits.trimEnd ?? duration
  const sharpness = edits.adjustments.sharpness
  const amount = (Math.min(100, sharpness) / 100) * 0.7

  const sharpnessFilter = sharpness > 0
    ? `url(#${filterId})`
    : ''

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.playbackRate = edits.speed
    v.volume = edits.volume
    v.muted = edits.muted
  }, [videoRef, edits.speed, edits.volume, edits.muted])

  useEffect(() => {
    const v = videoRef.current
    if (!v || !duration) return
    if (v.currentTime < start || v.currentTime > end) {
      v.currentTime = start
    }
  }, [videoRef, start, end, duration])

  const toggle = () => {
    const v = videoRef.current
    if (!v) return

    if (v.paused) {
      if (v.currentTime >= end - 0.05 || v.currentTime < start) {
        v.currentTime = start
      }
      v.play()
    } else {
      v.pause()
    }
  }

  const relative = Math.max(0, time - start)
  const span = Math.max(0.01, end - start)

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <div className="flex min-h-[280px] flex-1 items-center justify-center overflow-hidden rounded-[2rem] border border-border bg-foreground/95 p-3 md:min-h-[440px] md:p-6">
        <div ref={frameRef} className="relative max-h-[65vh] max-w-full">
          <svg className="absolute size-0" aria-hidden="true">
            <defs>
              <filter id={filterId}>
                <feConvolveMatrix
                  order="3"
                  kernelMatrix={`0 ${-amount} 0 ${-amount} ${1 + 4 * amount} ${-amount} 0 ${-amount} 0`}
                  preserveAlpha="true"
                />
              </filter>
            </defs>
          </svg>

          <video
            ref={videoRef}
            src={src}
            playsInline
            preload="metadata"
            onClick={toggle}
            onLoadedMetadata={(e) => onDuration(e.currentTarget.duration)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => {
              const v = e.currentTarget
              setTime(v.currentTime)

              if (v.currentTime >= end) {
                v.pause()
                v.currentTime = start
              }
            }}
            className="block max-h-[65vh] max-w-full cursor-pointer rounded-lg"
            style={{
              filter: [
                buildCssFilter(edits.filterId, edits.adjustments),
                sharpnessFilter,
              ].filter(Boolean).join(' '),
            }}
          >
            <track kind="captions" />
          </video>

          <TextOverlay
            texts={edits.texts}
            stageWidth={stageWidth}
            selectedId={selectedTextId}
            interactive={textInteractive}
            onSelect={onSelectText}
            onMove={(id, x, y) =>
              onTextsChange(
                edits.texts.map((t) =>
                  t.id === id ? { ...t, x, y } : t,
                ),
              )
            }
          />
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-full border border-border bg-card px-3 py-2 shadow-soft">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pausar' : 'Reproducir'}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow"
        >
          {playing
            ? <Pause className="size-4" aria-hidden="true" />
            : <Play className="ml-0.5 size-4" aria-hidden="true" />}
        </button>

        <span className="w-24 shrink-0 text-xs tabular-nums text-muted-foreground">
          {formatTime(relative / edits.speed)} / {formatTime(span / edits.speed)}
        </span>

        <label htmlFor="video-scrub" className="sr-only">
          Posición
        </label>

        <input
          id="video-scrub"
          type="range"
          min={start}
          max={end || 1}
          step={0.01}
          value={Math.min(Math.max(time, start), end || 1)}
          onChange={(e) => {
            const v = videoRef.current
            if (v) v.currentTime = Number(e.target.value)
          }}
          className="lumi-range min-w-0 flex-1"
          style={{
            background: `linear-gradient(to right, var(--primary) 0%, var(--lavender) ${(relative / span) * 100}%, var(--secondary) ${(relative / span) * 100}%)`,
          }}
        />

        <span
          className="shrink-0 text-muted-foreground"
          aria-label={edits.muted ? 'Sin sonido' : 'Con sonido'}
        >
          {edits.muted || edits.volume === 0
            ? <VolumeX className="size-4" aria-hidden="true" />
            : <Volume2 className="size-4" aria-hidden="true" />}
        </span>

        {edits.speed !== 1 && (
          <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
            {edits.speed}×
          </span>
        )}
      </div>
    </div>
  )
}
