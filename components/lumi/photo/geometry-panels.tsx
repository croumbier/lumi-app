'use client'

import { FlipHorizontal2, FlipVertical2, RotateCcw, RotateCw } from 'lucide-react'
import { ASPECT_OPTIONS } from '@/lib/lumi/filters'
import type { PhotoEdits } from '@/lib/lumi/types'
import { cn } from '@/lib/utils'

const optionBtn = (selected: boolean) =>
  cn(
    'flex flex-col items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    selected ? 'border-primary bg-secondary text-secondary-foreground' : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground',
  )

export function CropPanel({ edits, onChange }: { edits: PhotoEdits; onChange: (e: PhotoEdits) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">Elige un formato. El recorte se centra automáticamente.</p>
      <ul className="grid grid-cols-3 gap-2">
        {ASPECT_OPTIONS.map((option) => {
          const ratio = option.ratio ?? 4 / 3
          const selected = edits.aspect === option.id
          return (
            <li key={option.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onChange({ ...edits, aspect: option.id })}
                className={cn(optionBtn(selected), 'w-full')}
              >
                <span className="flex size-9 items-center justify-center">
                  <span
                    className={cn('block rounded-[4px] border-2', selected ? 'border-primary' : 'border-current', !option.ratio && 'border-dashed')}
                    style={ratio >= 1 ? { width: 32, height: 32 / ratio } : { height: 32, width: 32 * ratio }}
                  />
                </span>
                <span className="text-center leading-tight">{option.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function RotatePanel({ edits, onChange }: { edits: PhotoEdits; onChange: (e: PhotoEdits) => void }) {
  const rotate = (delta: 90 | -90) =>
    onChange({ ...edits, rotation: (((edits.rotation + delta) % 360) + 360) % 360 as PhotoEdits['rotation'] })

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => rotate(-90)} className={optionBtn(false)}>
          <RotateCcw className="size-5" aria-hidden="true" /> Girar izquierda
        </button>
        <button type="button" onClick={() => rotate(90)} className={optionBtn(false)}>
          <RotateCw className="size-5" aria-hidden="true" /> Girar derecha
        </button>
        <button
          type="button"
          aria-pressed={edits.flipH}
          onClick={() => onChange({ ...edits, flipH: !edits.flipH })}
          className={optionBtn(edits.flipH)}
        >
          <FlipHorizontal2 className="size-5" aria-hidden="true" /> Voltear horizontal
        </button>
        <button
          type="button"
          aria-pressed={edits.flipV}
          onClick={() => onChange({ ...edits, flipV: !edits.flipV })}
          className={optionBtn(edits.flipV)}
        >
          <FlipVertical2 className="size-5" aria-hidden="true" /> Voltear vertical
        </button>
      </div>
      <p className="text-center text-sm text-muted-foreground">Rotación actual: {edits.rotation}°</p>
    </div>
  )
}
