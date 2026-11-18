'use client'

import { Volume2, VolumeX } from 'lucide-react'
import type { RefObject } from 'react'
import { formatTime } from '@/lib/lumi/render'
import type { VideoEdits } from '@/lib/lumi/types'
import { cn } from '@/lib/utils'
import { SliderControl } from '../editor/slider-control'

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3]

export function TrimPanel({
  edits,
  duration,
  videoRef,
  onChange,
}: {
  edits: VideoEdits
  duration: number
  videoRef: RefObject<HTMLVideoElement | null>
  onChange: (e: VideoEdits) => void
}) {
  if (!duration) return <p className="text-sm text-muted-foreground">Cargando video…</p>
  const end = edits.trimEnd ?? duration
  const minGap = Math.min(0.5, duration / 4)
  const fmt = (v: number) => `${formatTime(v)}.${Math.floor((v % 1) * 10)}`
  const seek = (t: number) => {
    if (videoRef.current) videoRef.current.currentTime = t
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">Elige dónde empieza y termina tu video.</p>
      <div className="relative h-3 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <div
          className="absolute inset-y-0 rounded-full bg-gradient-to-r from-primary to-lavender"
          style={{ left: `${(edits.trimStart / duration) * 100}%`, right: `${100 - (end / duration) * 100}%` }}
        />
      </div>
      <SliderControl
        label="Inicio"
        min={0}
        max={duration}
        step={0.1}
        value={edits.trimStart}
        format={fmt}
        onChange={(v) => {
          const trimStart = Math.min(v, end - minGap)
          onChange({ ...edits, trimStart })
          seek(trimStart)
        }}
        onReset={() => onChange({ ...edits, trimStart: 0 })}
      />
      <SliderControl
        label="Final"
        min={0}
        max={duration}
        step={0.1}
        value={end}
        format={fmt}
        onChange={(v) => {
          const trimEnd = Math.max(v, edits.trimStart + minGap)
          onChange({ ...edits, trimEnd: trimEnd >= duration ? null : trimEnd })
          seek(Math.max(edits.trimStart, trimEnd - 0.5))
        }}
        onReset={() => onChange({ ...edits, trimEnd: null })}
      />
      <div className="rounded-2xl bg-secondary px-4 py-3 text-sm text-secondary-foreground">
        Duración final: <strong className="font-semibold">{formatTime((end - edits.trimStart) / edits.speed)}</strong>
        <span className="text-secondary-foreground/70"> de {formatTime(duration)}</span>
      </div>
    </div>
  )
}

export function SpeedPanel({ edits, onChange }: { edits: VideoEdits; onChange: (e: VideoEdits) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">Cámara lenta para momentos especiales o rápida para timelapses.</p>
      <ul className="grid grid-cols-4 gap-2">
        {SPEEDS.map((speed) => (
          <li key={speed}>
            <button
              type="button"
              aria-pressed={edits.speed === speed}
              onClick={() => onChange({ ...edits, speed })}
              className={cn(
                'w-full rounded-2xl border py-3 text-sm font-semibold tabular-nums transition-colors',
                edits.speed === speed
                  ? 'border-primary bg-primary text-primary-foreground shadow-glow'
                  : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {speed}×
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function AudioPanel({ edits, onChange }: { edits: VideoEdits; onChange: (e: VideoEdits) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        aria-pressed={edits.muted}
        onClick={() => onChange({ ...edits, muted: !edits.muted })}
        className={cn(
          'flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors',
          edits.muted ? 'border-primary bg-secondary' : 'border-border hover:bg-muted',
        )}
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-card text-primary shadow-soft">
          {edits.muted ? <VolumeX className="size-5" aria-hidden="true" /> : <Volume2 className="size-5" aria-hidden="true" />}
        </span>
        <span>
          <span className="block text-sm font-semibold">{edits.muted ? 'Video silenciado' : 'Sonido activado'}</span>
          <span className="block text-xs text-muted-foreground">Toca para {edits.muted ? 'activar' : 'quitar'} el audio</span>
        </span>
      </button>
      <SliderControl
        label="Volumen"
        min={0}
        max={100}
        value={Math.round(edits.volume * 100)}
        format={(v) => `${v}%`}
        onChange={(v) => onChange({ ...edits, volume: v / 100, muted: v === 0 ? edits.muted : false })}
        onReset={() => onChange({ ...edits, volume: 1 })}
      />
    </div>
  )
}
