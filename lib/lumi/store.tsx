
'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  createDefaultPhotoEdits,
  createDefaultVideoEdits,
} from './filters'
import { baseName, createId } from './render'
import type {
  MediaType,
  PhotoEdits,
  PhotoToolId,
  Project,
  VideoEdits,
  VideoToolId,
  ViewId,
  LumiPlan,
  SubscriptionPeriod,
  LumiSubscription,
} from './types'

const HOUR = 3600_000

export type LumiMissionId = 'photo' | 'video' | 'creative'

export interface LumiRewardsProgress {
  completed: LumiMissionId[]
  usedTools: string[]
  editedPhotos: string[]
  editedVideos: string[]
}

const REWARDS_STORAGE_KEY = 'lumi-rewards-progress'
const SUBSCRIPTION_STORAGE_KEY = 'lumi-subscription-plan'

const DEFAULT_SUBSCRIPTION: LumiSubscription = {
  plan: 'free',
  period: 'monthly',
  selectedAt: 0,
}

function loadRewardsProgress(): LumiRewardsProgress {
  const emptyProgress: LumiRewardsProgress = {
    completed: [],
    usedTools: [],
    editedPhotos: [],
    editedVideos: [],
  }

  if (typeof window === 'undefined') return emptyProgress

  try {
    const saved = localStorage.getItem(REWARDS_STORAGE_KEY)
    if (!saved) return emptyProgress

    const parsed = JSON.parse(saved)

    return {
      completed: Array.isArray(parsed.completed)
        ? parsed.completed.filter((id: string) =>
            ['photo', 'video', 'creative'].includes(id)
          )
        : [],
      usedTools: Array.isArray(parsed.usedTools)
        ? parsed.usedTools.filter(
            (tool: string) => typeof tool === 'string'
          )
        : [],
      editedPhotos: Array.isArray(parsed.editedPhotos)
        ? parsed.editedPhotos.filter(
            (id: string) => typeof id === 'string'
          )
        : [],
      editedVideos: Array.isArray(parsed.editedVideos)
        ? parsed.editedVideos.filter(
            (id: string) => typeof id === 'string'
          )
        : [],
    }
  } catch {
    return emptyProgress
  }
}

function sampleProjects(): Project[] {
  const now = Date.now()

  const samples = [
    {
      name: 'Campo de lavanda',
      src: '/samples/lavender-field.png',
      filterId: 'lilac',
      age: 2 * HOUR,
      favorite: true,
    },
    {
      name: 'Café de domingo',
      src: '/samples/cafe-moment.png',
      filterId: 'blush',
      age: 26 * HOUR,
      favorite: false,
    },
    {
      name: 'Atardecer urbano',
      src: '/samples/city-dusk.png',
      filterId: 'dream',
      age: 72 * HOUR,
      favorite: false,
    },
  ]

  return samples.map((s) => ({
    id: createId(),
    type: 'photo' as const,
    name: s.name,
    src: s.src,
    fileName: s.src.split('/').pop() ?? 'foto.png',
    createdAt: now - s.age,
    updatedAt: now - s.age,
    favorite: s.favorite,
    edits: {
      ...createDefaultPhotoEdits(),
      filterId: s.filterId,
    },
  }))
}

interface LumiState {
  view: ViewId
  projects: Project[]
  activePhotoId: string | null
  activeVideoId: string | null
  photoTool: PhotoToolId
  videoTool: VideoToolId
  navigate: (view: ViewId) => void
  createProject: (file: File, type: MediaType) => string
  openProject: (id: string) => void
  closeProject: (type: MediaType) => void
  updatePhotoEdits: (id: string, edits: PhotoEdits) => void
  updateVideoEdits: (id: string, edits: VideoEdits) => void
  setVideoDuration: (id: string, duration: number) => void
  renameProject: (id: string, name: string) => void
  toggleFavorite: (id: string) => void
  deleteProject: (id: string) => void
  setPhotoTool: (tool: PhotoToolId) => void
  setVideoTool: (tool: VideoToolId) => void
  rewardsProgress: LumiRewardsProgress
  recordToolUsed: (tool: string) => void
  recordPhotoExport: (id: string) => void
  recordVideoExport: (id: string) => void
  subscription: LumiSubscription
  selectPlan: (plan: LumiPlan, period: SubscriptionPeriod) => void
}

