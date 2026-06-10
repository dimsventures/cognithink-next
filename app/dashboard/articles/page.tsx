import { createServiceClient } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import ArticleActions from './ArticleActions'

export const dynamic = 'force-dynamic'

export default async function DashboardArticlesPage() {
  const supabase = createServiceClient()
  const { data: articles } = await supabase
    .from('articles')
    .select('id, slug, title, badge, urgensi, is_published, published_at, view_count, created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '8px' }}>Content</div>
          <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: '40px' }}>Artikel</h1>
        </div>
        <Link href="/dashboard/articles/new" style={{
          background: 'var(--red)', color: '#fff', padding: '12px 24px',
          fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '2px',
          textTransform: 'uppercase', textDecoration: 'none',
        }}>
          + Artikel Baru
        </Link>
      </div>

      <div style={{ border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', gap: '16px', padding: '12px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {['Judul', 'Badge', 'Status', 'Views', 'Aksi'].map(h => (
            <span key={h} style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{h}</span>
          ))}
        </div>

        {(!articles || articles.length === 0) && (
          <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'var(--font-space-mono)', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
            Belum ada artikel. <Link href="/dashboard/articles/new" style={{ color: 'var(--red)', textDecoration: 'none' }}>Buat yang pertama →</Link>
          </div>
        )}

        {articles?.map(article => (
          <div key={article.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', gap: '16px', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '2px', fontSize: '14px' }}>{article.title}</div>
              <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>/{article.slug}</div>
            </div>
            <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(220,30,30,0.7)', whiteSpace: 'nowrap' }}>
              {article.badge || '—'}
            </span>
            <span style={{
              fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '1px',
              textTransform: 'uppercase', padding: '4px 10px', whiteSpace: 'nowrap',
              background: article.is_published ? 'rgba(0,200,100,0.1)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${article.is_published ? 'rgba(0,200,100,0.3)' : 'rgba(255,255,255,0.1)'}`,
              color: article.is_published ? 'rgba(0,200,100,0.8)' : 'rgba(255,255,255,0.3)',
            }}>
              {article.is_published ? 'Published' : 'Draft'}
            </span>
            <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
              {article.view_count || 0}
            </span>
            <ArticleActions slug={article.slug} id={article.id} />
          </div>
        ))}
      </div>
    </div>
  )
}
