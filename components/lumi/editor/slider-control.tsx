'use client'

import { useId } from 'react'

export function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  format,
  onChange,
  onReset,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  format?: (value: number) => string
  onChange: (value: number) => void
  onReset?: () => void
}) {
  const id = useId()
  const percent = ((value - min) / (max - min)) * 100
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <label htmlFor={id} className="font-medium">
          {label}
        </label>
        <button
          type="button"
          onClick={onReset}
          disabled={!onReset}
          className="rounded-md px-1.5 text-xs tabular-nums text-muted-foreground hover:text-primary disabled:hover:text-muted-foreground"
          aria-label={onReset ? `Restablecer ${label}` : undefined}
        >
          {format ? format(value) : value > 0 && min < 0 ? `+${value}` : value}
        </button>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="lumi-range"
        style={{
          background: `linear-gradient(to right, var(--primary) 0%, var(--lavender) ${percent}%, var(--secondary) ${percent}%)`,
        }}
      />
    </div>
  )
}
