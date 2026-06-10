import type { Metadata } from 'next'
import { Bebas_Neue, Inter, Space_Mono } from 'next/font/google'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  variable: '--font-bebas',
  subsets: ['latin'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  variable: '--font-space-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'CogniThink — Tumbuh Bersama',
    template: '%s — CogniThink',
  },
  description: 'Platform edukasi finansial & AI. Artikel, insight, dan tools untuk tumbuh di era AGI.',
  openGraph: {
    siteName: 'CogniThink',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${bebasNeue.variable} ${inter.variable} ${spaceMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
