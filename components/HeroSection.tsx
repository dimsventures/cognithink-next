'use client'

import NewsletterForm from './NewsletterForm'

interface HeroSectionProps {
  articleCount: number | null
}

export default function HeroSection({ articleCount }: HeroSectionProps) {
  return (
    <section style={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      padding: '0 40px',
    }}>
      <div style={{ maxWidth: '640px' }}>
        <h1 style={{
          fontSize: 'clamp(48px, 6.5vw, 80px)',
          fontWeight: 800, lineHeight: 1.05,
          letterSpacing: '-0.03em',
          color: 'var(--text)', marginBottom: '24px',
        }}>
          Tumbuh di Era<br />
          <span style={{ color: 'var(--red)' }}>yang Berubah</span><br />
          Cepat
        </h1>

        <p style={{
          fontSize: '16px', lineHeight: 1.75,
          color: 'rgba(237, 235, 231, 0.65)', maxWidth: '480px',
          marginBottom: '36px',
        }}>
          AI, market, dan psikologi keputusan — tiga hal yang saling terhubung,
          dibahas jujur dan praktis di satu tempat.
        </p>

        <NewsletterForm />

        <div style={{
          display: 'flex', gap: '40px', marginTop: '48px',
          paddingTop: '32px', borderTop: '1px solid var(--border)',
        }}>
          {[
            { value: `${articleCount || 11}+`, label: 'Artikel' },
            { value: '3', label: 'Topik' },
            { value: '1×/minggu', label: 'Update' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '26px', color: 'var(--text)', lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '9px',
                letterSpacing: '2px', textTransform: 'uppercase',
                color: 'var(--text-subtle)', marginTop: '4px',
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
