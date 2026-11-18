'use client'

import { useLumi } from '@/lib/lumi/store'
import { cn } from '@/lib/utils'
import { LumiLogo } from './logo'
import { NAV_ITEMS } from './nav-items'

export function MobileHeader() {
  const { navigate } = useLumi()
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/70 bg-background/85 px-5 py-3 backdrop-blur-md md:hidden">
      <button type="button" onClick={() => navigate('home')} aria-label="lumi, ir al inicio">
        <LumiLogo className="text-2xl" />
      </button>
    </header>
  )
}

export function MobileNav() {
  const { view, navigate } = useLumi()
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-3 bottom-3 z-40 rounded-3xl border border-border bg-card/95 p-1.5 shadow-soft backdrop-blur-md md:hidden"
    >
      <ul className="grid grid-cols-5">
        {NAV_ITEMS.map((item) => {
          const active = view === item.id
          const Icon = item.icon
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => navigate(item.id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex w-full flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-medium transition-colors',
                  active ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground',
                )}
              >
                <Icon className={cn('size-5', active && 'text-primary')} aria-hidden="true" />
                {item.short}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
