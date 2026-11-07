'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { RiArrowRightUpLine } from '@remixicon/react'
import { cx } from '@/utils/cx'
import { RevealText } from '../components/ui'

/* ============================== CAPABILITIES (bento) ==============================
 * Five cards: light "studio" cards that match the hero panel, plus one black feature card.
 * Every illustration is live SVG line art: isometric blocks are projected in code
 * (see IsoScene), so they can be animated per block. */

const ease = [0.16, 1, 0.3, 1]
const CARD_BG = '#d5d6d9'

export function Capabilities() {
  return (
    <section id="capabilities" className="relative overflow-hidden border-t border-line py-28 md:py-40">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="eyebrow">02 — Capabilities</div>
            <RevealText text={'Beyond-visual-range guidance.\nAutonomous or operator-assisted.'} className="display mt-6 max-w-5xl text-[clamp(2.2rem,5vw,4.6rem)]" />
          </div>
          <p className="max-w-sm text-fg-muted">The same seeker supports both modes.</p>
        </div>

        <div className="mt-14 grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:grid-rows-[minmax(300px,auto)_minmax(280px,auto)_minmax(280px,auto)]">
          {/* 1 · tall */}
          <Card href="#sequence" index={0} className="min-h-[520px] lg:row-span-2" eyebrow="Mode 01" title={'Fully autonomous\ninterception'}>
            <p className="mt-3 max-w-[300px] text-[14px] leading-relaxed text-ink-muted">
              Launches on a C2 fire-control cue, flies under radar guidance, acquires the target beyond visual range, and hands off to terminal guidance.
            </p>
            <Coil className="pointer-events-none absolute left-1/2 top-[52%] w-[62%] max-w-[260px] -translate-x-1/2 -translate-y-1/2" />
            <Tags className="absolute inset-x-6 bottom-6" items={['01 C2 fire control', '02 Launch', '03 Radar midcourse', '04 Terminal seeker']} />
          </Card>

          {/* 2 */}
          <Card href="#sequence" index={1} className="min-h-[300px]" eyebrow="Mode 02" title={'Operator-assisted\nguidance'}>
            <Orbit className="pointer-events-none absolute -bottom-6 right-[-8%] w-[78%] max-w-[330px]" />
            <p className="absolute bottom-6 left-6 max-w-[170px] text-[12.5px] leading-snug text-ink-muted">
              Streams live target range and bearing to the pilot flying manually.
            </p>
          </Card>

          {/* 3 */}
          <Card href="#products" index={2} className="min-h-[300px]" title={'All-weather\ndetection'}>
            <Cubes className="pointer-events-none absolute bottom-5 right-5 w-[50%] max-w-[220px]" />
            <Tags className="absolute bottom-6 left-6 max-w-[150px]" items={['Fog', 'Smoke', 'Rain', 'Darkness']} />
          </Card>

          {/* 4 · feature */}
          <Feature />

          {/* 5 */}
          <Card href="#products" index={4} className="min-h-[280px] lg:col-start-1 lg:row-start-3" title={'Adapts to existing\ninterceptors'}>
            <Stairs className="pointer-events-none absolute -bottom-3 right-6 w-[58%] max-w-[250px]" />
          </Card>
        </div>
      </div>
    </section>
  )
}

/* ---------- card shells ---------- */

function Card({ href, title, eyebrow, index, className, children }) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, ease, delay: index * 0.08 }}
      style={{ background: CARD_BG }}
      className={cx(
        'group relative block overflow-hidden rounded-[22px] p-6 text-ink outline-none',
        'shadow-[inset_0_1px_0_rgb(255_255_255/0.6)] transition-[transform,box-shadow] duration-500 ease-out',
        'hover:-translate-y-1 hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.6),0_24px_60px_-28px_rgb(224_138_79/0.45)]',
        'focus-visible:ring-2 focus-visible:ring-accent',
        className,
      )}
    >
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          {eyebrow && <div className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent-700">{eyebrow}</div>}
          <h3 className="whitespace-pre-line text-[21px] font-semibold leading-[1.1] tracking-[-0.035em] md:text-[23px]">{title}</h3>
        </div>
        <Arrow />
      </div>
      {children}
    </motion.a>
  )
}

function Arrow({ light }) {
  return (
    <span className={cx('relative grid size-9 shrink-0 place-items-center overflow-hidden', light ? 'text-white' : 'text-ink')}>
      <RiArrowRightUpLine className="size-8 transition-transform duration-500 ease-out group-hover:-translate-y-8 group-hover:translate-x-8" aria-hidden />
      <RiArrowRightUpLine className="absolute size-8 -translate-x-8 translate-y-8 text-accent-600 transition-transform duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0" aria-hidden />
    </span>
  )
}

