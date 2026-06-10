import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--dark)', borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '48px 40px', position: 'relative', zIndex: 1,
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          flexWrap: 'wrap', gap: '32px', marginBottom: '40px',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-bebas)', fontSize: '28px', letterSpacing: '2px',
              marginBottom: '8px',
            }}>
              COGNI<span style={{ color: 'var(--red)' }}>THINK</span>
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', maxWidth: '280px', lineHeight: 1.6 }}>
              Platform edukasi finansial & AI. Tumbuh bersama di era yang berubah cepat.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '2px',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '16px',
              }}>Konten</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <FooterLink href="/artikel">Semua Artikel</FooterLink>
                <FooterLink href="/artikel?badge=AI">Artificial Intelligence</FooterLink>
                <FooterLink href="/artikel?badge=Trading">Trading & Investasi</FooterLink>
                <FooterLink href="/artikel?badge=Psychology">Psikologi</FooterLink>
              </div>
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '2px',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '16px',
              }}>Follow</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <FooterLink href="https://instagram.com/cognithink_" external>Instagram</FooterLink>
                <FooterLink href="https://tiktok.com/@cognithink_" external>TikTok</FooterLink>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '1px', color: 'rgba(255,255,255,0.25)' }}>
            © {new Date().getFullYear()} CogniThink. All rights reserved.
          </span>
          <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '1px', color: 'rgba(255,255,255,0.2)' }}>
            GROW WITH AI
          </span>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const style = {
    fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '1px',
    color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.3s',
  }
  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" style={style}>{children}</a>
  }
  return <Link href={href} style={style}>{children}</Link>
}
