
'use client'

import { Sparkles, Sun, Contrast, Focus, RotateCcw } from 'lucide-react'
import type { Adjustments } from '@/lib/lumi/types'

interface EnhancePanelProps {
  value: Adjustments
  onChange: (values: Adjustments) => void
}

export function EnhancePanel({ value, onChange }: EnhancePanelProps) {
  function applyEnhancement() {
    onChange({
      ...value,
      brightness: 10,
      contrast: 15,
      saturation: 8,
      sharpness: 45,
    })
  }

  function resetEnhancement() {
    onChange({
      ...value,
      brightness: 0,
      contrast: 0,
      saturation: 0,
      sharpness: 0,
    })
  }

  function changeSharpness(sharpness: number) {
    onChange({
      ...value,
      sharpness,
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <h3 className="font-semibold">Mejorar calidad</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Realza la apariencia de tus fotos y videos con ajustes gratuitos.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-muted/40 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Focus className="size-5 text-primary" />
            <p className="text-sm font-medium">Nitidez visual</p>
          </div>
          <span className="text-sm font-semibold tabular-nums">
            {value.sharpness}%
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={value.sharpness}
          onChange={(e) => changeSharpness(Number(e.target.value))}
          className="w-full cursor-pointer accent-primary"
          aria-label="Intensidad de nitidez"
        />

        <p className="mt-2 text-xs text-muted-foreground">
          Permite destacar los bordes y detalles de la imagen.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-muted/40 p-4">
        <div className="flex items-center gap-3">
          <Sun className="size-5 text-primary" />
          <div>
            <p className="text-sm font-medium">Iluminación inteligente</p>
            <p className="text-xs text-muted-foreground">
              Equilibra el brillo de la imagen.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-muted/40 p-4">
        <div className="flex items-center gap-3">
          <Contrast className="size-5 text-primary" />
          <div>
            <p className="text-sm font-medium">Contraste mejorado</p>
            <p className="text-xs text-muted-foreground">
              Realza la diferencia entre luces y sombras.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={applyEnhancement}
        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
      >
        <Sparkles className="size-4" />
        Mejorar imagen
      </button>

      <button
        type="button"
        onClick={resetEnhancement}
        className="flex h-10 items-center justify-center gap-2 rounded-xl border border-border text-sm font-medium hover:bg-muted"
      >
        <RotateCcw className="size-4" />
        Restablecer
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Herramienta gratuita para todos los usuarios de Lumi.
      </p>
    </div>
  )
}
