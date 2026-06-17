'use client'

import { useEffect, useRef } from 'react'

export default function BrainVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    const SIZE = 480
    canvas.width = SIZE * DPR
    canvas.height = SIZE * DPR
    ctx.scale(DPR, DPR)

    const cx = SIZE / 2
    const cy = SIZE / 2 - 10

    // ── Brain silhouette path ──────────────────────────────────
    function buildBrainPath(): Path2D {
      const p = new Path2D()
      // Front-view brain outline — two hemisphere dome with temporal lobes
      p.moveTo(cx, cy - 155)
      // Left hemisphere dome
      p.bezierCurveTo(cx - 55, cy - 165, cx - 145, cy - 145, cx - 168, cy - 80)
      p.bezierCurveTo(cx - 185, cy - 20, cx - 175, cy + 50, cx - 150, cy + 90)
      // Left temporal lobe
      p.bezierCurveTo(cx - 130, cy + 120, cx - 100, cy + 140, cx - 70, cy + 145)
      // Bottom / brainstem area
      p.bezierCurveTo(cx - 30, cy + 155, cx - 10, cy + 158, cx, cy + 158)
      p.bezierCurveTo(cx + 10, cy + 158, cx + 30, cy + 155, cx + 70, cy + 145)
      // Right temporal lobe
      p.bezierCurveTo(cx + 100, cy + 140, cx + 130, cy + 120, cx + 150, cy + 90)
      // Right hemisphere dome
      p.bezierCurveTo(cx + 175, cy + 50, cx + 185, cy - 20, cx + 168, cy - 80)
      p.bezierCurveTo(cx + 145, cy - 145, cx + 55, cy - 165, cx, cy - 155)
      p.closePath()
      return p
    }

    const brainPath = buildBrainPath()

    // ── Check if point is inside brain ────────────────────────
    function inBrain(x: number, y: number): boolean {
      if (!ctx) return false
      return ctx.isPointInPath(brainPath, x, y)
    }

    // ── Gyri (fold lines) ──────────────────────────────────────
    const foldLines = [
      // Central sulcus
      { pts: [[cx - 2, cy - 150], [cx - 8, cy - 60], [cx - 4, cy + 20], [cx + 2, cy + 80], [cx + 4, cy + 120]] },
      // Left hemisphere folds
      { pts: [[cx - 80, cy - 130], [cx - 95, cy - 60], [cx - 90, cy + 20], [cx - 75, cy + 80]] },
      { pts: [[cx - 140, cy - 70], [cx - 148, cy - 10], [cx - 140, cy + 60]] },
      { pts: [[cx - 50, cy - 145], [cx - 60, cy - 80], [cx - 55, cy]] },
      // Right hemisphere folds
      { pts: [[cx + 80, cy - 130], [cx + 95, cy - 60], [cx + 90, cy + 20], [cx + 75, cy + 80]] },
      { pts: [[cx + 140, cy - 70], [cx + 148, cy - 10], [cx + 140, cy + 60]] },
      { pts: [[cx + 50, cy - 145], [cx + 60, cy - 80], [cx + 55, cy]] },
      // Horizontal folds
      { pts: [[cx - 160, cy + 10], [cx - 90, cy + 30], [cx - 30, cy + 20]] },
      { pts: [[cx + 160, cy + 10], [cx + 90, cy + 30], [cx + 30, cy + 20]] },
    ]

    // ── Nodes ─────────────────────────────────────────────────
    type Node = {
      x: number; y: number
      vx: number; vy: number
      r: number
      pulse: number
      pulseSpeed: number
      brightness: number
    }

    const nodes: Node[] = []
    const NODE_COUNT = 85
    let attempts = 0

    while (nodes.length < NODE_COUNT && attempts < 20000) {
      attempts++
      const x = cx - 185 + Math.random() * 370
      const y = cy - 165 + Math.random() * 330
      if (inBrain(x, y)) {
        nodes.push({
          x, y,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: 1.2 + Math.random() * 2,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.025,
          brightness: 0.5 + Math.random() * 0.5,
        })
      }
    }

    // ── Signal pulses travelling along edges ──────────────────
    type Signal = { ni: number; nj: number; t: number; speed: number }
    const signals: Signal[] = []

    function maybeSpawnSignal() {
      if (signals.length > 12 || Math.random() > 0.06) return
      const ni = Math.floor(Math.random() * nodes.length)
      // find a connected neighbour
      for (let nj = 0; nj < nodes.length; nj++) {
        if (nj === ni) continue
        const dx = nodes[ni].x - nodes[nj].x
        const dy = nodes[ni].y - nodes[nj].y
        if (Math.sqrt(dx * dx + dy * dy) < 100) {
          signals.push({ ni, nj, t: 0, speed: 0.018 + Math.random() * 0.018 })
          break
        }
      }
    }

    // ── Render ─────────────────────────────────────────────────
    let animId: number
    let time = 0

    function draw() {
      ctx.clearRect(0, 0, SIZE, SIZE)

      // ── 1. Brain volumetric fill (3-layer glow) ─────────────
      ctx.save()
      ctx.clip(brainPath)

      // Outer fill
      const bgGrad = ctx.createRadialGradient(cx, cy - 30, 20, cx, cy, 200)
      bgGrad.addColorStop(0, 'rgba(80, 0, 0, 0.55)')
      bgGrad.addColorStop(0.45, 'rgba(40, 0, 0, 0.40)')
      bgGrad.addColorStop(1, 'rgba(10, 0, 0, 0.20)')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, SIZE, SIZE)

      // Top-left highlight (simulates light source)
      const highlight = ctx.createRadialGradient(cx - 60, cy - 80, 0, cx - 60, cy - 80, 160)
      highlight.addColorStop(0, 'rgba(255, 80, 80, 0.10)')
      highlight.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = highlight
      ctx.fillRect(0, 0, SIZE, SIZE)

      ctx.restore()

      // ── 2. Brain outline stroke ──────────────────────────────
      ctx.save()
      ctx.shadowColor = 'rgba(212, 30, 30, 0.7)'
      ctx.shadowBlur = 18
      ctx.strokeStyle = 'rgba(212, 30, 30, 0.5)'
      ctx.lineWidth = 1.5
      ctx.stroke(brainPath)
      ctx.restore()

      // ── 3. Gyri fold lines ───────────────────────────────────
      ctx.save()
      ctx.clip(brainPath)
      foldLines.forEach(fold => {
        const pts = fold.pts
        if (pts.length < 2) return
        ctx.beginPath()
        ctx.moveTo(pts[0][0], pts[0][1])
        for (let i = 1; i < pts.length - 1; i++) {
          const mx = (pts[i][0] + pts[i + 1][0]) / 2
          const my = (pts[i][1] + pts[i + 1][1]) / 2
          ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my)
        }
        ctx.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1])
        ctx.strokeStyle = 'rgba(180, 30, 30, 0.18)'
        ctx.lineWidth = 1
        ctx.shadowColor = 'transparent'
        ctx.stroke()
      })
      ctx.restore()

      // ── 4. Neural connections ────────────────────────────────
      ctx.save()
      ctx.clip(brainPath)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            const alpha = 0.22 * (1 - dist / 100)
            const g = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y)
            g.addColorStop(0, `rgba(255, 70, 70, ${alpha})`)
            g.addColorStop(0.5, `rgba(212, 30, 30, ${alpha * 1.6})`)
            g.addColorStop(1, `rgba(255, 70, 70, ${alpha})`)
            ctx.strokeStyle = g
            ctx.lineWidth = 0.5 + (1 - dist / 100) * 0.6
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }
      ctx.restore()

      // ── 5. Signal pulses ─────────────────────────────────────
      maybeSpawnSignal()
      ctx.save()
      ctx.clip(brainPath)
      for (let s = signals.length - 1; s >= 0; s--) {
        const sig = signals[s]
        sig.t += sig.speed
        if (sig.t >= 1) { signals.splice(s, 1); continue }
        const ni = nodes[sig.ni]
        const nj = nodes[sig.nj]
        const sx = ni.x + (nj.x - ni.x) * sig.t
        const sy = ni.y + (nj.y - ni.y) * sig.t
        ctx.beginPath()
        ctx.arc(sx, sy, 3.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 200, 150, 0.95)'
        ctx.shadowColor = 'rgba(255, 150, 80, 1)'
        ctx.shadowBlur = 12
        ctx.fill()
      }
      ctx.restore()

      // ── 6. Neuron nodes ──────────────────────────────────────
      ctx.save()
      ctx.clip(brainPath)
      nodes.forEach(n => {
        n.pulse += n.pulseSpeed
        const scale = 1 + 0.25 * Math.sin(n.pulse)

        // Move, bounce off brain boundary
        const nx = n.x + n.vx
        const ny = n.y + n.vy
        if (inBrain(nx, n.y)) n.x = nx; else n.vx *= -1
        if (inBrain(n.x, ny)) n.y = ny; else n.vy *= -1

        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * scale, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 80, 80, ${0.75 * n.brightness})`
        ctx.shadowColor = 'rgba(255, 50, 50, 0.9)'
        ctx.shadowBlur = 10 * scale
        ctx.fill()

        // Bright white core
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 0.35 * scale, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 210, 210, ${0.9 * n.brightness})`
        ctx.shadowBlur = 0
        ctx.fill()
      })
      ctx.restore()

      // ── 7. Outer ambient glow ring ───────────────────────────
      const outerGlow = ctx.createRadialGradient(cx, cy, 145, cx, cy, 240)
      outerGlow.addColorStop(0, 'rgba(0,0,0,0)')
      outerGlow.addColorStop(0.7, 'rgba(0,0,0,0)')
      outerGlow.addColorStop(1, 'rgba(212, 30, 30, 0.07)')
      ctx.fillStyle = outerGlow
      ctx.fillRect(0, 0, SIZE, SIZE)

      // ── 8. Expanding pulse ring ───────────────────────────────
      time += 0.008
      const pulseR = (time * 60) % 190
      const pulseA = Math.max(0, 0.18 - (pulseR / 190) * 0.18)
      if (pulseA > 0.01) {
        ctx.save()
        ctx.clip(brainPath)
        ctx.beginPath()
        ctx.arc(cx, cy - 20, pulseR, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(212, 30, 30, ${pulseA})`
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.restore()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '480px', height: '480px', display: 'block' }}
      aria-hidden="true"
    />
  )
}
