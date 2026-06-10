'use client'

import { useEffect } from 'react'

export default function ViewTracker({ articleId }: { articleId: number }) {
  useEffect(() => {
    // Track view (once per session)
    const key = `viewed_${articleId}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')

    fetch('/api/analytics/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId }),
    }).catch(() => {})

    // Read progress bar
    function updateProgress() {
      const el = document.getElementById('read-progress')
      if (!el) return
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      el.style.width = `${Math.min(progress, 100)}%`
    }

    window.addEventListener('scroll', updateProgress)
    return () => window.removeEventListener('scroll', updateProgress)
  }, [articleId])

  return null
}
