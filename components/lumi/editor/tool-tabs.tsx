'use client'

import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ToolTab<T extends string> {
  id: T
  label: string
  icon: LucideIcon
}

export function ToolTabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: ToolTab<T>[]
  active: T
  onChange: (id: T) => void
}) {
  return (
    <div role="tablist" aria-label="Herramientas" className="flex gap-1 overflow-x-auto rounded-2xl bg-muted p-1 [scrollbar-width:none]">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const selected = tab.id === active
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex min-w-16 flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              selected ? 'bg-card text-primary shadow-soft' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="size-[18px]" aria-hidden="true" />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
