'use client'

import { Clapperboard, ImageIcon, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { useLumi } from '@/lib/lumi/store'
import { useMediaPicker } from '@/lib/lumi/use-media-picker'
import type { MediaType } from '@/lib/lumi/types'
import { cn } from '@/lib/utils'
import { PageHeader } from '../page-header'
import { ProjectCard } from '../projects/project-card'

const COPY: Record<MediaType, { title: string; description: string; cta: string; hint: string }> = {
  photo: {
    title: 'Editar fotos',
    description: 'Tu espacio para fotografías: filtros, ajustes, recorte, rotación y texto.',
    cta: 'Seleccionar foto',
    hint: 'PNG, JPG, WEBP o GIF',
  },
  video: {
    title: 'Editar videos',
    description: 'Tu espacio para videos: corta, cambia la velocidad, aplica filtros y añade texto.',
    cta: 'Seleccionar video',
    hint: 'MP4, WEBM o MOV',
  },
}

export function UploadDropzone({ type }: { type: MediaType }) {
  const { projects } = useLumi()
  const { pickFile, importFile } = useMediaPicker()
  const [dragging, setDragging] = useState(false)
  const copy = COPY[type]
  const Icon = type === 'photo' ? ImageIcon : Clapperboard
  const existing = projects.filter((p) => p.type === type).sort((a, b) => b.updatedAt - a.updatedAt)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <PageHeader title={copy.title} description={copy.description} />

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          const file = e.dataTransfer.files[0]
          if (file) importFile(file, type)
        }}
        className={cn(
          'flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed px-6 py-16 text-center transition-colors md:py-20',
          dragging ? 'border-primary bg-secondary' : 'border-lavender bg-card/70',
        )}
      >
        <div className="relative mb-5">
          <div className="flex size-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-secondary to-blush text-primary shadow-soft">
            <Icon className="size-8" aria-hidden="true" />
          </div>
          <span className="absolute -bottom-1.5 -right-1.5 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow">
            <UploadCloud className="size-4" aria-hidden="true" />
          </span>
        </div>
        <h2 className="text-lg font-semibold">Arrastra tu archivo aquí</h2>
        <p className="mt-1 text-sm text-muted-foreground">o selecciónalo desde tu dispositivo · {copy.hint}</p>
        <button
          type="button"
          onClick={() => pickFile(type)}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <UploadCloud className="size-4" aria-hidden="true" />
          {copy.cta}
        </button>
        <p className="mt-4 text-xs text-muted-foreground">Tus archivos se procesan en tu navegador, no se suben a ningún servidor.</p>
      </div>

      {existing.length > 0 && (
        <section aria-labelledby={`existing-${type}`} className="flex flex-col gap-4">
          <h2 id={`existing-${type}`} className="text-lg font-semibold">
            O continúa con un proyecto
          </h2>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {existing.slice(0, 4).map((p) => (
              <li key={p.id}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
