'use client'

import dynamic from 'next/dynamic'
import NewsletterForm from './NewsletterForm'

const BrainVisualization = dynamic(() => import('./BrainVisualization'), { ssr: false })

interface HeroSectionProps {
  articleCount: number | null
}

export default function HeroSection({ articleCount }: HeroSectionProps) {
  return (
    <section style={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      padding: '0 clamp(24px, 5vw, 80px)',
      maxWidth: '1280px',
      margin: '0 auto',
      width: '100%',
      gap: '48px',
    }}>

      {/* ── Left: text content ─────────────────────────────── */}
      <div style={{ flex: '1 1 0', minWidth: 0, maxWidth: '560px' }}>

        {/* Tag badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          marginBottom: '36px',
          padding: '5px 14px',
          border: '1px solid rgba(212, 30, 30, 0.35)',
          background: 'rgba(212, 30, 30, 0.07)',
        }}>
          <span style={{
            display: 'inline-block', width: '6px', height: '6px',
            borderRadius: '50%', background: '#D41E1E',
            boxShadow: '0 0 8px #D41E1E',
            animation: 'pulse-dot 2s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px',
            letterSpacing: '2px', textTransform: 'uppercase',
            color: 'rgba(237,235,231,0.55)',
          }}>
            Newsletter Mingguan
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(44px, 5.5vw, 74px)',
          fontWeight: 800, lineHeight: 1.04,
          letterSpacing: '-0.03em',
          color: '#EDEBE7',
          marginBottom: '24px',
        }}>
          Tumbuh di Era<br />
          <span style={{ color: '#D41E1E' }}>yang Berubah</span><br />
          Cepat
        </h1>

        {/* Description */}
        <p style={{
          fontSize: '16px', lineHeight: 1.8,
          color: 'rgba(237, 235, 231, 0.52)',
          maxWidth: '420px',
          marginBottom: '40px',
          letterSpacing: '0.01em',
        }}>
          AI, market, dan psikologi keputusan —<br />
          tiga hal yang saling terhubung, dibahas<br />
          jujur dan praktis di satu tempat.
        </p>

        {/* Newsletter form */}
        <NewsletterForm />

        {/* Stats */}
        <div style={{
          display: 'flex', gap: '0', marginTop: '52px',
          paddingTop: '28px', borderTop: '1px solid rgba(255,255,255,0.07)',
        }}>
          {[
            { value: `${articleCount || 11}+`, label: 'Artikel' },
            { value: '3', label: 'Topik' },
            { value: '1×/minggu', label: 'Update' },
          ].map((s, i) => (
            <div key={s.label} style={{
              flex: 1,
              paddingRight: '24px',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              paddingLeft: i > 0 ? '24px' : '0',
            }}>
              <div style={{
                fontFamily: 'var(--font-bebas)', fontSize: '28px',
                color: '#EDEBE7', lineHeight: 1,
              }}>
                {s.value}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '9px',
                letterSpacing: '2px', textTransform: 'uppercase',
                color: 'rgba(237,235,231,0.3)', marginTop: '6px',
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: brain visualization ─────────────────────── */}
      <div style={{
        flex: '1 1 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        minWidth: 0,
      }}>
        {/* Ambient backdrop glow */}
        <div style={{
          position: 'absolute',
          width: '420px', height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,30,30,0.12) 0%, rgba(212,30,30,0.04) 50%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />

        <BrainVisualization />
      </div>

    </section>
  )
}
