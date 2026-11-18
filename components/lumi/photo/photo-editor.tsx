
'use client'

import {
  Crop,
  Download,
  Eye,
  Loader2,
  RotateCw,
  SlidersHorizontal,
  Type,
  Wand2,
  Sparkles,
} from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { useEditHistory } from '@/lib/lumi/hooks'
import { downloadBlob, exportPhoto } from '@/lib/lumi/render'
import { useLumi } from '@/lib/lumi/store'
import type {
  PhotoEdits,
  PhotoProject,
  PhotoToolId,
} from '@/lib/lumi/types'
import { AdjustPanel } from '../editor/adjust-panel'
import { EditorHeader } from '../editor/editor-header'
import { FilterPanel } from '../editor/filter-panel'
import { TextPanel } from '../editor/text-panel'
import { ToolTabs, type ToolTab } from '../editor/tool-tabs'
import { UploadDropzone } from '../editor/upload-dropzone'
import { CropPanel, RotatePanel } from './geometry-panels'
import { PhotoStage } from './photo-stage'
import { EnhancePanel } from './enhance-panel'

const TABS: ToolTab<PhotoToolId>[] = [
  { id: 'filters', label: 'Filtros', icon: Wand2 },
  { id: 'adjust', label: 'Ajustes', icon: SlidersHorizontal },
  { id: 'enhance', label: 'Mejorar', icon: Sparkles },
  { id: 'crop', label: 'Recortar', icon: Crop },
  { id: 'rotate', label: 'Rotar', icon: RotateCw },
  { id: 'text', label: 'Texto', icon: Type },
]

export function PhotoEditor() {
  const { projects, activePhotoId } = useLumi()

  const project = projects.find(
    (p): p is PhotoProject =>
      p.id === activePhotoId && p.type === 'photo'
  )

  if (!project) return <UploadDropzone type="photo" />

  return <PhotoWorkspace project={project} />
}

function PhotoWorkspace({ project }: { project: PhotoProject }) {
  const {
    photoTool,
    setPhotoTool,
    updatePhotoEdits,
    closeProject,
    recordToolUsed,
    recordPhotoExport,
  } = useLumi()

  const [selectedTextId, setSelectedTextId] = useState<string | null>(null)
  const [showOriginal, setShowOriginal] = useState(false)
  const [exporting, setExporting] = useState(false)

  const apply = useCallback(
    (edits: PhotoEdits) => updatePhotoEdits(project.id, edits),
    [project.id, updatePhotoEdits]
  )

  const history = useEditHistory(project.id, project.edits, apply)
  const edits = project.edits

  const set = useCallback(
    (nextEdits: PhotoEdits) => {
      history.commit(nextEdits)
      recordToolUsed(`photo-${photoTool}`)
    },
    [history.commit, photoTool, recordToolUsed]
  )

  const handleExport = async () => {
    setExporting(true)

    try {
      const blob = await exportPhoto(project.src, edits)

      downloadBlob(blob, `${project.name}-lumi.png`)
      recordPhotoExport(project.id)

      toast.success('¡Foto descargada!')
    } catch {
      toast.error('No se pudo exportar la foto')
    } finally {
      setExporting(false)
    }
  }

  const panel = {
    filters: (
      <FilterPanel
        active={edits.filterId}
        previewSrc={project.src}
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
    crop: <CropPanel edits={edits} onChange={set} />,
    rotate: <RotatePanel edits={edits} onChange={set} />,
    text: (
      <TextPanel
        texts={edits.texts}
        selectedId={selectedTextId}
        onSelect={setSelectedTextId}
        onChange={(texts) => set({ ...edits, texts })}
      />
    ),
  }[photoTool]

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <EditorHeader
        project={project}
        onBack={() => closeProject('photo')}
        history={history}
        actions={
          <>
            <button
              type="button"
              onPointerDown={() => setShowOriginal(true)}
              onPointerUp={() => setShowOriginal(false)}
              onPointerLeave={() => setShowOriginal(false)}
              onKeyDown={(e) => e.key === ' ' && setShowOriginal(true)}
              onKeyUp={() => setShowOriginal(false)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-muted-foreground shadow-soft hover:text-foreground"
            >
              <Eye className="size-4" aria-hidden="true" />
              <span>Mantén para comparar</span>
            </button>

            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 disabled:opacity-70"
            >
              {exporting ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Download className="size-4" aria-hidden="true" />
              )}
              Descargar
            </button>
          </>
        }
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <PhotoStage
          src={project.src}
          edits={edits}
          showOriginal={showOriginal}
          textInteractive={photoTool === 'text'}
          selectedTextId={selectedTextId}
          onSelectText={setSelectedTextId}
          onTextsChange={(texts) => set({ ...edits, texts })}
        />

        <aside
          aria-label="Panel de herramientas"
          className="flex w-full shrink-0 flex-col gap-5 rounded-[2rem] border border-border bg-card p-4 shadow-soft lg:w-[360px] lg:p-5"
        >
          <ToolTabs
            tabs={TABS}
            active={photoTool}
            onChange={setPhotoTool}
          />

          <div role="tabpanel" className="px-1">
            {panel}
          </div>
        </aside>
      </div>
    </div>
  )
}
