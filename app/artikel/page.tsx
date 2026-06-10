import { createServiceClient } from '@/lib/supabase'
import { Article } from '@/lib/types'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import NeuralCanvas from '@/components/NeuralCanvas'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Semua Artikel',
  description: 'Kumpulan artikel tentang AI, trading, dan psikologi keputusan dari CogniThink.',
}

export const revalidate = 3600

const BADGES = ['Semua', 'Artificial Intelligence', 'Trading', 'Psychology', 'Personal Finance']

interface Props {
  searchParams: Promise<{ badge?: string; page?: string }>
}

async function getArticles(badge?: string): Promise<Article[]> {
  const supabase = createServiceClient()
  let query = supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (badge && badge !== 'Semua') {
    query = query.eq('badge', badge)
  }

  const { data } = await query
  return data || []
}

export default async function ArtikelPage({ searchParams }: Props) {
  const params = await searchParams
  const activeBadge = params.badge || 'Semua'
  const articles = await getArticles(activeBadge === 'Semua' ? undefined : activeBadge)
  const [featured, ...rest] = articles

  return (
    <>
      <NeuralCanvas />
      <Navbar />

      {/* Header */}
      <div style={{ padding: '130px 40px 60px', position: 'relative', zIndex: 1, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '12px' }}>
            Knowledge Base
          </div>
          <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(48px, 7vw, 80px)', lineHeight: 1, marginBottom: '16px' }}>
            SEMUA <span style={{ color: 'var(--red)' }}>ARTIKEL</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', maxWidth: '480px' }}>
            {articles.length} artikel tentang AI, market, dan psikologi keputusan.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div style={{ padding: '24px 40px', position: 'relative', zIndex: 1, borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(26,26,26,0.5)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {BADGES.map(badge => (
            <Link
              key={badge}
              href={badge === 'Semua' ? '/artikel' : `/artikel?badge=${encodeURIComponent(badge)}`}
              style={{
                fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '2px',
                textTransform: 'uppercase', padding: '8px 16px', textDecoration: 'none',
                border: `1px solid ${activeBadge === badge ? 'var(--red)' : 'rgba(255,255,255,0.12)'}`,
                color: activeBadge === badge ? 'var(--red)' : 'rgba(255,255,255,0.5)',
                background: activeBadge === badge ? 'rgba(220,30,30,0.08)' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              {badge}
            </Link>
          ))}
        </div>
      </div>

      {/* Articles grid */}
      <section style={{ padding: '60px 40px 80px', position: 'relative', zIndex: 1, minHeight: '60vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-space-mono)', fontSize: '13px' }}>
              Belum ada artikel di kategori ini.
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && activeBadge === 'Semua' && (
                <div style={{ marginBottom: '40px' }}>
                  <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '16px' }}>
                    ★ Featured
                  </div>
                  <ArticleCard article={featured} featured />
                </div>
              )}

              {/* Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {(activeBadge === 'Semua' ? rest : articles).map((article, i) => (
                  <ArticleCard key={article.id} article={article} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
