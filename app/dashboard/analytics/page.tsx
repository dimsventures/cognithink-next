import { createServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const supabase = createServiceClient()

  const [topArticles, recentViews, subscriberGrowth] = await Promise.all([
    supabase
      .from('articles')
      .select('id, slug, title, badge, view_count')
      .eq('is_published', true)
      .order('view_count', { ascending: false })
      .limit(10),
    supabase
      .from('article_views')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false }),
    supabase
      .from('subscribers')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true }),
  ])

  const totalViews7d = recentViews.data?.length || 0
  const totalSubs30d = subscriberGrowth.data?.length || 0
  const maxViews = Math.max(...(topArticles.data?.map(a => a.view_count || 0) || [1]))

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '8px' }}>Insights</div>
        <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: '40px' }}>Analytics</h1>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
        {[
          { label: 'Views (7 hari)', value: totalViews7d },
          { label: 'Subscribers Baru (30 hari)', value: totalSubs30d },
          { label: 'Artikel Terpopuler Views', value: topArticles.data?.[0]?.view_count || 0 },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--dark)', border: '1px solid rgba(255,255,255,0.06)', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '48px', color: 'var(--red)', lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Top articles */}
      <div style={{ background: 'var(--dark)', border: '1px solid rgba(255,255,255,0.06)', padding: '32px' }}>
        <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '24px' }}>
          Top 10 Artikel
        </div>
        {topArticles.data?.map((article, i) => (
          <div key={article.id} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '20px', color: 'rgba(220,30,30,0.4)', minWidth: '28px' }}>{i + 1}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{article.title}</div>
                  {article.badge && <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', color: 'rgba(220,30,30,0.6)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>{article.badge}</div>}
                </div>
              </div>
              <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '22px', color: '#fff', minWidth: '60px', textAlign: 'right' }}>
                {article.view_count || 0}
              </span>
            </div>
            {/* Bar */}
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', background: `linear-gradient(90deg, var(--red), var(--orange))`,
                width: `${((article.view_count || 0) / maxViews) * 100}%`,
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        ))}
        {(!topArticles.data || topArticles.data.length === 0) && (
          <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--font-space-mono)', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
            Belum ada data views.
          </div>
        )}
      </div>
    </div>
  )
}
