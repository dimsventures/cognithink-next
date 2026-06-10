/**
 * Migration Script: HTML Articles → Supabase
 *
 * Run dari folder cognithink-next/:
 *   node scripts/migrate-articles.js
 *
 * Pastikan .env.local sudah diisi sebelum run.
 */

const fs = require('fs')
const path = require('path')

// Load env manual (karena ini Node script, bukan Next.js)
const envPath = path.join(__dirname, '../.env.local')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const [key, ...val] = line.split('=')
    if (key && key.trim() && !key.startsWith('#')) {
      process.env[key.trim()] = val.join('=').trim()
    }
  })
}

const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// ============================================================
// Article metadata map
// Key: filename (tanpa .html), Value: metadata object
// ============================================================
const ARTICLE_META = {
  'agi-wealth-transfer': {
    title: 'Wealth Transfer Terbesar Sepanjang Sejarah Sudah Mulai. Lu di Sisi yang Mana?',
    description: 'Membaca peta AGI dari Jensen Huang — dan kenapa 2027 bisa jadi titik balik buat semua orang.',
    badge: 'Artificial Intelligence',
    read_time: '8 menit baca',
    urgensi: 5,
    date: '2026-05-01',
  },
  'ai-2022-vs-2026-shift': {
    title: 'AI 2022 vs 2026: Shift yang Gak Banyak Orang Sadarin',
    description: 'Dari chatbot novelty ke agentic infrastructure. Ini bukan sekedar upgrade — ini pergantian paradigma.',
    badge: 'Artificial Intelligence',
    read_time: '6 menit baca',
    urgensi: 4,
    date: '2026-04-01',
  },
  'ai-amplifier-artikel': {
    title: 'AI Bukan Pengganti — Ini Amplifier. Tapi Amplifier Apa?',
    description: 'AI mengamplifikasi apa yang sudah ada di dalam diri lu. Pertanyaannya: itu sesuatu yang bagus atau tidak?',
    badge: 'Artificial Intelligence',
    read_time: '7 menit baca',
    urgensi: 4,
    date: '2026-03-15',
  },
  'cara-kerja-language-model': {
    title: 'Cara Kerja Language Model: Bukan Magic, Tapi Tetap Mengagumkan',
    description: 'Demistifikasi LLM dalam bahasa manusia biasa. Kalau lu paham ini, lu paham kenapa AI bisa salah — dan kenapa tetap powerful.',
    badge: 'Artificial Intelligence',
    read_time: '9 menit baca',
    urgensi: 3,
    date: '2026-02-01',
  },
  'pola-revolusi-teknologi-ai': {
    title: 'Pola Revolusi Teknologi & Posisi AI Sekarang',
    description: 'Setiap revolusi teknologi punya pola. Internet, mobile, cloud — dan sekarang AI. Di mana kita sekarang di siklus ini?',
    badge: 'Artificial Intelligence',
    read_time: '7 menit baca',
    urgensi: 4,
    date: '2026-01-15',
  },
  'siapa-yang-cuan-dari-ai-boom': {
    title: 'Siapa yang Cuan dari AI Boom? (Dan Siapa yang Tidak)',
    description: 'Bukan semua orang dapat manfaat sama dari AI boom. Ada yang cuan, ada yang terdisrupsi. Peta lengkapnya di sini.',
    badge: 'Artificial Intelligence',
    read_time: '8 menit baca',
    urgensi: 5,
    date: '2026-01-01',
  },
  '10-template-prompt-2026': {
    title: '10 Template Prompt yang Gua Pakai Setiap Hari di 2026',
    description: 'Bukan list prompt random. Ini yang beneran gua pakai, dengan konteks kenapa dan kapan.',
    badge: 'Artificial Intelligence',
    read_time: '5 menit baca',
    urgensi: 3,
    date: '2026-03-01',
  },
  '7-deadly-sins-financial-market': {
    title: '7 Deadly Sins of Financial Market',
    description: 'Tujuh kesalahan yang paling sering membunuh portfolio. Bukan karena market jahat — tapi karena kita manusia.',
    badge: 'Trading',
    read_time: '10 menit baca',
    urgensi: 5,
    date: '2025-12-01',
  },
  'likuiditas-risk-asset': {
    title: 'Likuiditas dan Risk Asset: Yang Tidak Diajarkan di Buku Investasi',
    description: 'Kenapa semua aset turun bareng di market crash? Jawabannya ada di likuiditas — dan ini yang perlu lu pahami sebelum beli apapun.',
    badge: 'Trading',
    read_time: '9 menit baca',
    urgensi: 5,
    date: '2025-11-01',
  },
  'nabung-makin-miskin': {
    title: 'Kenapa Nabung Makin Bikin Lo Miskin (Secara Relatif)',
    description: 'Inflasi, currency debasement, dan opportunity cost dari cash yang sitting idle. Ini bukan anti-nabung — ini tentang memahami biaya sebenarnya.',
    badge: 'Personal Finance',
    read_time: '6 menit baca',
    urgensi: 4,
    date: '2025-10-01',
  },
  '7-kesalahan-mental-gen-z': {
    title: '7 Kesalahan Mental Gen Z tentang Uang & Karir',
    description: 'Bukan judgement. Ini pattern yang gua lihat berulang — termasuk di diri gua sendiri dulu.',
    badge: 'Psychology',
    read_time: '7 menit baca',
    urgensi: 4,
    date: '2025-09-01',
  },
}

