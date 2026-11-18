
'use client'

import {
  Crop,
  Gauge,
  RotateCw,
  Scissors,
  SlidersHorizontal,
  Type,
  Wand2,
  Volume2,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { useLumi } from '@/lib/lumi/store'
import type { PhotoToolId, VideoToolId } from '@/lib/lumi/types'

type Tool =
  | {
      name: string
      description: string
      icon: LucideIcon
      media: 'photo'
      tool: PhotoToolId
    }
  | {
      name: string
      description: string
      icon: LucideIcon
      media: 'video'
      tool: VideoToolId
    }

const TOOLS: Tool[] = [
  { name: 'Filtros', description: 'Looks pastel en un toque', icon: Wand2, media: 'photo', tool: 'filters' },
  { name: 'Ajustes', description: 'Brillo, contraste y más', icon: SlidersHorizontal, media: 'photo', tool: 'adjust' },
  { name: 'Mejorar calidad', description: 'Realza tus fotografías', icon: Sparkles, media: 'photo', tool: 'enhance' },
  { name: 'Recortar', description: 'Formatos para redes', icon: Crop, media: 'photo', tool: 'crop' },
  { name: 'Rotar', description: 'Gira y voltea', icon: RotateCw, media: 'photo', tool: 'rotate' },
  { name: 'Texto', description: 'Añade frases y títulos', icon: Type, media: 'photo', tool: 'text' },
  { name: 'Cortar video', description: 'Elige inicio y final', icon: Scissors, media: 'video', tool: 'trim' },
  { name: 'Velocidad', description: 'Cámara lenta o rápida', icon: Gauge, media: 'video', tool: 'speed' },
  { name: 'Mejorar calidad', description: 'Realza tus videos', icon: Sparkles, media: 'video', tool: 'enhance' },
  { name: 'Audio', description: 'Volumen y silencio', icon: Volume2, media: 'video', tool: 'audio' },
]

export function PopularTools() {
  const { navigate, setPhotoTool, setVideoTool } = useLumi()

  const openTool = (tool: Tool) => {
    if (tool.media === 'photo') {
      setPhotoTool(tool.tool)
      navigate('photo')
      return
    }

    setVideoTool(tool.tool)
    navigate('video')
  }

  return (
    <section aria-labelledby="tools-title" className="flex flex-col gap-5">
      <div>
        <h2 id="tools-title" className="text-xl font-semibold tracking-tight">
          Herramientas populares
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ve directo a lo que necesitas.
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TOOLS.map((tool, index) => {
          const Icon = tool.icon

          return (
            <li key={`${tool.media}-${tool.name}-${index}`}>
              <button
                type="button"
                onClick={() => openTool(tool)}
                className="group flex h-full w-full flex-col items-start gap-3 rounded-3xl border border-border bg-card p-4 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:border-lavender hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary transition-colors group-hover:bg-blush group-hover:text-blush-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>

                <span>
                  <span className="block text-sm font-semibold">
                    {tool.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {tool.description}
                  </span>
                </span>

                <span className="mt-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {tool.media === 'photo' ? 'Foto' : 'Video'}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