function Tags({ items, className, dark }) {
  return (
    <div className={cx('relative z-10 flex flex-wrap gap-1.5', className)}>
      {items.map((t) => (
        <span
          key={t}
          className={cx(
            'rounded-full px-2.5 py-1 text-[11px] font-medium tracking-[-0.01em]',
            dark ? 'bg-white text-ink' : 'border border-ink/10 bg-white/80 text-ink',
          )}
        >
          {t}
        </span>
      ))}
    </div>
  )
}

function Feature() {
  return (
    <motion.a
      href="#contact"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, ease, delay: 0.24 }}
      className={cx(
        'group relative block min-h-[460px] overflow-hidden rounded-[22px] border border-white/10 bg-[#0b0b0c] p-6 text-white outline-none md:col-span-2 md:p-8',
        'transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_30px_80px_-30px_rgb(224_138_79/0.5)]',
        'focus-visible:ring-2 focus-visible:ring-accent lg:col-start-2 lg:row-span-2 lg:row-start-2',
      )}
    >
      <div className="pointer-events-none absolute -right-20 top-1/2 size-[420px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(224_138_79/0.16),transparent_65%)]" />
      <div className="relative z-10 flex items-start justify-between">
        <h3 className="whitespace-pre-line text-[clamp(1.9rem,3.4vw,2.9rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
          {'The same seeker.\nBoth modes.'}
        </h3>
        <Arrow light />
      </div>

      <Lattice className="pointer-events-none absolute right-[5%] top-[48%] w-[44%] max-w-[380px] -translate-y-1/2 max-md:static max-md:mx-auto max-md:mt-6 max-md:w-[80%] max-md:translate-y-0" />

      <div className="relative z-10 mt-6 max-w-[360px] md:absolute md:bottom-8 md:left-8 md:mt-0">
        <p className="text-[15px] leading-[1.6] tracking-[-0.015em] text-white/85">
          Launch on a C2 fire-control cue and fly autonomously, or give a pilot live range and bearing,{' '}
          <span className="box-decoration-clone rounded-md bg-white px-1.5 py-0.5 font-medium text-ink">without a six-figure seeker</span>.
        </p>
      </div>

      <div className="absolute bottom-6 right-6 z-10 hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-signal md:flex md:bottom-8 md:right-8">
        <span className="relative flex size-2">
          <span className="ping-ring absolute inset-0 rounded-full bg-signal" />
          <span className="relative size-2 rounded-full bg-signal" />
        </span>
        Lock acquired · RNG 1.84 km
      </div>
    </motion.a>
  )
}

/* ---------- isometric engine ---------- */

const COS30 = Math.cos(Math.PI / 6)
const proj = (x, y, z, u) => [(x - y) * COS30 * u, (x + y) * 0.5 * u - z * u]

function boxFaces({ x, y, z, w, d, h }) {
  const X = x + w, Y = y + d, Z = z + h
  return {
    top: [[x, y, Z], [X, y, Z], [X, Y, Z], [x, Y, Z]],
    right: [[X, y, z], [X, Y, z], [X, Y, Z], [X, y, Z]],
    left: [[x, Y, z], [X, Y, z], [X, Y, Z], [x, Y, Z]],
  }
}

/* a is drawn before b when it lies entirely behind b on some axis */
const behind = (a, b) => a.x + a.w <= b.x || a.y + a.d <= b.y || a.z + a.h <= b.z

function depthSort(boxes) {
  const n = boxes.length
  const after = boxes.map(() => [])
  const indeg = boxes.map(() => 0)
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if (i === j) continue
    if (behind(boxes[i], boxes[j]) && !behind(boxes[j], boxes[i])) { after[i].push(j); indeg[j]++ }
  }
  const out = []
  const q = boxes.map((_, i) => i).filter((i) => indeg[i] === 0)
  while (q.length) {
    const i = q.shift(); out.push(i)
    for (const j of after[i]) if (--indeg[j] === 0) q.push(j)
  }
  if (out.length < n) {
    const rest = boxes.map((_, i) => i).filter((i) => !out.includes(i))
    rest.sort((a, b) => (boxes[a].x + boxes[a].y + boxes[a].z) - (boxes[b].x + boxes[b].y + boxes[b].z))
    out.push(...rest)
  }
  return out
}

