
'use client'

import { useState } from 'react'
import {
  Crown,
  Sparkles,
  Check,
  X,
  ShieldCheck,
  Zap,
  Star,
  Gift,
} from 'lucide-react'
import { PageHeader } from '../page-header'
import { useLumi } from '@/lib/lumi/store'
import type { LumiPlan } from '@/lib/lumi/types'

const plans = [
  {
    id: 'free',
    name: 'Free',
    subtitle: 'Para comenzar a crear',
    monthly: 0,
    yearly: 0,
    icon: Star,
    featured: false,
    benefits: [
      'Edición básica de fotografías',
      'Herramientas básicas de video',
      'Filtros gratuitos',
      'Proyectos personales',
      'Acceso a Lumi Rewards',
    ],
    unavailable: [
      'Filtros exclusivos',
      'Herramientas avanzadas',
      'Recursos Pro',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    subtitle: 'Para llevar tus ideas más lejos',
    monthly: 12.9,
    yearly: 129,
    icon: Crown,
    featured: true,
    benefits: [
      'Todo lo incluido en Free',
      'Filtros exclusivos',
      'Más opciones de edición',
      'Recursos creativos premium',
      'Más herramientas para video',
      'Experiencia sin marcas de agua',
    ],
    unavailable: [
      'Todos los recursos Pro',
      'Herramientas profesionales exclusivas',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    subtitle: 'Libera toda tu creatividad',
    monthly: 19.9,
    yearly: 199,
    icon: Zap,
    featured: false,
    benefits: [
      'Todo lo incluido en Premium',
      'Todos los recursos exclusivos',
      'Herramientas avanzadas',
      'Mayor libertad de edición',
      'Recursos profesionales',
      'Acceso prioritario a nuevas funciones',
    ],
    unavailable: [],
  },
] as const

type PlanId = LumiPlan

export function PremiumView() {
  const { subscription, selectPlan } = useLumi()

  const [period, setPeriod] = useState<'monthly' | 'yearly'>(
    subscription.period
  )

  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(
    subscription.selectedAt > 0 ? subscription.plan : null
  )

  const [confirmedPlan, setConfirmedPlan] = useState<PlanId | null>(
    subscription.selectedAt > 0 ? subscription.plan : null
  )

  const currentPlan = plans.find((plan) => plan.id === selectedPlan)

  function choosePlan(id: PlanId) {
    setSelectedPlan(id)
    setConfirmedPlan(null)
  }

  function confirmPlan() {
    if (!selectedPlan) return

    selectPlan(selectedPlan, period)
    setConfirmedPlan(selectedPlan)
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <PageHeader
        title="Lumi Premium"
        description="Elige la experiencia creativa que mejor acompaña tus ideas."
      />

      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-secondary via-accent to-blush p-7 md:p-10">
        <div className="absolute -right-12 -top-12 size-56 rounded-full bg-white/30 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="size-4" />
              DESCUBRE TU POTENCIAL
            </div>
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              Tu creatividad merece más posibilidades.
            </h2>
            <p className="mt-3 text-sm leading-6 text-secondary-foreground">
              Explora nuevas herramientas, recursos y experiencias para
              transformar cada idea en una creación única.
            </p>
          </div>
          <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-white/70 shadow-soft">
            <Crown className="size-12 text-primary" />
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Elige tu plan</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Empieza gratis y amplía tu experiencia cuando quieras.
          </p>
        </div>

        <div className="inline-flex rounded-full border border-border bg-card p-1 shadow-soft">
          <button
            type="button"
            onClick={() => {
              setPeriod('monthly')
              setConfirmedPlan(null)
            }}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              period === 'monthly'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Mensual
          </button>
          <button
            type="button"
            onClick={() => {
              setPeriod('yearly')
              setConfirmedPlan(null)
            }}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              period === 'yearly'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Anual
            <span className="ml-1.5 text-xs opacity-80">Ahorra</span>
          </button>
        </div>
      </section>

      <section className="grid items-stretch gap-5 lg:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon
          const price = period === 'monthly' ? plan.monthly : plan.yearly
          const selected = selectedPlan === plan.id

          return (
            <article
              key={plan.id}
              className={`relative flex flex-col rounded-[2rem] border bg-card p-6 shadow-soft transition-all ${
                plan.featured
                  ? 'border-primary shadow-glow lg:-translate-y-2'
                  : 'border-border'
              } ${selected ? 'ring-2 ring-primary' : ''}`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  Más elegido
                </span>
              )}

              <div className="mb-5 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <Icon className="size-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {plan.subtitle}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    S/ {price.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {period === 'monthly' ? 'mes' : 'año'}
                  </span>
                </div>
                {plan.id !== 'free' && period === 'yearly' && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Equivale a S/ {(price / 12).toFixed(2)} al mes.
                  </p>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-3">
                {plan.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{benefit}</span>
                  </div>
                ))}

                {plan.unavailable.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <X className="mt-0.5 size-4 shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => choosePlan(plan.id)}
                className={`mt-7 w-full rounded-full px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90 ${
                  plan.featured
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border bg-secondary text-foreground'
                }`}
              >
                {selected ? 'Plan seleccionado' : `Elegir ${plan.name}`}
              </button>
            </article>
          )
        })}
      </section>

      <section className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-6 shrink-0 text-primary" />
          <div>
            <h2 className="font-semibold">Suscripción segura y transparente</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Esta versión de Lumi es una demostración. Puedes explorar y
              seleccionar planes, pero no se realizan cobros ni se solicitan
              datos bancarios.
            </p>
          </div>
        </div>
      </section>

      {selectedPlan && currentPlan && (
        <section className="rounded-3xl border border-primary/30 bg-secondary/40 p-6">
          <div className="flex items-center gap-3">
            <Gift className="size-6 text-primary" />
            <h2 className="font-semibold">Tu selección</h2>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            Has seleccionado el plan {currentPlan.name} con modalidad{' '}
            {period === 'monthly' ? 'mensual' : 'anual'}.
          </p>

          <p className="mt-2 text-2xl font-bold">
            S/ {(period === 'monthly'
              ? currentPlan.monthly
              : currentPlan.yearly
            ).toFixed(2)}
          </p>

          <button
            type="button"
            onClick={confirmPlan}
            className="mt-5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Confirmar selección de demostración
          </button>

          {confirmedPlan && (
            <div className="mt-4 flex items-start gap-2 rounded-2xl bg-card p-4 text-sm">
              <Check className="size-5 shrink-0 text-primary" />
              <p>
                ¡Selección registrada! Esta es una confirmación de prueba.
                No se ha realizado ningún pago ni activado una suscripción real.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
