'use client'

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'

export function useElementWidth<T extends HTMLElement>(ref: RefObject<T | null>) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return width
}

/**
 * Undo/redo history for an edits object. Rapid successive changes (e.g. dragging a slider)
 * are merged into a single history step.
 */
export function useEditHistory<T>(key: string | null, current: T | null, apply: (value: T) => void) {
  const past = useRef<T[]>([])
  const future = useRef<T[]>([])
  const lastCommit = useRef(0)
  const [, force] = useState(0)

  useEffect(() => {
    past.current = []
    future.current = []
    force((n) => n + 1)
  }, [key])

  const commit = useCallback(
    (next: T) => {
      if (current === null) return
      const now = Date.now()
      if (now - lastCommit.current > 500 || past.current.length === 0) {
        past.current = [...past.current.slice(-49), current]
      }
      lastCommit.current = now
      future.current = []
      apply(next)
      force((n) => n + 1)
    },
    [current, apply],
  )

  const undo = useCallback(() => {
    const prev = past.current.pop()
    if (prev === undefined || current === null) return
    future.current.push(current)
    lastCommit.current = 0
    apply(prev)
    force((n) => n + 1)
  }, [current, apply])

  const redo = useCallback(() => {
    const next = future.current.pop()
    if (next === undefined || current === null) return
    past.current.push(current)
    lastCommit.current = 0
    apply(next)
    force((n) => n + 1)
  }, [current, apply])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('input, textarea, [contenteditable="true"]')) return
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'z') return
      e.preventDefault()
      if (e.shiftKey) redo()
      else undo()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo])

  return { commit, undo, redo, canUndo: past.current.length > 0, canRedo: future.current.length > 0 }
}
