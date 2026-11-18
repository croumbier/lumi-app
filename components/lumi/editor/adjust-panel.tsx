'use client'

import { RotateCcw } from 'lucide-react'
import { ADJUSTMENT_CONTROLS, DEFAULT_ADJUSTMENTS } from '@/lib/lumi/filters'
import type { Adjustments } from '@/lib/lumi/types'
import { SliderControl } from './slider-control'

export function AdjustPanel({ value, onChange }: { value: Adjustments; onChange: (value: Adjustments) => void }) {
  const changed = ADJUSTMENT_CONTROLS.some((c) => value[c.key] !== DEFAULT_ADJUSTMENTS[c.key])
  return (
    <div className="flex flex-col gap-5">
      {ADJUSTMENT_CONTROLS.map((control) => (
        <SliderControl
          key={control.key}
          label={control.label}
          min={control.min}
          max={control.max}
          step={control.key === 'blur' ? 0.5 : 1}
          value={value[control.key]}
          format={control.unit ? (v) => `${v}${control.unit}` : undefined}
          onChange={(v) => onChange({ ...value, [control.key]: v })}
          onReset={() => onChange({ ...value, [control.key]: DEFAULT_ADJUSTMENTS[control.key] })}
        />
      ))}
      <button
        type="button"
        disabled={!changed}
        onClick={() => onChange({ ...DEFAULT_ADJUSTMENTS })}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
      >
        <RotateCcw className="size-4" aria-hidden="true" />
        Restablecer ajustes
      </button>
    </div>
  )
}
