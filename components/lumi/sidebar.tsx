'use client'

import { Plus, Sparkles } from 'lucide-react'
import { useLumi } from '@/lib/lumi/store'
import { useMediaPicker } from '@/lib/lumi/use-media-picker'
import { cn } from '@/lib/utils'
import { LumiLogo } from './logo'
import { NAV_ITEMS } from './nav-items'

export function Sidebar() {
  const { view, navigate, projects } = useLumi()
  const { pickFile } = useMediaPicker()
  const favorites = projects.filter((p) => p.favorite).length

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 md:flex">
      <button
        type="button"
        onClick={() => navigate('home')}
        className="mb-8 self-start rounded-lg px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="lumi, ir al inicio"
      >
        <LumiLogo />
      </button>

      <nav aria-label="Principal" className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = view === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.id)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-muted hover:text-sidebar-foreground',
              )}
            >
              <Icon className={cn('size-[18px]', active && 'text-primary')} aria-hidden="true" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === 'favorites' && favorites > 0 && (
                <span className="rounded-full bg-blush px-2 py-0.5 text-xs font-semibold text-blush-foreground">
                  {favorites}
                </span>
              )}
              {item.id === 'projects' && (
                <span className="text-xs text-muted-foreground">{projects.length}</span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto rounded-3xl bg-gradient-to-br from-secondary via-accent to-blush p-4">
        <div className="mb-3 flex size-9 items-center justify-center rounded-full bg-white/80 text-primary shadow-soft">
          <Sparkles className="size-4" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold text-secondary-foreground">Empieza algo nuevo</p>
        <p className="mt-1 text-xs leading-relaxed text-secondary-foreground/75">
          Sube una foto desde tu dispositivo y dale tu toque.
        </p>
        <button
          type="button"
          onClick={() => pickFile('photo')}
          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold text-primary shadow-soft transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus className="size-3.5" aria-hidden="true" />
          Nuevo proyecto
        </button>
      </div>
    </aside>
  )
}
