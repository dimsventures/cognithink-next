import { createServiceClient } from '@/lib/supabase'
import { Article } from '@/lib/types'
import { formatDate, isHtmlContent } from '@/lib/utils'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NewsletterForm from '@/components/NewsletterForm'
import NeuralCanvas from '@/components/NeuralCanvas'
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
      <NeuralCanvas />
      <Navbar />
      <ViewTracker articleId={article.id} />

      {/* Read progress bar */}
      <ReadProgress />

      {/* Article header */}
      <div style={{ padding: '130px 40px 60px', position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '24px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>
          <Link href="/artikel" style={{ color: 'inherit', textDecoration: 'none' }}>Artikel</Link>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>
          <span>{article.badge}</span>
        </div>

        {article.badge && (
          <span style={{ display: 'inline-block', fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', padding: '5px 14px', border: '1px solid rgba(220,30,30,0.4)', color: 'var(--red)', marginBottom: '20px' }}>
            {article.badge}
          </span>
        )}

        <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 1, marginBottom: '20px', letterSpacing: '1px' }}>
          {article.title}
        </h1>

        {article.description && (
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-space-mono)', letterSpacing: '1px', borderLeft: '3px solid rgba(220,30,30,0.4)', paddingLeft: '16px', lineHeight: 1.6, marginBottom: '28px' }}>
            {article.description}
          </p>
        )}

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '1px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', flexWrap: 'wrap' }}>
          {article.published_at && <span>📅 {formatDate(article.published_at)}</span>}
          {article.read_time && <><span style={{ color: 'rgba(220,30,30,0.5)' }}>●</span><span>⏱ {article.read_time}</span></>}
          <span style={{ color: 'rgba(220,30,30,0.5)' }}>●</span>
          <span>✍ CogniThink</span>
          {article.view_count > 0 && <><span style={{ color: 'rgba(220,30,30,0.5)' }}>●</span><span>👁 {article.view_count} views</span></>}
        </div>

        {/* Urgensi */}
        <div style={{ display: 'flex', gap: '4px', marginTop: '20px', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginRight: '8px' }}>Urgensi</span>
          {[1,2,3,4,5].map(i => (
            <span key={i} style={{ fontSize: '12px', color: i <= article.urgensi ? 'var(--red)' : 'rgba(255,255,255,0.15)' }}>●</span>
          ))}
        </div>
      </div>

      {/* Article content */}
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 40px 80px', position: 'relative', zIndex: 1 }}>
        {isHtml ? (
          <div className="artikel-body" dangerouslySetInnerHTML={{ __html: article.content }} />
        ) : (
          <div className="artikel-body">
            <p style={{ whiteSpace: 'pre-wrap' }}>{article.content}</p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div style={{ marginTop: '64px', padding: '40px', background: 'rgba(220,30,30,0.06)', border: '1px solid rgba(220,30,30,0.2)' }}>
          <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '12px' }}>Newsletter</div>
          <h3 style={{ fontFamily: 'var(--font-bebas)', fontSize: '28px', marginBottom: '12px' }}>Jangan lewat artikel berikutnya</h3>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px', lineHeight: 1.6 }}>
            1 artikel penting per minggu, langsung ke inbox kamu.
          </p>
          <NewsletterForm compact />
        </div>
      </article>

      {/* Related articles */}
      {related.length > 0 && (
        <section style={{ padding: '60px 40px 80px', position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(26,26,26,0.4)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '32px' }}>
              Baca Juga
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {related.map((a, i) => (
                <Link key={a.id} href={`/artikel/${a.slug}`} style={{
                  padding: '24px', background: 'var(--dark)', border: '1px solid rgba(255,255,255,0.06)',
                  textDecoration: 'none', color: 'inherit', display: 'block',
                }}>
                  {a.badge && <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--red)', display: 'block', marginBottom: '8px' }}>{a.badge}</span>}
                  <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '18px', lineHeight: 1.2, color: '#fff' }}>{a.title}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  )
}

function ReadProgress() {
  return (
    <div id="read-progress" style={{
      position: 'fixed', top: 0, left: 0, height: '2px',
      background: 'linear-gradient(90deg, var(--red), var(--orange))',
      zIndex: 200, width: '0%', transition: 'width 0.1s linear',
    }} />
  )
}
