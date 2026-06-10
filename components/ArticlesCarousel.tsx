'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Article } from '@/lib/types'
import { formatShortDate } from '@/lib/utils'

const CARD_WIDTH = 260
const CARD_HEIGHT = 400
const GAP = 20
const CARD_STEP = CARD_WIDTH + GAP

interface Props {
  articles: Partial<Article>[]
}

export default function ArticlesCarousel({ articles }: Props) {
  const isOverCardsRef = useRef(false)
  const panOffsetRef = useRef(0)
  const [panOffset, setPanOffset] = useState(0)
  const [initX, setInitX] = useState(0)
  const [ready, setReady] = useState(false)

  const n = articles.length
  const MAX_PAN = Math.max(0, (n - 1) * CARD_STEP)
  const activeIndex = Math.min(Math.round(panOffset / CARD_STEP), n - 1)

  // Center first card on mount
  useEffect(() => {
    const update = () => setInitX(window.innerWidth / 2 - CARD_WIDTH / 2)
    update()
    setReady(true)
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Wheel pan — only when cursor is over card area
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!isOverCardsRef.current) return
      const next = Math.max(0, Math.min(MAX_PAN, panOffsetRef.current + e.deltaY * 0.85))
      if (next === panOffsetRef.current) return
      e.preventDefault()
      panOffsetRef.current = next
      setPanOffset(next)
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [MAX_PAN])

  const translateX = initX - panOffset

  return (
    <section style={{
      height: '100%',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '80px 0',
      overflow: 'hidden',
    }}>
      {/* Header — centered via textAlign */}
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <h2 style={{
          fontSize: 'clamp(28px, 3.5vw, 40px)',
          fontWeight: 800, letterSpacing: '-0.02em',
          color: 'var(--text)',
        }}>
          Artikel Terbaru
        </h2>
      </div>

      {/* Cards — transform only, no flex centering interference */}
      <div
        onMouseEnter={() => { isOverCardsRef.current = true }}
        onMouseLeave={() => { isOverCardsRef.current = false }}
        style={{
          display: 'flex',
          gap: `${GAP}px`,
          transform: `translateX(${translateX}px)`,
          transition: 'transform 0.1s ease-out',
          alignItems: 'center',
          opacity: ready ? 1 : 0,
          padding: '40px 0',
          cursor: 'grab',
          width: 'max-content',
        }}
      >
        {articles.map((article, i) => {
          const isActive = i === activeIndex
          return (
            <Link
              key={article.id}
              href={`/artikel/${article.slug}`}
              style={{
                display: 'block',
                textDecoration: 'none',
                flexShrink: 0,
                width: `${CARD_WIDTH}px`,
                height: `${CARD_HEIGHT}px`,
                transform: isActive ? 'scale(1.28)' : 'scale(0.85)',
                transition: 'transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1)',
              }}
            >
              <article style={{
                width: '100%', height: '100%',
                background: 'var(--surface)',
                borderRadius: '24px',
                border: isActive ? '1.5px solid var(--red)' : '1px solid var(--border-strong)',
                boxShadow: isActive
                  ? '0 0 0 4px rgba(212,30,30,0.14), 0 28px 72px rgba(0,0,0,0.65)'
                  : '0 4px 20px rgba(0,0,0,0.25)',
                padding: '28px 24px',
                display: 'flex', flexDirection: 'column', gap: '12px',
                transition: 'border-color 0.35s ease, box-shadow 0.35s ease',
              }}>
                {article.badge && (
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '9px',
                    letterSpacing: '2px', textTransform: 'uppercase',
                    color: 'var(--red)',
                  }}>
                    {article.badge}
                  </div>
                )}
                <h3 style={{
                  fontSize: '15px', fontWeight: 700,
                  lineHeight: 1.4, letterSpacing: '-0.01em',
                  color: 'var(--text)', flex: 1,
                }}>
                  {article.title}
                </h3>
                {article.description && (
                  <p style={{
                    fontSize: '12px', lineHeight: 1.6,
                    color: 'var(--text-muted)',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical' as const,
                  }}>
                    {article.description}
                  </p>
                )}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingTop: '12px', borderTop: '1px solid var(--border)',
                  marginTop: 'auto',
                }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {article.published_at && (
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '9px',
                        letterSpacing: '1px', textTransform: 'uppercase',
                        color: 'var(--text-subtle)',
                      }}>
                        {formatShortDate(article.published_at)}
                      </span>
                    )}
                    {article.read_time && (
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '9px',
                        letterSpacing: '1px', textTransform: 'uppercase',
                        color: 'var(--text-subtle)',
                      }}>
                        {article.read_time}
                      </span>
                    )}
                  </div>
                  {article.urgensi && (
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {[1, 2, 3, 4, 5].map(j => (
                        <div key={j} style={{
                          width: '5px', height: '5px', borderRadius: '50%',
                          background: j <= (article.urgensi || 0) ? 'var(--red)' : 'var(--border-strong)',
                        }} />
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          )
        })}
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '32px', justifyContent: 'center' }}>
        {articles.map((_, i) => (
          <div key={i} style={{
            width: i === activeIndex ? '22px' : '6px',
            height: '6px', borderRadius: '3px',
            background: i === activeIndex ? 'var(--red)' : 'var(--border-strong)',
            transition: 'width 0.3s ease, background 0.3s ease',
          }} />
        ))}
      </div>

      {/* Scroll hint — shown when last card reached */}
      <div style={{
        marginTop: '24px', textAlign: 'center',
        fontFamily: 'var(--font-mono)', fontSize: '9px',
        letterSpacing: '2px', textTransform: 'uppercase',
        color: 'var(--text-subtle)',
        opacity: activeIndex === n - 1 ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}>
        Scroll ke bawah untuk lanjut ↓
      </div>
    </section>
  )
}
