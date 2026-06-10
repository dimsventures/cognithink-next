import { createServiceClient } from '@/lib/supabase'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createServiceClient()

  const [articlesRes, subscribersRes, viewsRes] = await Promise.all([
    supabase.from('articles').select('id, is_published', { count: 'exact' }),
    supabase.from('subscribers').select('id', { count: 'exact' }),
    supabase.from('article_views').select('id', { count: 'exact' }).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ])

  const totalArticles = articlesRes.count || 0
  const publishedArticles = articlesRes.data?.filter(a => a.is_published).length || 0
  const totalSubscribers = subscribersRes.count || 0
  const weeklyViews = viewsRes.count || 0

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '8px' }}>Dashboard</div>
        <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: '40px' }}>Overview</h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
        {[
          { label: 'Total Artikel', value: totalArticles, sub: `${publishedArticles} published` },
          { label: 'Subscribers', value: totalSubscribers, sub: 'Total terdaftar' },
          { label: 'Views (7 hari)', value: weeklyViews, sub: 'Unique views' },
          { label: 'Draft', value: totalArticles - publishedArticles, sub: 'Belum publish' },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--dark)', border: '1px solid rgba(255,255,255,0.06)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '48px', color: 'var(--red)', lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#fff', marginTop: '6px' }}>{stat.label}</div>
            <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        <QuickAction href="/dashboard/articles/new" title="Tulis Artikel Baru" desc="Buat dan publish artikel baru" icon="+" />
        <QuickAction href="/dashboard/analytics" title="Lihat Analytics" desc="View count & subscriber growth" icon="◇" />
        <QuickAction href="/dashboard/subscribers" title="Subscribers" desc={`${totalSubscribers} subscriber terdaftar`} icon="◉" />
        <QuickAction href="/artikel" title="Lihat Website" desc="Preview public-facing site" icon="→" external />
      </div>
    </div>
  )
}

function QuickAction({ href, title, desc, icon, external }: { href: string; title: string; desc: string; icon: string; external?: boolean }) {
  return (
    <Link href={href} target={external ? '_blank' : undefined} style={{
      display: 'flex', alignItems: 'center', gap: '20px',
      padding: '24px', background: 'var(--dark)', border: '1px solid rgba(255,255,255,0.06)',
      textDecoration: 'none', color: 'inherit', transition: 'border-color 0.2s',
    }}>
      <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '32px', color: 'var(--red)', lineHeight: 1 }}>{icon}</span>
      <div>
        <div style={{ fontWeight: 700, marginBottom: '4px' }}>{title}</div>
        <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{desc}</div>
      </div>
    </Link>
  )
}
