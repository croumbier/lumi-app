'use client'

import { Clapperboard, Heart, ImageIcon, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useLumi } from '@/lib/lumi/store'
import { useMediaPicker } from '@/lib/lumi/use-media-picker'
import type { MediaType } from '@/lib/lumi/types'
import { cn } from '@/lib/utils'
import { PageHeader } from '../page-header'
import { ProjectCard } from './project-card'

type Filter = 'all' | MediaType
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'photo', label: 'Fotos' },
  { id: 'video', label: 'Videos' },
]

export function ProjectsView({ mode }: { mode: 'all' | 'favorites' }) {
  const { projects, navigate } = useLumi()
  const { pickFile } = useMediaPicker()
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects
      .filter((p) => (mode === 'favorites' ? p.favorite : true))
      .filter((p) => filter === 'all' || p.type === filter)
      .filter((p) => !q || p.name.toLowerCase().includes(q))
      .sort((a, b) => b.updatedAt - a.updatedAt)
  }, [projects, mode, filter, query])

  const isFavorites = mode === 'favorites'

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title={isFavorites ? 'Favoritos' : 'Mis proyectos'}
        description={
          isFavorites
            ? 'Los proyectos que marcaste con un corazón.'
            : 'Todas tus fotos y videos en un solo lugar. Ábrelos para seguir editando.'
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filtrar por tipo" className="inline-flex self-start rounded-full bg-muted p-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                filter === f.id ? 'bg-card text-foreground shadow-soft' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="project-search" className="sr-only">
            Buscar proyectos
          </label>
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar proyectos…"
            className="h-10 w-full rounded-full border border-input bg-card pl-10 pr-4 text-sm shadow-soft placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {visible.length > 0 ? (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((p) => (
            <li key={p.id}>
              <ProjectCard project={p} manageable />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-input bg-card/60 px-6 py-16 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-blush text-blush-foreground">
            <Heart className="size-6" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold">
            {isFavorites ? 'Aún no tienes favoritos' : query ? 'Sin resultados' : 'Aún no hay proyectos aquí'}
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {isFavorites
              ? 'Toca el corazón de cualquier proyecto para guardarlo aquí.'
              : 'Sube una foto o un video desde tu dispositivo para empezar.'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {isFavorites ? (
              <button
                type="button"
                onClick={() => navigate('projects')}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
              >
                Ver mis proyectos
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => pickFile('photo')}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
                >
                  <ImageIcon className="size-4" aria-hidden="true" /> Subir foto
                </button>
                <button
                  type="button"
                  onClick={() => pickFile('video')}
                  className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground"
                >
                  <Clapperboard className="size-4" aria-hidden="true" /> Subir video
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
