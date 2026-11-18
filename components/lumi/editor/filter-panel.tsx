'use client'

import { DEFAULT_ADJUSTMENTS, FILTER_PRESETS, buildCssFilter } from '@/lib/lumi/filters'
import { cn } from '@/lib/utils'

export function FilterPanel({
  active,
  previewSrc,
  onSelect,
}: {
  active: string
  previewSrc?: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">Elige un look para tu proyecto.</p>
      <ul className="grid grid-cols-3 gap-3">
        {FILTER_PRESETS.map((preset) => {
          const selected = preset.id === active
          const filter = buildCssFilter(preset.id, DEFAULT_ADJUSTMENTS)
          return (
            <li key={preset.id}>
              <button
                type="button"
                onClick={() => onSelect(preset.id)}
                aria-pressed={selected}
                className="group flex w-full flex-col items-center gap-1.5 focus-visible:outline-none"
              >
                <span
                  className={cn(
                    'block aspect-square w-full overflow-hidden rounded-2xl ring-2 ring-offset-2 ring-offset-card transition-all',
                    selected ? 'ring-primary' : 'ring-transparent group-hover:ring-lavender group-focus-visible:ring-ring',
                  )}
                >
                  {previewSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewSrc} alt="" className="size-full object-cover" style={{ filter }} />
                  ) : (
                    <span
                      className="block size-full bg-gradient-to-br from-lavender via-blush to-primary"
                      style={{ filter }}
                    />
                  )}
                </span>
                <span className={cn('text-xs font-medium', selected ? 'text-primary' : 'text-muted-foreground')}>
                  {preset.name}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
