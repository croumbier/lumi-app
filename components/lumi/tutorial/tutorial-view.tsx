
'use client'

import { useState } from 'react'
import {
  BookOpen,
  Camera,
  Clapperboard,
  Sparkles,
  Download,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react'

const tutorials: {
  id: string
  title: string
  description: string
  icon: LucideIcon
  steps: string[]
  tip: string
}[] = [
  {
    id: 'photo',
    title: 'Cómo editar fotos',
    description: 'Aprende a transformar tus fotografías con las herramientas de Lumi.',
    icon: Camera,
    steps: [
      'Entra en la sección Editar fotos.',
      'Selecciona una imagen desde tu dispositivo.',
      'Explora los filtros y ajusta brillo, contraste y color.',
      'Utiliza recortar, girar o añadir texto.',
      'Revisa el resultado y guarda tu creación.',
    ],
    tip: 'Prueba diferentes filtros y ajustes hasta encontrar el estilo que más te guste.',
  },
  {
    id: 'quality',
    title: 'Mejorar la calidad',
    description: 'Aprende a utilizar la herramienta de mejora de imagen.',
    icon: Sparkles,
    steps: [
      'Abre una fotografía o un video en Lumi.',
      'Busca la herramienta Mejorar calidad.',
      'Mueve la barra de nitidez para destacar los detalles.',
      'Prueba la opción Mejorar imagen para aplicar ajustes automáticos.',
      'Compara el resultado con tu imagen original.',
    ],
    tip: 'No siempre necesitas usar el 100 % de nitidez. Ajusta el nivel según tu imagen.',
  },
  {
    id: 'video',
    title: 'Cómo editar videos',
    description: 'Descubre cómo personalizar tus videos de manera sencilla.',
    icon: Clapperboard,
    steps: [
      'Entra en Editar videos.',
      'Selecciona el video que deseas editar.',
      'Recorta los fragmentos que no necesitas.',
      'Prueba la velocidad, los filtros y los ajustes.',
      'Agrega textos y personaliza el sonido.',
    ],
    tip: 'Reproduce el video antes de exportarlo para revisar todos tus cambios.',
  },
  {
    id: 'export',
    title: 'Guardar y exportar',
    description: 'Aprende a conservar tus creaciones terminadas.',
    icon: Download,
    steps: [
      'Abre tu proyecto terminado.',
      'Revisa que todos los cambios estén correctos.',
      'Presiona el botón de exportar o descargar.',
      'Espera a que termine el procesamiento.',
      'Busca el archivo guardado en tu dispositivo.',
    ],
    tip: 'Comprueba que el archivo se haya descargado correctamente antes de cerrar Lumi.',
  },
]

export function TutorialView() {
  const [selected, setSelected] = useState('photo')

  const current = tutorials.find((item) => item.id === selected) ?? tutorials[0]
  const CurrentIcon = current.icon

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-7">
      <div>
        <div className="mb-3 flex items-center gap-2 text-primary">
          <BookOpen className="size-5" />
          <span className="text-sm font-semibold">CENTRO DE APRENDIZAJE</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          Tutorial de Lumi
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Aprende a utilizar nuestras herramientas paso a paso.
          ¡Descubre todo lo que puedes crear con Lumi!
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tutorials.map((item) => {
          const Icon = item.icon
          const active = selected === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item.id)}
              className={`flex flex-col gap-3 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                active
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>

              <span className="font-semibold">{item.title}</span>

              <span className="text-xs leading-5 text-muted-foreground">
                {item.description}
              </span>
            </button>
          )
        })}
      </div>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-7">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CurrentIcon className="size-6" />
          </span>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Guía paso a paso
            </p>
            <h2 className="text-xl font-bold">{current.title}</h2>
          </div>
        </div>

        <p className="mb-5 text-sm text-muted-foreground">
          {current.description}
        </p>

        <div className="flex flex-col gap-4">
          {current.steps.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {index + 1}
              </span>

              <p className="pt-1 text-sm leading-6">{step}</p>
            </div>
          ))}
        </div>

        <div className="mt-7 flex items-start gap-3 rounded-2xl bg-primary/5 p-4">
          <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold">Consejo Lumi</p>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              {current.tip}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
          <CheckCircle2 className="size-4" />
          <span>¡Ya puedes ponerlo en práctica!</span>
        </div>
      </section>
    </div>
  )
}
