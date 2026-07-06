'use client'

import { RefObject, useEffect } from 'react'

const INTERACTIVE_SELECTOR =
  '.magnet, button, a, [role="button"], input, textarea, select, .zone-path, .zone-tap-hint-hit'

function targetAtPoint(x: number, y: number): Element | null {
  const stack = document.elementsFromPoint(x, y)
  for (const el of stack) {
    if (el.classList.contains('cursor')) continue
    return el
  }
  return null
}

export function useCustomCursor(cursorRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const mq = window.matchMedia('(pointer: fine)')

    const syncEnabled = () => {
      const enabled = mq.matches
      cursor.style.display = enabled ? '' : 'none'
      document.body.classList.toggle('has-custom-cursor', enabled)
      return enabled
    }

    if (!syncEnabled()) {
      const onChange = () => syncEnabled()
      mq.addEventListener('change', onChange)
      return () => {
        mq.removeEventListener('change', onChange)
        document.body.classList.remove('has-custom-cursor')
      }
    }

    const onMove = (event: MouseEvent) => {
      cursor.style.left = `${event.clientX}px`
      cursor.style.top = `${event.clientY}px`

      const el = targetAtPoint(event.clientX, event.clientY)
      const isActive = !!el?.closest(INTERACTIVE_SELECTOR)
      cursor.classList.toggle('is-active', isActive)
    }

    const onChange = () => syncEnabled()
    mq.addEventListener('change', onChange)
    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      mq.removeEventListener('change', onChange)
      window.removeEventListener('mousemove', onMove)
      document.body.classList.remove('has-custom-cursor')
    }
  }, [cursorRef])
}
