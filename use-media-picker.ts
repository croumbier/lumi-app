'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'
import { ACCEPT, isValidFile, useLumi } from './store'
import type { MediaType } from './types'

/** Opens the native file dialog and creates a project from the chosen file. */
export function useMediaPicker() {
  const { createProject } = useLumi()

  const importFile = useCallback(
    (file: File, type: MediaType) => {
      if (!isValidFile(file, type)) {
        toast.error(type === 'photo' ? 'Elige un archivo de imagen' : 'Elige un archivo de video')
        return
      }
      createProject(file, type)
      toast.success(type === 'photo' ? 'Foto lista para editar' : 'Video listo para editar')
    },
    [createProject],
  )

  const pickFile = useCallback(
    (type: MediaType) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = ACCEPT[type]
      input.onchange = () => {
        const file = input.files?.[0]
        if (file) importFile(file, type)
      }
      input.click()
    },
    [importFile],
  )

  return { pickFile, importFile }
}