// ============================================================
// Helper: Extract artikel-body content dari HTML
// ============================================================
function extractBody(html) {
  const bodyMatch = html.match(/<div class="artikel-body">([\s\S]*?)<\/div>\s*(?=<div class="newsletter-cta"|<section class="related|<\/body|<script)/i)
  if (bodyMatch) return bodyMatch[1].trim()

  // Fallback: ambil semua content setelah artikel-header
  const headerEnd = html.indexOf('</div>', html.indexOf('class="artikel-header"'))
  if (headerEnd > 0) {
    const bodyStart = html.indexOf('<div class="artikel-body">', headerEnd)
    if (bodyStart > 0) {
      // Take until newsletter or end
      let bodyContent = html.slice(bodyStart + '<div class="artikel-body">'.length)
      const endMarkers = ['<div class="newsletter-cta"', '<section class="related', '</body']
      let endIdx = bodyContent.length
      for (const marker of endMarkers) {
        const idx = bodyContent.indexOf(marker)
        if (idx > 0 && idx < endIdx) endIdx = idx
      }
      return bodyContent.slice(0, endIdx).trim()
    }
  }

  return null
}

// ============================================================
// Main migration
// ============================================================
async function migrate() {
  const artikelDir = path.join(__dirname, '../../artikel')

  if (!fs.existsSync(artikelDir)) {
    console.error('❌ Folder artikel tidak ditemukan di:', artikelDir)
    process.exit(1)
  }

  const htmlFiles = fs.readdirSync(artikelDir)
    .filter(f => f.endsWith('.html') && f !== 'index.html' && !f.startsWith('tes-'))

  console.log(`\n📚 Ditemukan ${htmlFiles.length} artikel untuk dimigrate\n`)

  let success = 0
  let skipped = 0
  let failed = 0

  for (const file of htmlFiles) {
    const slug = file.replace('.html', '')
    const meta = ARTICLE_META[slug]

    if (!meta) {
      console.log(`⚠  Skipped (no meta): ${file}`)
      skipped++
      continue
    }

    const html = fs.readFileSync(path.join(artikelDir, file), 'utf-8')
    const body = extractBody(html)

    if (!body) {
      console.log(`⚠  Skipped (no body): ${file}`)
      skipped++
      continue
    }

    // Upsert ke Supabase
    const { error } = await supabase
      .from('articles')
      .upsert({
        slug,
        title: meta.title,
        description: meta.description,
        badge: meta.badge,
        read_time: meta.read_time,
        urgensi: meta.urgensi,
        content: body,
        is_published: true,
        published_at: new Date(meta.date).toISOString(),
        view_count: 0,
      }, { onConflict: 'slug' })

    if (error) {
      console.log(`❌ Failed: ${slug} — ${error.message}`)
      failed++
    } else {
      console.log(`✅ Migrated: ${slug}`)
      success++
    }
  }

  console.log(`\n📊 Migration Summary:`)
  console.log(`   ✅ Success: ${success}`)
  console.log(`   ⚠  Skipped: ${skipped}`)
  console.log(`   ❌ Failed: ${failed}`)
}

migrate().catch(console.error)
