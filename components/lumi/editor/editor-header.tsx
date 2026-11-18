'use client'

import { ArrowLeft, Heart, Redo2, Undo2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useLumi } from '@/lib/lumi/store'
import type { Project } from '@/lib/lumi/types'
import { cn } from '@/lib/utils'

export function EditorHeader({
  project,
  onBack,
  history,
  actions,
}: {
  project: Project
  onBack: () => void
  history: { undo: () => void; redo: () => void; canUndo: boolean; canRedo: boolean }
  actions: ReactNode
}) {
  const { renameProject, toggleFavorite } = useLumi()
  const iconBtn =
    'flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-soft transition-colors hover:text-foreground disabled:opacity-40 disabled:hover:text-muted-foreground'

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-2">
        <button type="button" onClick={onBack} className={iconBtn} aria-label="Cerrar proyecto">
          <ArrowLeft className="size-4" aria-hidden="true" />
        </button>
        <label htmlFor="project-name" className="sr-only">
          Nombre del proyecto
        </label>
        <input
          id="project-name"
          key={project.id}
          defaultValue={project.name}
          onBlur={(e) => renameProject(project.id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) e.currentTarget.blur()
          }}
          className="min-w-0 flex-1 truncate rounded-xl bg-transparent px-2 py-1 font-display text-2xl font-semibold tracking-tight hover:bg-muted focus-visible:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-3xl"
        />
        <button
          type="button"
          onClick={() => toggleFavorite(project.id)}
          aria-pressed={project.favorite}
          aria-label={project.favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          className={iconBtn}
        >
          <Heart className={cn('size-4', project.favorite && 'fill-blush-foreground text-blush-foreground')} aria-hidden="true" />
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={history.undo} disabled={!history.canUndo} className={iconBtn} aria-label="Deshacer">
          <Undo2 className="size-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={history.redo} disabled={!history.canRedo} className={iconBtn} aria-label="Rehacer">
          <Redo2 className="size-4" aria-hidden="true" />
        </button>
        {actions}
      </div>
    </div>
  )
}
