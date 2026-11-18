'use client'

import { Bold, Plus, Square, Trash2 } from 'lucide-react'
import { useId } from 'react'
import { TEXT_COLORS } from '@/lib/lumi/filters'
import { createId, cssFontFamily } from '@/lib/lumi/render'
import type { TextFont, TextLayer } from '@/lib/lumi/types'
import { cn } from '@/lib/utils'
import { SliderControl } from './slider-control'

const FONTS: { id: TextFont; label: string }[] = [
  { id: 'sans', label: 'Moderna' },
  { id: 'serif', label: 'Elegante' },
  { id: 'mono', label: 'Máquina' },
]

export function createTextLayer(): TextLayer {
  return {
    id: createId(),
    text: 'Tu texto aquí',
    x: 50,
    y: 50,
    size: 8,
    color: '#ffffff',
    font: 'serif',
    bold: false,
    background: false,
  }
}

export function TextPanel({
  texts,
  selectedId,
  onSelect,
  onChange,
}: {
  texts: TextLayer[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onChange: (texts: TextLayer[]) => void
}) {
  const textareaId = useId()
  const selected = texts.find((t) => t.id === selectedId) ?? null
  const update = (patch: Partial<TextLayer>) =>
    selected && onChange(texts.map((t) => (t.id === selected.id ? { ...t, ...patch } : t)))

  const add = () => {
    const layer = { ...createTextLayer(), y: 50 + ((texts.length * 12) % 36) }
    onChange([...texts, layer])
    onSelect(layer.id)
  }

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
      >
        <Plus className="size-4" aria-hidden="true" />
        Añadir texto
      </button>

      {texts.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Capas de texto">
          {texts.map((t, i) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => onSelect(t.id)}
                aria-pressed={t.id === selectedId}
                className={cn(
                  'max-w-40 truncate rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  t.id === selectedId ? 'border-primary bg-secondary text-secondary-foreground' : 'border-border text-muted-foreground hover:bg-muted',
                )}
              >
                {t.text.trim() || `Texto ${i + 1}`}
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected ? (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor={textareaId} className="text-sm font-medium">
              Contenido
            </label>
            <textarea
              id={textareaId}
              rows={2}
              value={selected.text}
              onChange={(e) => update({ text: e.target.value })}
              className="resize-none rounded-2xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-medium">Tipografía</legend>
            <div className="grid grid-cols-3 gap-2">
              {FONTS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => update({ font: f.id })}
                  aria-pressed={selected.font === f.id}
                  style={{ fontFamily: cssFontFamily(f.id) }}
                  className={cn(
                    'rounded-xl border px-2 py-2 text-sm transition-colors',
                    selected.font === f.id ? 'border-primary bg-secondary text-secondary-foreground' : 'border-border hover:bg-muted',
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </fieldset>

          <SliderControl
            label="Tamaño"
            min={3}
            max={20}
            step={0.5}
            value={selected.size}
            onChange={(size) => update({ size })}
          />

          <fieldset>
            <legend className="mb-2 text-sm font-medium">Color</legend>
            <div className="flex flex-wrap gap-2">
              {TEXT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => update({ color })}
                  aria-label={`Color ${color}`}
                  aria-pressed={selected.color === color}
                  className={cn(
                    'size-8 rounded-full border border-border ring-2 ring-offset-2 ring-offset-card transition-all',
                    selected.color === color ? 'ring-primary' : 'ring-transparent hover:ring-lavender',
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </fieldset>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => update({ bold: !selected.bold })}
              aria-pressed={selected.bold}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold',
                selected.bold ? 'border-primary bg-secondary text-secondary-foreground' : 'border-border text-muted-foreground',
              )}
            >
              <Bold className="size-3.5" aria-hidden="true" /> Negrita
            </button>
            <button
              type="button"
              onClick={() => update({ background: !selected.background })}
              aria-pressed={selected.background}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold',
                selected.background ? 'border-primary bg-secondary text-secondary-foreground' : 'border-border text-muted-foreground',
              )}
            >
              <Square className="size-3.5" aria-hidden="true" /> Fondo
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(texts.filter((t) => t.id !== selected.id))
                onSelect(null)
              }}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-3.5" aria-hidden="true" /> Eliminar
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Arrastra el texto sobre la imagen para moverlo.</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {texts.length ? 'Selecciona un texto para editarlo.' : 'Añade títulos, frases o firmas a tu proyecto.'}
        </p>
      )}
    </div>
  )
}
