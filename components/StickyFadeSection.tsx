'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

interface Props {
  id?: string
  /** Total scroll height of the wrapper in vh (default 200) */
  scrollVh?: number
  children: ReactNode
}

const NAVBAR = 56

export default function StickyFadeSection({ id, scrollVh = 200, children }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const onScroll = () => {
      const el = wrapperRef.current
      if (!el) return
      const scrolledPast = Math.max(0, -el.getBoundingClientRect().top)
      const stickyH = window.innerHeight - NAVBAR
      const totalScrollable = el.offsetHeight - stickyH
      // Fade starts at 45% of scrollable range, fully gone at 92%
      const fadeStart = totalScrollable * 0.45
      const fadeEnd   = totalScrollable * 0.92
      if (scrolledPast <= fadeStart) {
        setOpacity(1)
      } else {
        const p = (scrolledPast - fadeStart) / (fadeEnd - fadeStart)
        setOpacity(Math.max(0, 1 - p))
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={wrapperRef}
      id={id}
      style={{ height: `${scrollVh}vh`, position: 'relative' }}
    >
      <div style={{
        position: 'sticky',
        top: `${NAVBAR}px`,
        height: `calc(100vh - ${NAVBAR}px)`,
        background: 'var(--bg)',
        opacity,
      }}>
        {children}
      </div>
    </div>
  )
}
