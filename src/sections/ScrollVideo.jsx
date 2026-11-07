'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'motion/react'
import { Spinner } from '@/components/base/spinner/spinner'
import { ProgressTrack } from '@/components/base/progress/progress'

/**
 * Scroll-adaptive video.
 * The source webm (1080p upscale, 190 frames @ 24fps, 1920x1080) was pre-extracted to WebP frames in /public/frames.
 * Seeking a <video> per scroll tick is choppy (keyframe-bound), so frames are painted to a <canvas>
 * from an image sequence — scrubbing is frame-accurate both directions.
 */
const FRAME_COUNT = 190
// Layout space for the fit maths and callout coordinates (any 16:9 source draws into it at full resolution)
const VW = 1280
const VH = 720
const src = (i) => `/frames/f${String(i + 1).padStart(3, '0')}.webp`

// Callouts are anchored in source-video pixel coordinates and re-projected to screen space.
const CALLOUTS = [
  { from: 0.16, to: 0.46, x: 645, y: 120, side: 'left', k: '01', title: 'HDPE Low Loss Interceptor Head', body: 'Radome-grade nose cone. Near-transparent to the seeker’s RF, rugged enough for the airframe.' },
  { from: 0.3, to: 0.62, x: 645, y: 268, side: 'right', k: '02', title: 'Archimedes Active Radar Seeker', body: '80 mm active radar module. Detects Shahed-class targets beyond visual range.' },
  { from: 0.56, to: 0.86, x: 1010, y: 420, side: 'right', k: '03', title: 'Adapts to existing interceptors', body: 'Bolt-on seeker head. Airframe partners keep their platform; it gains autonomous guidance.' },
  { from: 0.62, to: 0.9, x: 645, y: 640, side: 'left', k: '04', title: 'Terminal vision module', body: 'Vision-based guidance takes over for the final intercept.' },
]

const PHASES = [
  { at: 0, label: 'Assembled' },
  { at: 0.18, label: 'Seeker separation' },
  { at: 0.5, label: 'Airframe deploy' },
  { at: 0.82, label: 'Ready to intercept' },
]

