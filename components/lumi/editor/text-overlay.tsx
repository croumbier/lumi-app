'use client'

import { useRef } from 'react'
import { cssFontFamily } from '@/lib/lumi/render'
import type { TextLayer } from '@/lib/lumi/types'
import { cn } from '@/lib/utils'

export function TextOverlay({
  texts,
  stageWidth,
  selectedId,
  interactive,
  onSelect,
  onMove,
}: {
  texts: TextLayer[]
  stageWidth: number
  selectedId: string | null
  interactive: boolean
  onSelect: (id: string) => void
  onMove: (id: string, x: number, y: number) => void
}) {
  const layerRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null)

  const toPercent = (clientX: number, clientY: number) => {
    const rect = layerRef.current?.getBoundingClientRect()
    if (!rect) return { x: 50, y: 50 }
    return {
      x: Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100)),
    }
  }

  return (
    <div ref={layerRef} className={cn('absolute inset-0', !interactive && 'pointer-events-none')}>
      {texts.map((t) => {
        const fontSize = (t.size / 100) * stageWidth
        const isSelected = interactive && t.id === selectedId
        return (
          <div
            key={t.id}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : -1}
            aria-label={interactive ? `Texto: ${t.text}. Usa las flechas para moverlo.` : undefined}
            onPointerDown={(e) => {
              if (!interactive) return
              e.currentTarget.setPointerCapture(e.pointerId)
              const pos = toPercent(e.clientX, e.clientY)
              drag.current = { id: t.id, offsetX: pos.x - t.x, offsetY: pos.y - t.y }
              onSelect(t.id)
            }}
            onPointerMove={(e) => {
              if (drag.current?.id !== t.id) return
              const pos = toPercent(e.clientX, e.clientY)
              onMove(t.id, pos.x - drag.current.offsetX, pos.y - drag.current.offsetY)
            }}
            onPointerUp={() => {
              drag.current = null
            }}
            onKeyDown={(e) => {
              const step = e.shiftKey ? 5 : 1
              const delta: Record<string, [number, number]> = {
                ArrowLeft: [-step, 0],
                ArrowRight: [step, 0],
                ArrowUp: [0, -step],
                ArrowDown: [0, step],
              }
              const d = delta[e.key]
              if (!d) return
              e.preventDefault()
              onMove(t.id, Math.min(100, Math.max(0, t.x + d[0])), Math.min(100, Math.max(0, t.y + d[1])))
            }}
            onFocus={() => interactive && onSelect(t.id)}
            className={cn(
              'absolute -translate-x-1/2 -translate-y-1/2 touch-none select-none whitespace-pre text-center leading-[1.2] outline-none',
              interactive && 'cursor-move',
              isSelected && 'rounded-md ring-2 ring-white/90 ring-offset-2 ring-offset-primary/70',
            )}
            style={{
              left: `${t.x}%`,
              top: `${t.y}%`,
              fontSize,
              color: t.color,
              fontFamily: cssFontFamily(t.font),
              fontWeight: t.bold ? 700 : 500,
              padding: t.background ? `${fontSize * 0.25}px ${fontSize * 0.45}px` : undefined,
              borderRadius: t.background ? fontSize * 0.35 : undefined,
              backgroundColor: t.background
                ? t.color === '#ffffff'
                  ? 'rgba(45,27,61,0.55)'
                  : 'rgba(255,255,255,0.8)'
                : undefined,
              textShadow: t.background ? undefined : `0 0 ${fontSize * 0.15}px rgba(0,0,0,0.25)`,
            }}
          >
            {t.text}
          </div>
        )
      })}
    </div>
  )
}
