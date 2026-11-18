
'use client'

import {
  Gift,
  Sparkles,
  Star,
  Trophy,
  CheckCircle2,
  Clock,
  Palette,
  Camera,
  Video,
  Flame,
  Lock,
} from 'lucide-react'
import { useLumi } from '@/lib/lumi/store'
import { PageHeader } from '../page-header'

const missions = [
  {
    id: 'photo',
    title: 'Tu primera creación',
    description: 'Edita una fotografía y expórtala correctamente desde Lumi.',
    points: 50,
    icon: Camera,
    requirement: 'Edita y descarga una fotografía.',
  },
  {
    id: 'video',
    title: 'Luces, cámara, acción',
    description: 'Edita un video y expórtalo correctamente desde Lumi.',
    points: 75,
    icon: Video,
    requirement: 'Edita y exporta un video.',
  },
  {
    id: 'creative',
    title: 'Explora tu creatividad',
    description: 'Experimenta con diferentes herramientas de edición.',
    points: 30,
    icon: Palette,
    requirement: 'Utiliza al menos 3 herramientas diferentes.',
  },
] as const

export function RewardsView() {
  const { rewardsProgress } = useLumi()

  const completed = rewardsProgress.completed

  const points = completed.reduce((total, id) => {
    const mission = missions.find((item) => item.id === id)
    return total + (mission?.points ?? 0)
  }, 0)

  const level = points >= 150 ? 3 : points >= 75 ? 2 : 1

  const levelName =
    level === 3
      ? 'Artista Lumi'
      : level === 2
        ? 'Creador en progreso'
        : 'Explorador creativo'

  const progressToNextLevel =
    level === 1
      ? Math.min((points / 75) * 100, 100)
      : level === 2
        ? Math.min(((points - 75) / 75) * 100, 100)
        : 100

  const nextLevelPoints =
    level === 1 ? 75 : level === 2 ? 150 : null

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <PageHeader
        title="Lumi Rewards"
        description="Crea, explora y gana recompensas mientras desarrollas tu creatividad."
      />

      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-secondary via-accent to-blush p-7 md:p-10">
        <div className="absolute -right-10 -top-10 size-48 rounded-full bg-white/30 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary-foreground">
              <Sparkles className="size-4" />
              TU SALDO DE PUNTOS
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display text-6xl font-semibold text-foreground">
                {points}
              </span>
              <span className="text-lg font-medium text-secondary-foreground">
                puntos
              </span>
            </div>

            <p className="mt-2 text-sm text-secondary-foreground/80">
              Cada creación es una oportunidad para ganar.
            </p>
          </div>

          <div className="flex size-24 items-center justify-center rounded-full bg-white/70 shadow-soft">
            <Gift className="size-12 text-primary" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-5">
          <Star className="mb-3 size-6 text-primary" />
          <p className="text-2xl font-semibold">{completed.length}</p>
          <p className="text-sm text-muted-foreground">
            Misiones completadas
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5">
          <Trophy className="mb-3 size-6 text-primary" />
          <p className="text-2xl font-semibold">{points}</p>
          <p className="text-sm text-muted-foreground">
            Puntos obtenidos
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5">
          <Flame className="mb-3 size-6 text-primary" />
          <p className="text-2xl font-semibold">Nivel {level}</p>
          <p className="text-sm text-muted-foreground">{levelName}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Tu progreso creativo</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {nextLevelPoints !== null
                ? `Te faltan ${Math.max(nextLevelPoints - points, 0)} puntos para el siguiente nivel.`
                : '¡Has alcanzado el nivel máximo!'}
            </p>
          </div>

          <Trophy className="size-7 text-primary" />
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progressToNextLevel}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{levelName}</span>
          <span>{nextLevelPoints ?? 'Máximo nivel'}</span>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-semibold">Misiones creativas</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tus puntos se desbloquean automáticamente al cumplir cada actividad.
          </p>
        </div>

        <div className="grid gap-4">
          {missions.map((mission) => {
            const Icon = mission.icon
            const done = completed.includes(mission.id)

            return (
              <article
                key={mission.id}
                className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 sm:flex-row sm:items-center"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <Icon className="size-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{mission.title}</h3>
                    {done && (
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-primary">
                        Completada
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {mission.description}
                  </p>

                  <p className="mt-2 text-xs text-muted-foreground">
                    <span className="font-semibold">Objetivo:</span>{' '}
                    {mission.requirement}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                  <span className="text-sm font-semibold text-primary">
                    +{mission.points} puntos
                  </span>

                  {done ? (
                    <CheckCircle2 className="size-6 text-primary" />
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Lock className="size-3.5" />
                      Por completar
                    </span>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <Clock className="size-6 text-primary" />
          <div>
            <h2 className="font-semibold">Recompensas temporales</h2>
            <p className="text-sm text-muted-foreground">
              Próximamente podrás desbloquear beneficios por tiempo limitado.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <Trophy className="size-6 text-primary" />
          <h2 className="font-semibold">Historial de recompensas</h2>
        </div>

        {completed.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Todavía no tienes recompensas. ¡Empieza creando en Lumi!
          </p>
        ) : (
          <div className="space-y-3">
            {missions
              .filter((mission) => completed.includes(mission.id))
              .map((mission) => (
                <div
                  key={mission.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary" />
                    {mission.title}
                  </span>

                  <span className="font-semibold text-primary">
                    +{mission.points} puntos
                  </span>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  )
}
