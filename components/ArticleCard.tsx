import Link from 'next/link'
import { Article } from '@/lib/types'
import { formatShortDate } from '@/lib/utils'

interface ArticleCardProps {
  article: Article
  featured?: boolean
  index?: number
}

export default function ArticleCard({ article, featured = false, index = 0 }: ArticleCardProps) {
  if (featured) {
    return (
      <Link href={`/artikel/${article.slug}`} style={{
        background: 'var(--dark)', border: '1px solid rgba(255,255,255,0.06)',
        padding: '40px', position: 'relative', overflow: 'hidden',
        textDecoration: 'none', color: 'inherit', display: 'flex',
        flexDirection: 'column', justifyContent: 'flex-end', minHeight: '340px',
        transition: 'all 0.3s',
      }}>
        <span style={{
          fontFamily: 'var(--font-bebas)', fontSize: '96px',
          color: 'rgba(220,30,30,0.08)', lineHeight: 1,
          position: 'absolute', top: '16px', right: '20px',
        }}>01</span>
        {article.badge && (
          <span style={{
            fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '2px',
            textTransform: 'uppercase', color: 'var(--red)', marginBottom: '12px',
            display: 'block',
          }}>{article.badge}</span>
        )}
        <h3 style={{
          fontFamily: 'var(--font-bebas)', fontSize: '32px', lineHeight: 1.1,
          marginBottom: '12px', color: '#fff',
        }}>{article.title}</h3>
        {article.description && (
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: '16px' }}>
            {article.description}
          </p>
        )}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '1px', color: 'rgba(255,255,255,0.3)' }}>
            {article.published_at ? formatShortDate(article.published_at) : ''}
          </span>
          {article.read_time && (
            <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
              {article.read_time}
            </span>
          )}
        </div>
        <UrgensiStars value={article.urgensi} />
      </Link>
    )
  }

  return (
    <Link href={`/artikel/${article.slug}`} style={{
      background: 'var(--dark)', border: '1px solid rgba(255,255,255,0.06)',
      padding: '28px', textDecoration: 'none', color: 'inherit',
      display: 'flex', flexDirection: 'column', gap: '12px', transition: 'all 0.3s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {article.badge && (
          <span style={{
            fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '2px',
            textTransform: 'uppercase', color: 'var(--red)',
          }}>{article.badge}</span>
        )}
        <span style={{
          fontFamily: 'var(--font-bebas)', fontSize: '48px',
          color: 'rgba(220,30,30,0.08)', lineHeight: 1,
        }}>{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3 style={{
        fontFamily: 'var(--font-bebas)', fontSize: '22px', lineHeight: 1.15,
        color: '#fff',
      }}>{article.title}</h3>
      {article.description && (
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.55, flexGrow: 1 }}>
          {article.description}
        </p>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>
          {article.published_at ? formatShortDate(article.published_at) : ''}
        </span>
        <UrgensiStars value={article.urgensi} small />
      </div>
    </Link>
  )
}

function UrgensiStars({ value, small }: { value: number; small?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: '3px', marginTop: small ? 0 : '8px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{
          fontSize: small ? '8px' : '10px',
          color: i <= value ? 'var(--red)' : 'rgba(255,255,255,0.15)',
        }}>●</span>
      ))}
    </div>
  )
}
