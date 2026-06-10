import Link from 'next/link'
import { Article } from '@/lib/types'
import { formatShortDate } from '@/lib/utils'

interface ArticleCardProps {
  article: Partial<Article>
  featured?: boolean
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <Link href={`/artikel/${article.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
      <article className="article-card" style={{
        padding: featured ? '32px' : '24px',
        display: 'flex', flexDirection: 'column', gap: '14px',
        height: '100%', minHeight: featured ? '240px' : '180px',
      }}>
        {/* Badge */}
        {article.badge && (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px',
            letterSpacing: '2px', textTransform: 'uppercase',
            color: 'var(--red)',
          }}>
            {article.badge}
          </div>
        )}

        {/* Title */}
        <h3 style={{
          fontSize: featured ? '20px' : '15px',
          fontWeight: 700, lineHeight: 1.35,
          letterSpacing: '-0.01em', color: 'var(--text)',
          flex: 1,
        }}>
          {article.title}
        </h3>

        {/* Description */}
        {featured && article.description && (
          <p style={{
            fontSize: '13px', lineHeight: 1.65,
            color: 'var(--text-muted)',
          }}>
            {article.description}
          </p>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: '14px', borderTop: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', gap: '14px' }}>
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

          {/* Urgency dots */}
          {article.urgensi && (
            <div style={{ display: 'flex', gap: '3px' }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: i <= (article.urgensi || 0) ? 'var(--red)' : 'var(--border-strong)',
                }} />
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