function IsoScene({ boxes, u = 20, pad = 6, stroke, strokeWidth = 1.2, fills, draw, motionFor, className, label }) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  const lift = 2 * u // headroom for boxes that animate upward
  for (const b of boxes) for (const f of Object.values(boxFaces(b))) for (const p of f) {
    const [sx, sy] = proj(...p, u)
    minX = Math.min(minX, sx); maxX = Math.max(maxX, sx); minY = Math.min(minY, sy); maxY = Math.max(maxY, sy)
  }
  const vb = `${(minX - pad).toFixed(1)} ${(minY - pad - lift).toFixed(1)} ${(maxX - minX + pad * 2).toFixed(1)} ${(maxY - minY + pad * 2 + lift).toFixed(1)}`
  const order = depthSort(boxes)
  const d = (pts) => 'M' + pts.map((p) => proj(...p, u).map((n) => n.toFixed(2)).join(',')).join('L') + 'Z'

  return (
    <svg viewBox={vb} className={className} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {order.map((i, k) => {
        const b = boxes[i]
        const f = boxFaces(b)
        return (
          <motion.g key={i} {...(motionFor ? motionFor(b, i, k) : {})}>
            {['left', 'right', 'top'].map((face) => (
              <motion.path
                key={face}
                d={d(f[face])}
                fill={fills[face]}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                initial={stroke ? { pathLength: 0 } : false}
                animate={stroke ? { pathLength: draw ? 1 : 0 } : undefined}
                transition={{ duration: 1.4, ease, delay: 0.15 + k * 0.09 }}
              />
            ))}
          </motion.g>
        )
      })}
    </svg>
  )
}

function useOnce(margin = '-15% 0px') {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin })
  return [ref, inView]
}

/* ---------- illustrations ---------- */

/* Feature: two pinwheel frames joined by corner posts, which pull apart and re-seat
   on a loop, like an exploded view. */
const LATTICE = [
  // lower frame
  { x: 0, y: 0, z: 0, w: 3, d: 1, h: 1, layer: 0 },
  { x: 3, y: 0, z: 0, w: 1, d: 3, h: 1, layer: 0 },
  { x: 1, y: 3, z: 0, w: 3, d: 1, h: 1, layer: 0 },
  { x: 0, y: 1, z: 0, w: 1, d: 3, h: 1, layer: 0 },
  // posts
  { x: 0, y: 0, z: 1, w: 1, d: 1, h: 1, layer: 1 },
  { x: 3, y: 0, z: 1, w: 1, d: 1, h: 1, layer: 1 },
  { x: 0, y: 3, z: 1, w: 1, d: 1, h: 1, layer: 1 },
  { x: 3, y: 3, z: 1, w: 1, d: 1, h: 1, layer: 1 },
  // upper frame (mirrored pinwheel)
  { x: 0, y: 0, z: 2, w: 1, d: 3, h: 1, layer: 2 },
  { x: 1, y: 0, z: 2, w: 3, d: 1, h: 1, layer: 2 },
  { x: 3, y: 1, z: 2, w: 1, d: 3, h: 1, layer: 2 },
  { x: 0, y: 3, z: 2, w: 3, d: 1, h: 1, layer: 2 },
]

function Lattice({ className }) {
  const [ref, inView] = useOnce()
  const u = 34
  return (
    <div ref={ref} className={className}>
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
        <IsoScene
          boxes={LATTICE}
          u={u}
          stroke="rgb(255 255 255 / 0.9)"
          strokeWidth={0.95}
          fills={{ top: '#121213', right: '#0b0b0c', left: '#0e0e0f' }}
          draw={inView}
          className="w-full overflow-visible"
          label="Isometric line drawing of interlocking frames separating and re-seating"
          motionFor={(b) => ({
            animate: inView ? { y: [0, -b.layer * u * 0.45, -b.layer * u * 0.45, 0, 0] } : { y: 0 },
            transition: { duration: 5.5, times: [0, 0.3, 0.55, 0.85, 1], repeat: Infinity, ease: 'easeInOut', delay: 2 },
          })}
        />
      </motion.div>
    </div>
  )
}

/* Card 3: three wireframe cubes bobbing out of phase. */
const CUBES = [
  { x: 2, y: 0, z: 2.2, w: 2, d: 2, h: 2, phase: 0 },
  { x: 0, y: 2.6, z: 0.6, w: 2, d: 2, h: 2, phase: 1 },
  { x: 3.4, y: 3, z: 0, w: 1.6, d: 1.6, h: 1.6, phase: 2 },
]
function Cubes({ className }) {
  const [ref, inView] = useOnce()
  return (
    <div ref={ref} className={className}>
      <IsoScene
        boxes={CUBES}
        u={22}
        stroke="rgb(13 13 14 / 0.55)"
        strokeWidth={1}
        fills={{ top: CARD_BG, right: CARD_BG, left: CARD_BG }}
        draw={inView}
        className="w-full overflow-visible"
        motionFor={(b) => ({
          animate: { y: [0, -9, 0] },
          transition: { duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: b.phase * 0.6 },
        })}
      />
    </div>
  )
}

