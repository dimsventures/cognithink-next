import { createServiceClient } from '@/lib/supabase'
import { Article } from '@/lib/types'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import NewsletterForm from '@/components/NewsletterForm'
import NeuralCanvas from '@/components/NeuralCanvas'
import Link from 'next/link'

export const revalidate = 3600

async function getLatestArticles(): Promise<Article[]> {
  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(4)
    return data || []
  } catch {
    return []
  }
}

export default async function Home() {
  const articles = await getLatestArticles()
  const [featured, ...rest] = articles

  return (
    <>
      <NeuralCanvas />
      <Navbar />

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        position: 'relative', zIndex: 1, padding: '120px 40px 80px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div style={{
            fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '3px',
            color: 'var(--red)', textTransform: 'uppercase', marginBottom: '16px',
          }}>
            Platform Edukasi Finansial & AI
          </div>
          <h1 style={{
            fontFamily: 'var(--font-bebas)', fontSize: 'clamp(52px, 8vw, 88px)',
            lineHeight: 0.92, marginBottom: '24px', letterSpacing: '1px',
          }}>
            TUMBUH DI ERA<br />
            <span style={{ color: 'var(--red)' }}>YANG BERUBAH</span><br />
            CEPAT
          </h1>
          <p style={{
            fontSize: '17px', color: 'rgba(255,255,255,0.65)',
            borderLeft: '3px solid var(--red)', paddingLeft: '16px',
            marginBottom: '36px', lineHeight: 1.6, maxWidth: '540px',
          }}>
            AI. Market. Psikologi. Tiga hal yang saling terhubung — dan hampir tidak pernah
            dibahas bersama di satu tempat. Sampai sekarang.
          </p>
          <NewsletterForm />
          <div style={{ display: 'flex', gap: '30px', marginTop: '40px', flexWrap: 'wrap' }}>
            <Stat num="14+" label="Artikel Tersedia" />
            <Stat num="3" label="Topik Utama" />
            <Stat num="1x" label="Artikel / Minggu" />
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section style={{ position: 'relative', zIndex: 1, padding: '90px 40px', background: 'linear-gradient(180deg,rgba(220,30,30,0.04) 0%,transparent 100%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center' }}>Problem</div>
          <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '52px', textAlign: 'center', marginBottom: '60px', lineHeight: 1 }}>
            KENAPA BANYAK ORANG <span style={{ color: 'var(--red)' }}>KETINGGALAN</span>?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
            {[
              { num: '01', title: 'Information Overload', desc: 'Terlalu banyak konten, terlalu sedikit yang benar-benar berguna. Lu scroll tapi tidak ada yang nyantol.' },
              { num: '02', title: 'AI Hype vs Realita', desc: 'Semua orang ngomong AI akan mengubah dunia. Tapi tidak ada yang jelasin apa artinya buat portfolio dan karir lu.' },
              { num: '03', title: 'Mindset yang Salah', desc: 'Strategi terbaik tetap gagal kalau psikologi tidak beres. Ini yang tidak pernah dibahas dengan jujur.' },
            ].map(item => (
              <div key={item.num} style={{ background: 'var(--black)', padding: '40px 30px' }}>
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '64px', color: 'rgba(220,30,30,0.12)', lineHeight: 1, marginBottom: '16px' }}>{item.num}</div>
                <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '10px', color: '#fff' }}>{item.title}</div>
                <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section style={{ position: 'relative', zIndex: 1, padding: '90px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center' }}>Framework</div>
          <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '52px', textAlign: 'center', marginBottom: '60px', lineHeight: 1 }}>
            TIGA <span style={{ color: 'var(--red)' }}>PILAR</span> UTAMA
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { icon: '🤖', title: 'ARTIFICIAL INTELLIGENCE', desc: 'Bukan hype. Bukan teori. Analisis praktis tentang apa yang sedang terjadi, apa yang akan datang, dan bagaimana lu bisa posisikan diri.', tags: ['LLM & Agents', 'AI Economy', 'Tools & Workflow'] },
              { icon: '📈', title: 'MARKET & TRADING', desc: 'Dari psikologi pasar sampai strategi konkret. Dikupas dengan jujur — termasuk bagian yang biasanya tidak diceritakan di buku teks.', tags: ['Risk Management', 'Crypto & Saham', 'Likuiditas'] },
              { icon: '🧠', title: 'PSIKOLOGI KEPUTUSAN', desc: 'Kenapa orang pintar bisa buat keputusan bodoh? Bias kognitif, emotion regulation, dan mental model yang benar-benar berguna.', tags: ['Cognitive Bias', 'Decision Making', 'Behavioral Finance'] },
            ].map(p => (
              <div key={p.title} style={{ background: 'var(--dark)', padding: '40px 30px' }}>
                <span style={{ fontSize: '44px', marginBottom: '22px', display: 'block' }}>{p.icon}</span>
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '30px', marginBottom: '14px', color: '#fff' }}>{p.title}</div>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: '20px' }}>{p.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {p.tags.map(t => (
                    <span key={t} style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '1px', padding: '5px 10px', border: '1px solid rgba(220,30,30,0.4)', color: 'rgba(220,30,30,0.8)' }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARTIKEL TERBARU */}
      {articles.length > 0 && (
        <section style={{ position: 'relative', zIndex: 1, padding: '90px 40px' }} id="artikel-terbaru">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '8px' }}>Latest</div>
                <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '52px', lineHeight: 1 }}>ARTIKEL <span style={{ color: 'var(--red)' }}>TERBARU</span></h2>
              </div>
              <Link href="/artikel" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '2px' }}>
                Lihat Semua →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: featured ? '1.4fr 1fr 1fr' : '1fr 1fr 1fr', gap: '20px' }}>
              {featured && <ArticleCard article={featured} featured />}
              {rest.map((a, i) => <ArticleCard key={a.id} article={a} index={i + 1} />)}
            </div>
          </div>
        </section>
      )}

      {/* WHY COGNITHINK */}
      <section style={{ position: 'relative', zIndex: 1, padding: '90px 40px', background: 'rgba(26,26,26,0.4)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center' }}>Differentiator</div>
          <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '52px', textAlign: 'center', marginBottom: '60px', lineHeight: 1 }}>
            KENAPA <span style={{ color: 'var(--red)' }}>COGNITHINK</span>?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {[
              { icon: '🎯', title: 'No Fluff, No Guru Act', desc: 'Gua bukan pakar. Gua cuma orang yang udah duluan salah dan mau jujur soal itu. Lebih relatable, lebih useful.' },
              { icon: '⚡', title: 'Straight to the Point', desc: 'Gak ada basa-basi, gak ada intro panjang. Tiap konten langsung ke inti — karena waktu lu lebih berharga dari filler.' },
              { icon: '🧬', title: '3 Dimensi Sekaligus', desc: 'AI + Market + Psikologi. Tiga hal yang saling terhubung tapi hampir gak pernah dibahas bareng di satu tempat.' },
              { icon: '🔥', title: 'Actionable, Bukan Motivational', desc: 'Setiap konten ada takeaway konkret. Bukan "percaya diri aja" — tapi "ini yang harus lo pahami dulu sebelum beli apapun".' },
            ].map(w => (
              <div key={w.title} style={{ display: 'flex', gap: '20px', padding: '28px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '32px', flexShrink: 0, marginTop: '4px' }}>{w.icon}</div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>{w.title}</div>
                  <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{w.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 40px', background: 'rgba(220,30,30,0.06)', borderTop: '1px solid rgba(220,30,30,0.15)', borderBottom: '1px solid rgba(220,30,30,0.15)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 1, marginBottom: '20px' }}>
            JANGAN <span style={{ color: 'var(--red)' }}>KETINGGALAN</span><br />ARTIKEL MINGGUAN
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px', lineHeight: 1.6 }}>
            1 artikel penting per minggu. Langsung ke inbox kamu. Gratis.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section style={{ position: 'relative', zIndex: 1, padding: '90px 40px' }} id="community">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '16px' }}>Community</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 1, marginBottom: '16px' }}>
                GABUNG<br />KOMUNITASNYA.
              </h2>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                Konten harian, diskusi live, dan update terbaru — pilih platform yang paling cocok.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <SocialLink href="https://instagram.com/cognithink_" icon="📷" name="INSTAGRAM" handle="@cognithink_" status="Aktif" />
              <SocialLink href="https://tiktok.com/@cognithink_" icon="🎵" name="TIKTOK" handle="@cognithink_" status="Soon" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '36px', color: 'var(--red)', lineHeight: 1 }}>{num}</div>
      <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}

function SocialLink({ href, icon, name, handle, status }: { href: string; icon: string; name: string; handle: string; status: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      display: 'flex', alignItems: 'center', gap: '16px',
      padding: '20px 24px', background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none', color: 'inherit',
    }}>
      <span style={{ fontSize: '28px' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '12px', letterSpacing: '2px', fontWeight: 700 }}>{name}</div>
        <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{handle}</div>
      </div>
      <span style={{
        fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '2px',
        textTransform: 'uppercase', padding: '4px 10px',
        background: status === 'Aktif' ? 'rgba(220,30,30,0.15)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${status === 'Aktif' ? 'rgba(220,30,30,0.4)' : 'rgba(255,255,255,0.1)'}`,
        color: status === 'Aktif' ? 'var(--red)' : 'rgba(255,255,255,0.3)',
      }}>{status}</span>
      <span style={{ color: 'rgba(255,255,255,0.3)' }}>→</span>
    </a>
  )
}