const LumiContext = createContext<LumiState | null>(null)

export function LumiProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>('home')
  const [projects, setProjects] = useState<Project[]>(sampleProjects)
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null)
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)
  const [photoTool, setPhotoTool] = useState<PhotoToolId>('filters')
  const [videoTool, setVideoTool] = useState<VideoToolId>('trim')
  const [rewardsProgress, setRewardsProgress] =
    useState<LumiRewardsProgress>(loadRewardsProgress)

  const [subscription, setSubscription] =
    useState<LumiSubscription>(DEFAULT_SUBSCRIPTION)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY)
      if (!saved) return

      const parsed = JSON.parse(saved)

      if (
        ['free', 'premium', 'pro'].includes(parsed.plan) &&
        ['monthly', 'yearly'].includes(parsed.period) &&
        typeof parsed.selectedAt === 'number'
      ) {
        setSubscription(parsed as LumiSubscription)
      }
    } catch {
      console.warn('No se pudo cargar el plan de Lumi.')
    }
  }, [])

  const selectPlan = useCallback(
    (plan: LumiPlan, period: SubscriptionPeriod) => {
      const nextSubscription: LumiSubscription = {
        plan,
        period,
        selectedAt: Date.now(),
      }

      setSubscription(nextSubscription)

      try {
        localStorage.setItem(
          SUBSCRIPTION_STORAGE_KEY,
          JSON.stringify(nextSubscription)
        )
      } catch {
        console.warn('No se pudo guardar el plan de Lumi.')
      }
    },
    []
  )

  const saveRewards = useCallback(
    (updater: (previous: LumiRewardsProgress) => LumiRewardsProgress) => {
      setRewardsProgress((previous) => {
        const next = updater(previous)

        try {
          localStorage.setItem(
            REWARDS_STORAGE_KEY,
            JSON.stringify(next)
          )
        } catch {
          console.warn('No se pudo guardar el progreso de Lumi Rewards.')
        }

        return next
      })
    },
    []
  )

  const recordToolUsed = useCallback(
    (tool: string) => {
      saveRewards((previous) => {
        if (previous.usedTools.includes(tool)) return previous

        const usedTools = [...previous.usedTools, tool]
        const completed = [...previous.completed]

        if (
          usedTools.length >= 3 &&
          !completed.includes('creative')
        ) {
          completed.push('creative')
        }

        return {
          ...previous,
          usedTools,
          completed,
        }
      })
    },
    [saveRewards]
  )

  const recordPhotoExport = useCallback(
    (id: string) => {
      saveRewards((previous) => {
        if (
          !previous.editedPhotos.includes(id) ||
          previous.completed.includes('photo')
        ) {
          return previous
        }

        return {
          ...previous,
          completed: [...previous.completed, 'photo'],
        }
      })
    },
    [saveRewards]
  )

  const recordVideoExport = useCallback(
    (id: string) => {
      saveRewards((previous) => {
        if (
          !previous.editedVideos.includes(id) ||
          previous.completed.includes('video')
        ) {
          return previous
        }

        return {
          ...previous,
          completed: [...previous.completed, 'video'],
        }
      })
    },
    [saveRewards]
  )

  const navigate = useCallback((next: ViewId) => {
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const patchProject = useCallback(
    (id: string, patch: (p: Project) => Project) => {
      setProjects((list) =>
        list.map((p) =>
          p.id === id
            ? { ...patch(p), updatedAt: Date.now() }
            : p
        )
      )
    },
    []
  )

  const createProject = useCallback(
    (file: File, type: MediaType) => {
      const id = createId()
      const now = Date.now()

      const base = {
        id,
        name:
          baseName(file.name) ||
          (type === 'photo' ? 'Nueva foto' : 'Nuevo video'),
        src: URL.createObjectURL(file),
        fileName: file.name,
        createdAt: now,
        updatedAt: now,
        favorite: false,
      }

      const project: Project =
        type === 'photo'
          ? {
              ...base,
              type: 'photo',
              edits: createDefaultPhotoEdits(),
            }
          : {
              ...base,
              type: 'video',
              edits: createDefaultVideoEdits(),
            }

      setProjects((list) => [project, ...list])

      if (type === 'photo') setActivePhotoId(id)
      else setActiveVideoId(id)

      navigate(type)
      return id
    },
    [navigate]
  )

  const openProject = useCallback(
    (id: string) => {
      const project = projects.find((p) => p.id === id)
      if (!project) return

      if (project.type === 'photo') setActivePhotoId(id)
      else setActiveVideoId(id)

      navigate(project.type)
    },
    [projects, navigate]
  )

  const closeProject = useCallback((type: MediaType) => {
    if (type === 'photo') setActivePhotoId(null)
    else setActiveVideoId(null)
  }, [])

  const updatePhotoEdits = useCallback(
    (id: string, edits: PhotoEdits) => {
      patchProject(id, (p) =>
        p.type === 'photo' ? { ...p, edits } : p
      )

      saveRewards((previous) => ({
        ...previous,
        editedPhotos: previous.editedPhotos.includes(id)
          ? previous.editedPhotos
          : [...previous.editedPhotos, id],
      }))
    },
    [patchProject, saveRewards]
  )

  const updateVideoEdits = useCallback(
    (id: string, edits: VideoEdits) => {
      patchProject(id, (p) =>
        p.type === 'video' ? { ...p, edits } : p
      )

      saveRewards((previous) => ({
        ...previous,
        editedVideos: previous.editedVideos.includes(id)
          ? previous.editedVideos
          : [...previous.editedVideos, id],
      }))
    },
    [patchProject, saveRewards]
  )

  const setVideoDuration = useCallback(
    (id: string, duration: number) => {
      setProjects((list) =>
        list.map((p) =>
          p.id === id && p.type === 'video'
            ? { ...p, duration }
            : p
        )
      )
    },
    []
  )

  const renameProject = useCallback(
    (id: string, name: string) =>
      patchProject(id, (p) => ({
        ...p,
        name: name.trim() || p.name,
      })),
    [patchProject]
  )

  const toggleFavorite = useCallback((id: string) => {
    setProjects((list) =>
      list.map((p) =>
        p.id === id ? { ...p, favorite: !p.favorite } : p
      )
    )
  }, [])

  const deleteProject = useCallback((id: string) => {
    setProjects((list) => {
      const target = list.find((p) => p.id === id)
      if (target?.src.startsWith('blob:')) {
        URL.revokeObjectURL(target.src)
      }
      return list.filter((p) => p.id !== id)
    })

    setActivePhotoId((current) => (current === id ? null : current))
    setActiveVideoId((current) => (current === id ? null : current))
  }, [])

  const value = useMemo<LumiState>(
    () => ({
      view,
      projects,
      activePhotoId,
      activeVideoId,
      photoTool,
      videoTool,
      navigate,
      createProject,
      openProject,
      closeProject,
      updatePhotoEdits,
      updateVideoEdits,
      setVideoDuration,
      renameProject,
      toggleFavorite,
      deleteProject,
      setPhotoTool,
      setVideoTool,
      rewardsProgress,
      recordToolUsed,
      recordPhotoExport,
      recordVideoExport,
      subscription,
      selectPlan,
    }),
    [
      view,
      projects,
      activePhotoId,
      activeVideoId,
      photoTool,
      videoTool,
      navigate,
      createProject,
      openProject,
      closeProject,
      updatePhotoEdits,
      updateVideoEdits,
      setVideoDuration,
      renameProject,
      toggleFavorite,
      deleteProject,
      rewardsProgress,
      recordToolUsed,
      recordPhotoExport,
      recordVideoExport,
      subscription,
      selectPlan,
    ]
  )

  return (
    <LumiContext.Provider value={value}>
      {children}
    </LumiContext.Provider>
  )
}

export function useLumi() {
  const ctx = useContext(LumiContext)

  if (!ctx) {
    throw new Error('useLumi must be used within LumiProvider')
  }

  return ctx
}

export const ACCEPT: Record<MediaType, string> = {
  photo: 'image/png,image/jpeg,image/webp,image/gif,image/avif',
  video: 'video/mp4,video/webm,video/quicktime,video/ogg',
}

export function isValidFile(file: File, type: MediaType) {
  return type === 'photo'
    ? file.type.startsWith('image/')
    : file.type.startsWith('video/')
}