/* Card 5: solid steps that rise in sequence, then ripple. */
const STEPS = [0, 1, 2, 3, 4].map((i) => ({ x: i, y: 0, z: 0, w: 1, d: 2.2, h: 0.8 + i * 0.8, i }))
function Stairs({ className }) {
  const [ref, inView] = useOnce()
  return (
    <div ref={ref} className={className}>
      <IsoScene
        boxes={STEPS}
        u={30}
        strokeWidth={0}
        fills={{ top: '#5a5c61', right: '#141415', left: '#2a2b2e' }}
        draw={inView}
        className="w-full overflow-visible"
        motionFor={(b) => ({
          initial: { opacity: 0, y: 40 },
          animate: inView ? { opacity: 1, y: [40, 0, 0, -6, 0] } : { opacity: 0, y: 40 },
          transition: {
            opacity: { duration: 0.6, delay: 0.2 + b.i * 0.1 },
            y: { duration: 4, times: [0, 0.2, 0.6, 0.8, 1], repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut', delay: 0.2 + b.i * 0.1 },
          },
        })}
      />
    </div>
  )
}

/* Card 1: a stack of rings compressing in a travelling wave, like a radar emission coil. */
function Coil({ className }) {
  const n = 16
  return (
    <svg viewBox="0 0 200 240" className={className} aria-hidden>
      {Array.from({ length: n }, (_, i) => {
        const cy = 36 + i * 11
        return (
          <motion.ellipse
            key={i}
            cx="100"
            cy={cy}
            rx="72"
            ry="15"
            fill="none"
            stroke="rgb(13 13 14 / 0.6)"
            strokeWidth="1"
            animate={{ cy: [cy, cy - 5, cy], rx: [72, 60, 72] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.09 }}
          />
        )
      })}
      <motion.ellipse
        cx="100" cy="36" rx="72" ry="15" fill="none" stroke="var(--color-accent-600)" strokeWidth="1.5"
        animate={{ cy: [36, 36 + (n - 1) * 11, 36], opacity: [0, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  )
}

/* Card 2: a spinning globe with a tilted orbit; a copper target dot tracks along it. */
function Orbit({ className }) {
  const cx = 150, cy = 120, r = 56
  const orbit = `M ${cx - 118},${cy} a 118,30 0 1,0 236,0 a 118,30 0 1,0 -236,0`
  const ink = 'rgb(13 13 14 / 0.6)'
  return (
    <svg viewBox="0 0 300 220" className={className} aria-hidden>
      <g transform={`rotate(-14 ${cx} ${cy})`}>
        {/* back half of the orbit, hidden behind the globe */}
        <path d={`M ${cx - 118},${cy} a 118,30 0 0,1 236,0`} fill="none" stroke={ink} strokeWidth="1" strokeDasharray="3 4" />
      </g>
      <circle cx={cx} cy={cy} r={r} fill={CARD_BG} stroke={ink} strokeWidth="1" />
      {[0, 1.2, 2.4].map((delay) => (
        <motion.ellipse
          key={delay}
          cx={cx} cy={cy} ry={r} fill="none" stroke={ink} strokeWidth="1"
          initial={{ rx: r }}
          animate={{ rx: [r, 0, r] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'linear', delay: -delay }}
        />
      ))}
      <ellipse cx={cx} cy={cy} rx={r} ry="12" fill="none" stroke={ink} strokeWidth="1" />
      <ellipse cx={cx} cy={cy - 28} rx={r * 0.86} ry="9" fill="none" stroke={ink} strokeWidth="1" opacity="0.6" />
      <ellipse cx={cx} cy={cy + 28} rx={r * 0.86} ry="9" fill="none" stroke={ink} strokeWidth="1" opacity="0.6" />
      <g transform={`rotate(-14 ${cx} ${cy})`}>
        {/* front half */}
        <path d={`M ${cx - 118},${cy} a 118,30 0 0,0 236,0`} fill="none" stroke={ink} strokeWidth="1.2" />
        <circle r="5" fill="var(--color-accent-500)">
          <animateMotion dur="7s" repeatCount="indefinite" path={orbit} />
        </circle>
        <circle r="11" fill="none" stroke="var(--color-accent-500)" strokeWidth="1" opacity="0.5">
          <animateMotion dur="7s" repeatCount="indefinite" path={orbit} />
          <animate attributeName="r" values="6;14;6" dur="1.6s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  )
}