export default function ScrollVideo() {
  const section = useRef(null)
  const canvas = useRef(null)
  const frames = useRef([])
  const target = useRef(0)
  const current = useRef(0)
  const lastDrawn = useRef(-1)
  const bgColor = useRef(null)
  const sectionBg = useRef(null)
  const [loaded, setLoaded] = useState(0)
  const [progress, setProgress] = useState(0)
  const [layout, setLayout] = useState({ scale: 1, ox: 0, oy: 0 })

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    target.current = v * (FRAME_COUNT - 1)
    setProgress(v)
  })

  // Preload: first frame eagerly, then the rest. Draw the nearest loaded frame while loading.
  useEffect(() => {
    let count = 0
    const imgs = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        count++
        setLoaded(count)
        if (i === 0) lastDrawn.current = -1
      }
      img.src = src(i)
      return img
    })
    frames.current = imgs
  }, [])

  // Canvas sizing — "cover" with DPR, keep projection for callouts.
  useEffect(() => {
    const c = canvas.current
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      c.width = w * dpr
      c.height = h * dpr
      c.style.width = `${w}px`
      c.style.height = `${h}px`
      // On narrow screens use a softer "contain-ish" fit so the drone stays in frame.
      const cover = Math.max(w / VW, h / VH)
      const contain = Math.min(w / VW, h / VH)
      const scale = w < 768 ? contain * 1.9 : cover // phones: zoom in so the drone fills the width
      setLayout({ scale, ox: (w - VW * scale) / 2, oy: (h - VH * scale) / 2, dpr, vw: w, vh: h })
      lastDrawn.current = -1
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // Render loop with eased interpolation toward the scroll target.
  useEffect(() => {
    const ctx = canvas.current.getContext('2d')
    let raf
    const tick = () => {
      current.current += (target.current - current.current) * 0.18
      let idx = Math.round(current.current)
      // fall back to the nearest decoded frame if this one isn't ready yet
      let img = frames.current[idx]
      if (!img?.complete || !img.naturalWidth) {
        for (let d = 1; d < FRAME_COUNT; d++) {
          const a = frames.current[idx - d], b = frames.current[idx + d]
          if (a?.complete && a.naturalWidth) { img = a; idx = idx - d; break }
          if (b?.complete && b.naturalWidth) { img = b; idx = idx + d; break }
        }
      }
      if (img?.naturalWidth && idx !== lastDrawn.current) {
        const { scale, ox, oy, dpr = 1 } = layoutRef.current
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        // sample the render's own background once so letterboxing blends seamlessly
        if (!bgColor.current) {
          const t = document.createElement('canvas'); t.width = t.height = 4
          const tc = t.getContext('2d'); tc.drawImage(img, 0, 0, 40, 40, 0, 0, 4, 4)
          const d = tc.getImageData(0, 0, 4, 4).data
          bgColor.current = `rgb(${d[0]},${d[1]},${d[2]})`
          sectionBg.current?.style.setProperty('background', bgColor.current)
        }
        ctx.fillStyle = bgColor.current
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.drawImage(img, ox, oy, VW * scale, VH * scale)
        lastDrawn.current = idx
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  const layoutRef = useRef(layout)
  layoutRef.current = layout

  // derived from React state so overlays stay in lockstep with the drawn frame
  const ramp = (a, b) => Math.min(1, Math.max(0, (progress - a) / (b - a)))
  const introOpacity = 1 - ramp(0.02, 0.1)
  const introY = -60 * ramp(0.02, 0.1)
  const outroOpacity = ramp(0.86, 0.95)
  const outroY = 40 * (1 - outroOpacity)
  const vignette = 0.55 - 0.25 * ramp(0, 0.5) + 0.4 * ramp(0.5, 1)
  const vw = layout.vw ?? 1440
  const vh = layout.vh ?? 900
  // Cards stay inside a safe band: clear of the navbar at the top and the phase labels + progress bar at the bottom.
  const SAFE_TOP = 112
  const SAFE_BOTTOM = 156
  const CARD_HALF = 72

  const frameNo = Math.min(FRAME_COUNT, Math.round(progress * (FRAME_COUNT - 1)) + 1)
  const phase = [...PHASES].reverse().find((p) => progress >= p.at)

  return (
    <section ref={section} id="archimedes" className="relative h-[520vh] bg-bg">
      <div ref={sectionBg} className="sticky top-0 h-svh w-full overflow-hidden">
        <canvas ref={canvas} className="absolute inset-0" aria-label="Archimedes 1A interceptor disassembling as you scroll" />

        <div style={{ opacity: vignette }} className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#050505_85%)]" />
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />

        {/* Callouts */}
        <div className="pointer-events-none absolute inset-0">
          {CALLOUTS.map((c) => {
            const on = progress >= c.from && progress <= c.to
            const px = layout.ox + c.x * layout.scale
            const py = layout.oy + c.y * layout.scale
            const side = c.side === 'right' && px + 360 > vw ? 'left' : c.side === 'left' && px - 360 < 0 ? 'right' : c.side
            const center = Math.min(Math.max(py, SAFE_TOP + CARD_HALF), vh - SAFE_BOTTOM - CARD_HALF)
            const dy = center - py // shift the card, keep the connector pointing at the anchor
            return (
              <div key={c.k} className="absolute" style={{ left: px, top: py }}>
                <motion.div
                  initial={false}
                  animate={{ scale: on ? 1 : 0, opacity: on ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -left-2 -top-2 size-4"
                >
                  <span className="ping-ring absolute inset-0 rounded-full border border-accent" />
                  <span className="absolute inset-1 rounded-full bg-accent" />
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{ opacity: on ? 1 : 0, x: on ? 0 : side === 'left' ? 20 : -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{ top: dy }}
                  className={`absolute hidden w-72 -translate-y-1/2 md:block ${side === 'left' ? 'right-10 text-right' : 'left-10'}`}
                >
                  <div style={{ top: `calc(50% - ${dy}px)` }} className={`absolute h-px w-8 bg-accent/60 ${side === 'left' ? '-right-8' : '-left-8'}`} />
                  <div className="rounded-xl border border-line-strong bg-[#0b0b0c]/90 p-4 shadow-[0_18px_40px_-16px_rgb(0_0_0/0.8)] backdrop-blur-xl">
                    <div className="font-mono text-[10px] tracking-[0.2em] text-accent">{c.k} / COMPONENT</div>
                    <div className="mt-1 text-[15px] font-semibold leading-tight">{c.title}</div>
                    <p className="mt-1.5 text-[13px] leading-snug text-fg-muted">{c.body}</p>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>

        {/* Mobile callout (single card at bottom) */}
        <div className="pointer-events-none absolute inset-x-4 bottom-24 z-10 md:hidden">
          {CALLOUTS.map((c) => {
            const on = progress >= c.from && progress <= c.to
            return (
              <motion.div key={c.k} initial={false} animate={{ opacity: on ? 1 : 0, y: on ? 0 : 12 }} className="absolute inset-x-0 bottom-0 rounded-xl border border-line-strong bg-[#0b0b0c]/90 p-4 backdrop-blur-xl">
                <div className="font-mono text-[10px] tracking-[0.2em] text-accent">{c.k} / COMPONENT</div>
                <div className="mt-1 text-sm font-semibold">{c.title}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Intro title */}
        <div style={{ opacity: introOpacity, transform: `translateY(${introY}px)` }} className="pointer-events-none absolute inset-x-0 top-[17vh] px-4 text-center md:top-[12vh]">
          <div className="eyebrow">Product teardown</div>
          <h2 className="display mt-4 text-[clamp(3rem,10vw,9rem)]">Archimedes <span className="text-accent">1A</span></h2>
          <p className="mx-auto mt-4 max-w-md text-fg-muted">An active radar seeker head that adapts to existing interceptors. Scroll to take it apart.</p>
        </div>

        {/* Outro */}
        <div style={{ opacity: outroOpacity, transform: `translateY(${outroY}px)` }} className="pointer-events-none absolute inset-x-0 bottom-[14vh] px-4 text-center">
          <h3 className="display text-[clamp(2.2rem,6vw,5.5rem)]">Beyond visual range.<br /><span className="text-fg-muted">In fog, smoke, rain &amp; darkness.</span></h3>
        </div>

        {/* HUD */}
        <div className="pointer-events-none absolute left-4 top-20 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle md:left-8 md:top-24">
          <div>SEQ / ARCH-1A</div>
          <div className="mt-1 text-fg-muted">FRM {String(frameNo).padStart(3, '0')} / {FRAME_COUNT}</div>
          {loaded < FRAME_COUNT && (
            <div className="mt-2 flex items-center gap-2 text-accent">
              <Spinner size="xs" aria-label="Loading video frames" /> BUFFER {Math.round((loaded / FRAME_COUNT) * 100)}%
            </div>
          )}
        </div>
        <div className="pointer-events-none absolute right-4 top-20 text-right font-mono text-[10px] uppercase tracking-[0.2em] md:right-8 md:top-24">
          <div className="text-fg-subtle">Phase</div>
          <div className="mt-1 text-signal">{phase.label}<span className="blink">_</span></div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg via-bg/80 to-transparent" />
        <div className="absolute inset-x-4 bottom-8 z-10 md:inset-x-8">
          <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
            {PHASES.map((p) => (
              <span key={p.label} className={`${progress >= p.at ? 'text-fg' : ''} ${p === phase ? '' : 'hidden md:inline'}`}>{p.label}</span>
            ))}
          </div>
          <ProgressTrack percentage={progress * 100} size="sm" className="mt-3" />
        </div>
      </div>
    </section>
  )
}
