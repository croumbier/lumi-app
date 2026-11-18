'use client'

import { ArrowRight, Clapperboard, ImageIcon } from 'lucide-react'
import { useLumi } from '@/lib/lumi/store'
import { useMediaPicker } from '@/lib/lumi/use-media-picker'
import { ProjectCard } from '../projects/project-card'
import { PopularTools } from './popular-tools'

export function HomeView() {
  const { projects, navigate } = useLumi()
  const { pickFile } = useMediaPicker()
  const recent = [...projects].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12">
      <section
        aria-labelledby="welcome-title"
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-secondary via-accent to-blush px-6 py-10 md:px-12 md:py-14"
      >
        <div aria-hidden="true" className="absolute -right-16 -top-16 size-64 rounded-full bg-white/40 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-20 right-1/4 size-56 rounded-full bg-lavender/50 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="mb-3 inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-secondary-foreground backdrop-blur">
            Tu estudio creativo
          </p>
          <h1 id="welcome-title" className="font-display text-4xl font-semibold leading-tight tracking-tight text-balance text-foreground md:text-5xl">
            ¡Hola! ¿Qué vamos a crear hoy?
          </h1>
          <p className="mt-4 max-w-lg text-pretty text-base leading-relaxed text-secondary-foreground/80">
            Sube una foto o un video desde tu dispositivo y edítalo con filtros, ajustes, recortes y texto.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => pickFile('photo')}
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <ImageIcon className="size-5" aria-hidden="true" />
              Editar fotografía
            </button>
            <button
              type="button"
              onClick={() => pickFile('video')}
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-primary shadow-soft transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Clapperboard className="size-5" aria-hidden="true" />
              Crear video
            </button>
          </div>
        </div>
      </section>

      <section aria-labelledby="recent-title" className="flex flex-col gap-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="recent-title" className="text-xl font-semibold tracking-tight">
              Proyectos recientes
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Retoma donde lo dejaste.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('projects')}
            className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
          >
            Ver todos <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
        {recent.length > 0 ? (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((p) => (
              <li key={p.id}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-3xl border border-dashed border-input bg-card/60 px-6 py-10 text-center text-sm text-muted-foreground">
            Todavía no tienes proyectos. ¡Sube tu primera foto o video!
          </p>
        )}
      </section>

      <PopularTools />
    </div>
  )
}
