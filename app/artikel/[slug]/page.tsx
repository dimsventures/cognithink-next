import { createServiceClient } from '@/lib/supabase'
import { Article } from '@/lib/types'
import { formatDate, isHtmlContent } from '@/lib/utils'
import Navbar from '@/components/Navbar'
import NewsletterForm from '@/components/NewsletterForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ViewTracker from './ViewTracker'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

async function getArticle(slug: string): Promise<Article | null> {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data
}

async function getRelatedArticles(currentId: number, badge: string | null): Promise<Article[]> {
  const supabase = createServiceClient()
  let query = supabase
    .from('articles')
    .select('id, slug, title, badge, description, urgensi, published_at, read_time, view_count, is_published, content, created_at, updated_at')
    .eq('is_published', true)
    .neq('id', currentId)
    .limit(3)

  if (badge) query = query.eq('badge', badge)

  const { data } = await query
  return data || []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: 'Artikel Tidak Ditemukan' }

  return {
    title: article.title,
    description: article.description || undefined,
    openGraph: {
      title: article.title,
      description: article.description || undefined,
      type: 'article',
      publishedTime: article.published_at || undefined,
    },
  }
}

export default async function ArtikelDetailPage({ params }: Props) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const related = await getRelatedArticles(article.id, article.badge)
  const isHtml = isHtmlContent(article.content)

  return (
    <>
      <Navbar />
      <ViewTracker articleId={article.id} />

      {/* Light reading zone */}
      <div data-theme="light" style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: '56px' }}>

        {/* Article */}
        <article style={{ maxWidth: '680px', margin: '0 auto', padding: '56px 24px 100px' }}>

          {/* Back + breadcrumb */}
          <div style={{ marginBottom: '40px' }}>
            <Link href="/artikel" style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px',
              letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}>
              ← Semua Artikel
            </Link>
          </div>

          {/* Category badge */}
          {article.badge && (
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px',
              letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--red)', marginBottom: '14px',
            }}>
              {article.badge}
            </div>
          )}

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(26px, 4vw, 38px)',
            fontWeight: 800, lineHeight: 1.2,
            letterSpacing: '-0.02em',
            color: 'var(--text)', marginBottom: '16px',
          }}>
            {article.title}
          </h1>

          {/* Description */}
          {article.description && (
            <p style={{
              fontSize: '17px', lineHeight: 1.65,
              color: 'var(--text-muted)', marginBottom: '24px',
            }}>
              {article.description}
            </p>
          )}

          {/* Meta */}
          <div style={{
            display: 'flex', gap: '20px', flexWrap: 'wrap',
            padding: '18px 0',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            marginBottom: '52px',
          }}>
            {article.published_at && (
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px',
                letterSpacing: '1px', textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}>
                {formatDate(article.published_at)}
              </span>
            )}
            {article.read_time && (
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px',
                letterSpacing: '1px', textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}>
                {article.read_time}
              </span>
            )}
            {article.view_count > 0 && (
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px',
                letterSpacing: '1px', textTransform: 'uppercase',
                color: 'var(--text-subtle)',
              }}>
                {article.view_count} views
              </span>
            )}
          </div>

          {/* Content */}
          <div className="reading-body">
            {isHtml ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <p style={{ whiteSpace: 'pre-wrap' }}>{article.content}</p>
            )}
          </div>

          {/* Newsletter CTA */}
          <div style={{
            marginTop: '72px', padding: '36px',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px',
              letterSpacing: '3px', textTransform: 'uppercase',
              color: 'var(--red)', marginBottom: '10px',
            }}>
              Newsletter
            </div>
            <h3 style={{
              fontSize: '18px', fontWeight: 700,
              color: 'var(--text)', marginBottom: '8px',
            }}>
              Artikel baru tiap minggu.
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Subscribe dan jangan ketinggalan.
            </p>
            <NewsletterForm />
          </div>
        </article>

        {/* Related articles */}
        {related.length > 0 && (
          <div style={{
            borderTop: '1px solid var(--border)',
            padding: '56px 24px 80px',
          }}>
            <div style={{ maxWidth: '680px', margin: '0 auto' }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px',
                letterSpacing: '3px', textTransform: 'uppercase',
                color: 'var(--text-muted)', marginBottom: '28px',
              }}>
                Baca Juga
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1px', background: 'var(--border)',
              }}>
                {related.map(a => (
                  <Link key={a.id} href={`/artikel/${a.slug}`} style={{
                    padding: '20px', background: 'var(--surface)',
                    display: 'block', transition: 'background 0.15s',
                  }}>
                    {a.badge && (
                      <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: '9px',
                        letterSpacing: '2px', textTransform: 'uppercase',
                        color: 'var(--red)', marginBottom: '8px',
                      }}>
                        {a.badge}
                      </div>
                    )}
                    <div style={{
                      fontSize: '14px', fontWeight: 600,
                      lineHeight: 1.4, color: 'var(--text)',
                    }}>
                      {a.title}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}
