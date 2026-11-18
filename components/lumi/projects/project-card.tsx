'use client'

import { Check, Clapperboard, Heart, ImageIcon, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { formatRelative, formatTime } from '@/lib/lumi/render'
import { useLumi } from '@/lib/lumi/store'
import type { Project } from '@/lib/lumi/types'
import { cn } from '@/lib/utils'
import { ProjectThumbnail } from './project-thumbnail'

export function ProjectCard({ project, manageable = false }: { project: Project; manageable?: boolean }) {
  const { openProject, toggleFavorite, deleteProject, renameProject } = useLumi()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(project.name)
  const TypeIcon = project.type === 'photo' ? ImageIcon : Clapperboard

  const commitRename = () => {
    renameProject(project.id, draft)
    setEditing(false)
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <button
          type="button"
          onClick={() => openProject(project.id)}
          className="block size-full focus-visible:outline-none"
          aria-label={`Abrir ${project.name}`}
        >
          <ProjectThumbnail project={project} className="transition-transform duration-500 group-hover:scale-105" />
        </button>
        <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground shadow-sm backdrop-blur">
          <TypeIcon className="size-3" aria-hidden="true" />
          {project.type === 'photo' ? 'Foto' : 'Video'}
          {project.type === 'video' && project.duration ? ` · ${formatTime(project.duration)}` : ''}
        </span>
        <button
          type="button"
          onClick={() => toggleFavorite(project.id)}
          aria-pressed={project.favorite}
          aria-label={project.favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Heart
            className={cn('size-4', project.favorite ? 'fill-blush-foreground text-blush-foreground' : 'text-muted-foreground')}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="flex items-center gap-2 p-4">
        <div className="min-w-0 flex-1">
          {editing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                commitRename()
              }}
              className="flex items-center gap-1"
            >
              <label htmlFor={`rename-${project.id}`} className="sr-only">
                Nombre del proyecto
              </label>
              <input
                id={`rename-${project.id}`}
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commitRename}
                className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button type="submit" className="rounded-md p-1 text-primary" aria-label="Guardar nombre">
                <Check className="size-4" aria-hidden="true" />
              </button>
            </form>
          ) : (
            <h3 className="truncate text-sm font-semibold">{project.name}</h3>
          )}
          <p className="mt-0.5 text-xs text-muted-foreground">Editado {formatRelative(project.updatedAt).toLowerCase()}</p>
        </div>

        {manageable && !editing && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setDraft(project.name)
                setEditing(true)
              }}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={`Renombrar ${project.name}`}
            >
              <Pencil className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                deleteProject(project.id)
                toast(`"${project.name}" eliminado`)
              }}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Eliminar ${project.name}`}
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
