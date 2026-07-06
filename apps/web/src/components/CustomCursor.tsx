'use client'

import { useRef, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { useCustomCursor } from '@/hooks/useCustomCursor'

function subscribe() {
  return () => {}
}

function getClientSnapshot() {
  return true
}

function getServerSnapshot() {
  return false
}

function CursorDot() {
  const cursorRef = useRef<HTMLDivElement>(null)
  useCustomCursor(cursorRef)

  return <div className="cursor" aria-hidden="true" ref={cursorRef} />
}

export default function CustomCursor() {
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)

  if (!mounted) return null

  return createPortal(<CursorDot />, document.body)
}
