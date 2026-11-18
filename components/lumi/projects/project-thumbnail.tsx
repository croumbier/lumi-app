import { buildCssFilter } from '@/lib/lumi/filters'
import type { Project } from '@/lib/lumi/types'
import { cn } from '@/lib/utils'

export function ProjectThumbnail({ project, className }: { project: Project; className?: string }) {
  const filter = buildCssFilter(project.edits.filterId, project.edits.adjustments)

  if (project.type === 'video') {
    return (
      <video
        src={`${project.src}#t=${project.edits.trimStart || 0.1}`}
        preload="metadata"
        muted
        playsInline
        aria-hidden="true"
        className={cn('size-full object-cover', className)}
        style={{ filter }}
      />
    )
  }

  const { rotation, flipH, flipV } = project.edits
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={project.src}
      alt=""
      className={cn('size-full object-cover', className)}
      style={{
        filter,
        transform: `rotate(${rotation}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
      }}
    />
  )
}
