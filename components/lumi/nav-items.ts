
import {
  FolderHeart,
  Heart,
  House,
  ImageIcon,
  Clapperboard,
  Gift,
  Crown,
  BookOpen,
  type LucideIcon,
} from 'lucide-react'
import type { ViewId } from '@/lib/lumi/types'

export const NAV_ITEMS: {
  id: ViewId
  label: string
  short: string
  icon: LucideIcon
}[] = [
  { id: 'home', label: 'Inicio', short: 'Inicio', icon: House },
  { id: 'projects', label: 'Mis proyectos', short: 'Proyectos', icon: FolderHeart },
  { id: 'photo', label: 'Editar fotos', short: 'Fotos', icon: ImageIcon },
  { id: 'video', label: 'Editar videos', short: 'Videos', icon: Clapperboard },
  { id: 'favorites', label: 'Favoritos', short: 'Favoritos', icon: Heart },
  { id: 'rewards', label: 'Lumi Rewards', short: 'Rewards', icon: Gift },
  { id: 'premium', label: 'Lumi Premium', short: 'Premium', icon: Crown },
  { id: 'tutorial', label: 'Tutorial', short: 'Tutorial', icon: BookOpen },
]
