import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['sxjaqrpjjevmpgswmqbj.supabase.co'],
  },
  // Allow dangerouslySetInnerHTML for article HTML content
  experimental: {
    // No special flags needed
  },
}

export default nextConfig
