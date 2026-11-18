
'use client'

import {
  Download,
  Gauge,
  Loader2,
  Scissors,
  SlidersHorizontal,
  Type,
  Volume2,
  Wand2,
  X,
  Sparkles,
} from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useEditHistory } from '@/lib/lumi/hooks'
import { downloadBlob } from '@/lib/lumi/render'
import { useLumi } from '@/lib/lumi/store'
import type {
  VideoEdits,
  VideoProject,
  VideoToolId,
} from '@/lib/lumi/types'
import {
  canExportVideo,
  exportVideo,
} from '@/lib/lumi/video-export'
import { AdjustPanel } from '../editor/adjust-panel'
import { EditorHeader } from '../editor/editor-header'
import { FilterPanel } from '../editor/filter-panel'
import { TextPanel } from '../editor/text-panel'
import { ToolTabs, type ToolTab } from '../editor/tool-tabs'
import { UploadDropzone } from '../editor/upload-dropzone'
import { EnhancePanel } from '../photo/enhance-panel'
import {
  AudioPanel,
  SpeedPanel,
  TrimPanel,
} from './video-panels'
import { VideoStage } from './video-stage'

const TABS: ToolTab<VideoToolId>[] = [
  { id: 'trim', label: 'Cortar', icon: Scissors },
  { id: 'speed', label: 'Velocidad', icon: Gauge },
  { id: 'filters', label: 'Filtros', icon: Wand2 },
  { id: 'adjust', label: 'Ajustes', icon: SlidersHorizontal },
  { id: 'enhance', label: 'Mejorar', icon: Sparkles },
  { id: 'text', label: 'Texto', icon: Type },
  { id: 'audio', label: 'Audio', icon: Volume2 },
]

export function VideoEditor() {
  const { projects, activeVideoId } = useLumi()

  const project = projects.find(
    (p): p is VideoProject =>
      p.id === activeVideoId && p.type === 'video'
  )

  if (!project) return <UploadDropzone type="video" />

  return <VideoWorkspace key={project.id} project={project} />
}

function VideoWorkspace({ project }: { project: VideoProject }) {
  const {
    videoTool,
    setVideoTool,
    updateVideoEdits,
    setVideoDuration,
    closeProject,
    recordToolUsed,
    recordVideoExport,
  } = useLumi()

  const videoRef = useRef<HTMLVideoElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const [selectedTextId, setSelectedTextId] = useState<string | null>(null)
  const [progress, setProgress] = useState<number | null>(null)

  const apply = useCallback(
    (edits: VideoEdits) => updateVideoEdits(project.id, edits),
    [project.id, updateVideoEdits]
  )

  const history = useEditHistory(project.id, project.edits, apply)
  const edits = project.edits
  const duration = project.duration ?? 0

  const set = useCallback(
    (nextEdits: VideoEdits) => {
      history.commit(nextEdits)
      recordToolUsed(`video-${videoTool}`)
    },
    [history.commit, videoTool, recordToolUsed]
  )

  const handleExport = async () => {
    if (!canExportVideo()) {
      toast.error(
        'Tu navegador no permite exportar video. Prueba con Chrome, Edge o Firefox.'
      )
      return
    }

    if (!duration) return

    videoRef.current?.pause()

    const controller = new AbortController()
    abortRef.current = controller
    setProgress(0)

    try {
      const { blob, extension } = await exportVideo(
        project.src,
        edits,
        duration,
        setProgress,
        controller.signal
      )

      downloadBlob(blob, `${project.name}-lumi.${extension}`)
      recordVideoExport(project.id)

      toast.success('¡Video exportado!')
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        toast.error('No se pudo exportar el video')
      }
    } finally {
      abortRef.current = null
      setProgress(null)
    }
  }

  const panel = {
    trim: (
      <TrimPanel
        edits={edits}
        duration={duration}
        videoRef={videoRef}
        onChange={set}
      />
    ),
    speed: <SpeedPanel edits={edits} onChange={set} />,
    filters: (
      <FilterPanel
        active={edits.filterId}
        onSelect={(filterId) => set({ ...edits, filterId })}
      />
    ),
    adjust: (
      <AdjustPanel
        value={edits.adjustments}
        onChange={(adjustments) => set({ ...edits, adjustments })}
      />
    ),
    enhance: (
  <EnhancePanel
    value={edits.adjustments}
    onChange={(values) =>
      set({
        ...edits,
        adjustments: {
          ...edits.adjustments,
          ...values,
        },
      })
    }
  />
),
text: (
      <TextPanel
        texts={edits.texts}
        selectedId={selectedTextId}
        onSelect={setSelectedTextId}
        onChange={(texts) => set({ ...edits, texts })}
      />
    ),
    audio: <AudioPanel edits={edits} onChange={set} />,
  }[videoTool]

  const exporting = progress !== null

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <EditorHeader
        project={project}
        onBack={() => closeProject('video')}
        history={history}
        actions={
          exporting ? (
            <div className="flex h-10 items-center gap-3 rounded-full border border-border bg-card pl-4 pr-1 shadow-soft">
              <Loader2
                className="size-4 animate-spin text-primary"
                aria-hidden="true"
              />
              <span
                className="text-sm font-medium tabular-nums"
                role="status"
              >
                Exportando {Math.round((progress ?? 0) * 100)}%
              </span>
              <button
                type="button"
                onClick={() => abortRef.current?.abort()}
                aria-label="Cancelar exportación"
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleExport}
              disabled={!duration}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              <Download className="size-4" aria-hidden="true" />
              Exportar video
            </button>
          )
        }
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <VideoStage
          videoRef={videoRef}
          src={project.src}
          edits={edits}
          duration={duration}
          textInteractive={videoTool === 'text'}
          selectedTextId={selectedTextId}
          onSelectText={setSelectedTextId}
          onTextsChange={(texts) => set({ ...edits, texts })}
          onDuration={(d) =>
            Number.isFinite(d) && setVideoDuration(project.id, d)
          }
        />

        <aside
          aria-label="Panel de herramientas"
          className="flex w-full shrink-0 flex-col gap-5 rounded-[2rem] border border-border bg-card p-4 shadow-soft lg:w-[360px] lg:p-5"
        >
          <ToolTabs
            tabs={TABS}
            active={videoTool}
            onChange={setVideoTool}
          />

          <div role="tabpanel" className="px-1">
            {panel}
          </div>

          {exporting && (
            <p className="rounded-2xl bg-secondary px-4 py-3 text-xs text-secondary-foreground">
              La exportación reproduce el video en tiempo real para grabar todos tus cambios. Mantén esta pestaña abierta.
            </p>
          )}
        </aside>
      </div>
    </div>
  )
}
