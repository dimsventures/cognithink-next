import { createServiceClient } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import ArticlesCarousel from '@/components/ArticlesCarousel'
import StickyFadeSection from '@/components/StickyFadeSection'

export const revalidate = 3600

export default async function Home() {
  const supabase = createServiceClient()

  const { data: articles } = await supabase
    .from('articles')
    .select('id, slug, title, description, badge, read_time, urgensi, published_at, view_count')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  const { count: articleCount } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true)

  return (
    <>
      <Navbar />

      <main>

        {/* 1 — Hero: 200vh wrapper → fades out at 45–92% */}
        <StickyFadeSection scrollVh={200}>
          <HeroSection articleCount={articleCount} />
        </StickyFadeSection>

        {/* 2 — Artikel Terbaru: 260vh → extra room for card panning */}
        <StickyFadeSection id="artikel" scrollVh={260}>
          <ArticlesCarousel articles={articles || []} />
        </StickyFadeSection>

        {/* 3 — Tools & Resources: 200vh */}
        <StickyFadeSection id="resources" scrollVh={200}>
          <section style={{
            height: '100%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '0 40px',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: 800, letterSpacing: '-0.02em',
                color: 'var(--text)', marginBottom: '12px',
              }}>
                Tools & Resources
              </h2>
              <p style={{
                fontSize: '13px', color: 'rgba(237,235,231,0.5)',
                fontFamily: 'var(--font-mono)', letterSpacing: '0.5px',
              }}>
                Produk yang kami bangun untuk membantu kamu
              </p>
            </div>

            <a
              href="https://gst-hq.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', textDecoration: 'none', width: '100%', maxWidth: '420px' }}
            >
              <div className="article-card" style={{
                padding: '36px 32px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: '24px',
              }}>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '9px',
                    letterSpacing: '2px', textTransform: 'uppercase',
                    color: 'var(--red)', marginBottom: '12px',
                  }}>
                    Dashboard
                  </div>
                  <div style={{
                    fontSize: '20px', fontWeight: 800,
                    letterSpacing: '-0.02em', color: 'var(--text)',
                    marginBottom: '8px',
                  }}>
                    GST Dashboard
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(237,235,231,0.55)', lineHeight: 1.6 }}>
                    Tools analisis market & data on-chain
                  </div>
                </div>
                <span style={{ fontSize: '24px', color: 'var(--text-subtle)', flexShrink: 0 }}>→</span>
              </div>
            </a>
          </section>
        </StickyFadeSection>

        {/* 4 — Community: last section, no fade out needed */}
        <section id="community" style={{
          minHeight: '100vh',
          background: 'var(--bg)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '80px 40px',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              fontWeight: 800, letterSpacing: '-0.02em',
              color: 'var(--text)', marginBottom: '12px',
            }}>
              Gabung Komunitas
            </h2>
            <p style={{
              fontSize: '13px', color: 'rgba(237,235,231,0.5)',
              fontFamily: 'var(--font-mono)', letterSpacing: '0.5px',
            }}>
              Diskusi, update terbaru, dan konten eksklusif. Gratis.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '420px' }}>
            {[
              { label: 'Instagram', handle: '@cognithink_', href: 'https://instagram.com/cognithink_' },
              { label: 'TikTok', handle: '@cognithink_', href: 'https://tiktok.com/@cognithink_' },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="article-card"
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '20px 24px', color: 'var(--text)',
                }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px', fontWeight: 700 }}>
                    {s.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {s.handle}
                  </div>
                </div>
                <span style={{ color: 'var(--text-subtle)', fontSize: '14px' }}>→</span>
              </a>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
