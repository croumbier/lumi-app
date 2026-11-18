
'use client'

import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { buildCssFilter } from '@/lib/lumi/filters'
import { useElementWidth } from '@/lib/lumi/hooks'
import { applySharpness, drawPhotoGeometry, loadImage } from '@/lib/lumi/render'
import type { PhotoEdits, TextLayer } from '@/lib/lumi/types'
import { TextOverlay } from '../editor/text-overlay'

export function PhotoStage({
  src,
  edits,
  showOriginal,
  textInteractive,
  selectedTextId,
  onSelectText,
  onTextsChange,
}: {
  src: string
  edits: PhotoEdits
  showOriginal: boolean
  textInteractive: boolean
  selectedTextId: string | null
  onSelectText: (id: string) => void
  onTextsChange: (texts: TextLayer[]) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [error, setError] = useState(false)
  const stageWidth = useElementWidth(frameRef)

  useEffect(() => {
    let cancelled = false
    setImage(null)
    setError(false)

    loadImage(src)
      .then((img) => {
        if (!cancelled) setImage(img)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })

    return () => {
      cancelled = true
    }
  }, [src])

  const { rotation, flipH, flipV, aspect } = edits

  useEffect(() => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current

    drawPhotoGeometry(
      canvas,
      image,
      { ...edits, rotation, flipH, flipV, aspect },
      { maxSize: 1600 },
    )

    if (!showOriginal) {
      applySharpness(canvas, edits.adjustments.sharpness)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    image,
    rotation,
    flipH,
    flipV,
    aspect,
    edits.adjustments.sharpness,
    showOriginal,
  ])

  const filter = showOriginal
    ? 'none'
    : buildCssFilter(edits.filterId, edits.adjustments)

  return (
    <div className="lumi-checker flex min-h-[320px] flex-1 items-center justify-center overflow-hidden rounded-[2rem] border border-border p-4 md:min-h-[480px] md:p-8">
      {error ? (
        <p className="text-sm text-destructive">
          No se pudo cargar la imagen.
        </p>
      ) : !image ? (
        <Loader2
          className="size-8 animate-spin text-primary"
          aria-label="Cargando imagen"
        />
      ) : null}

      <div
        ref={frameRef}
        className={
          image
            ? 'relative max-h-[70vh] max-w-full shadow-glow'
            : 'hidden'
        }
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Vista previa de la foto editada"
          className="block max-h-[70vh] max-w-full rounded-lg"
          style={{ filter }}
        />

        {!showOriginal && (
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
        )}

        {showOriginal && (
          <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white">
            Original
          </span>
        )}
      </div>
    </div>
  )
}
