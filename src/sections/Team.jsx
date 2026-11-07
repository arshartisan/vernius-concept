'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { RiCpuLine, RiCodeSSlashLine, RiFlightTakeoffLine, RiShakeHandsLine } from '@remixicon/react'
import { RevealText, FadeIn } from '../components/ui'

/* ============================== TEAM ==============================
 * Header, then four dark cards. Each card has its own hue and a small
 * looping illustration that starts when it scrolls into view. */

const ease = [0.16, 1, 0.3, 1]
const HUES = {
  copper: '#e08a4f',
  sky: '#7cc4ff',
  signal: '#8dffb8',
  violet: '#a99bff',
}

const CARDS = [
  {
    id: 'rf', hue: HUES.copper, icon: RiCpuLine, chip: 'RF PCB engineering', Art: PcbArt,
    lead: 'A decade of RF.', body: 'Over ten years of RF PCB engineering behind every seeker head.',
  },
  {
    id: 'sw', hue: HUES.sky, icon: RiCodeSSlashLine, chip: 'Critical software', Art: HeatGrid,
    lead: 'Software that can’t fail.', body: 'Past work includes critical software for the US Navy Tomahawk fleet and low Earth orbit satellites.',
  },
  {
    id: 'fpv', hue: HUES.signal, icon: RiFlightTakeoffLine, chip: 'Frontline FPV hardware', Art: DotGrid,
    lead: 'Fielded at the front.', body: 'FPV hardware the team built is flown by frontline operators.',
  },
  {
    id: 'dtu', hue: HUES.violet, icon: RiShakeHandsLine, chip: 'Spun out of DTU', Art: Cascade,
    lead: 'Prototype to field.', body: 'We work directly with operators and airframe partners from prototype through live fire.',
  },
]

export function Team() {
  return (
    <section id="team" className="relative border-t border-line py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <div className="eyebrow">05 — Team</div>
            <RevealText text={'Built with\nthe operators\nwho fly them.'} className="display mt-6 text-[clamp(2.6rem,6vw,5.5rem)]" />
          </div>
          <div className="lg:col-span-6">
            <FadeIn delay={0.15}>
              <p className="max-w-lg text-lg leading-relaxed text-fg-muted">
                Spun out of <span className="text-fg">Defense Tech for Ukraine (DTU)</span>, a volunteer non-profit designing hardware for frontline units.
              </p>
            </FadeIn>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {CARDS.map((c, i) => <TeamCard key={c.id} card={c} index={i} />)}
        </div>
      </div>
    </section>
  )
}

function TeamCard({ card: c, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-10% 0px' })
  const Icon = c.icon
  const Art = c.Art
  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.8, ease, delay: (index % 2) * 0.1 }}
      style={{ '--hue': c.hue }}
      className="group relative overflow-hidden rounded-2xl border border-line bg-[#0c0c0d] p-6 transition-colors duration-500 hover:border-line-strong md:p-7"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 opacity-0 transition-opacity duration-700 group-hover:opacity-100 [background:radial-gradient(60%_100%_at_50%_0%,color-mix(in_oklab,var(--hue)_14%,transparent),transparent)]" />
      <div className="relative flex h-[210px] items-center justify-center md:h-[230px]">
        <Art hue={c.hue} active={inView} />
      </div>
      <p className="relative mt-6 max-w-[460px] text-[15px] leading-relaxed">
        <span className="font-semibold text-fg">{c.lead}</span>{' '}
        <span className="text-fg-muted">{c.body}</span>
      </p>
      <span className="relative mt-4 inline-flex items-center gap-2 rounded-md border border-line bg-white/[0.03] py-1 pl-1 pr-2.5 text-[12.5px] text-fg">
        <span className="grid size-5 place-items-center rounded-[5px]" style={{ background: `color-mix(in oklab, ${c.hue} 22%, transparent)`, color: c.hue }}>
          <Icon className="size-3.5" aria-hidden />
        </span>
        {c.chip}
      </span>
    </motion.article>
  )
}

/* ---------- helpers ---------- */

// deterministic pseudo-random so server and client render the same grid
function seeded(seed) {
  let a = seed
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const mono = { fontFamily: 'var(--font-mono)' }

/* ---------- 1 · RF board: signal pulses run along the traces into the RF front-end ---------- */
function PcbArt({ hue, active }) {
  const traces = []
  ;[0, 1, 2, 3].forEach((i) => {
    const y = 74 + i * 11
    const jog = (i - 1.5) * 16
    traces.push(`M130 ${y} H${104 - i * 9} V${y + jog} H14`)
    traces.push(`M190 ${y} H${216 + i * 9} V${y + jog} H306`)
  })
  ;[0, 1, 2].forEach((i) => traces.push(`M${144 + i * 16} 126 V${148 + (i % 2) * 8}`))
  traces.push('M150 64 V40', 'M170 64 V40')

  return (
    <svg viewBox="0 0 320 180" className="h-full w-full max-w-[400px]" aria-hidden>
      {/* label */}
      <rect x="104" y="18" width="112" height="22" fill="none" stroke={hue} strokeOpacity="0.7" />
      <text x="160" y="33" textAnchor="middle" fill={hue} fontSize="9" letterSpacing="1.5" style={mono}>[ RF FRONT-END ]</text>
      {traces.map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke={hue} strokeOpacity="0.22" strokeWidth="1.2" />
          <motion.path
            d={d} fill="none" stroke={hue} strokeWidth="1.6" strokeLinecap="round"
            strokeDasharray="10 240"
            initial={{ strokeDashoffset: 250 }}
            animate={active ? { strokeDashoffset: [250, 0] } : { strokeDashoffset: 250 }}
            transition={{ duration: 1.6 + (i % 4) * 0.35, repeat: Infinity, ease: 'linear', delay: (i * 0.23) % 1.4 }}
          />
        </g>
      ))}
      {/* pads */}
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={144 + i * 16} cy={152 + (i % 2) * 8} r="3" fill="none" stroke={hue} strokeOpacity="0.6" />
      ))}
      {/* chip */}
      <rect x="130" y="64" width="60" height="62" rx="3" fill="#0c0c0d" stroke={hue} strokeWidth="1.2" />
      {Array.from({ length: 4 }, (_, r) => Array.from({ length: 4 }, (_, k) => (
        <motion.rect
          key={`${r}-${k}`} x={139 + k * 11} y={73 + r * 11} width="8" height="8" rx="1" fill={hue}
          initial={{ opacity: 0.15 }}
          animate={active ? { opacity: [0.15, 0.9, 0.15] } : { opacity: 0.15 }}
          transition={{ duration: 2.2, repeat: Infinity, delay: ((r * 4 + k) * 0.37) % 2.2 }}
        />
      )))}
    </svg>
  )
}

/* ---------- 2 · Software: a build/test heat-map with a sweeping highlight ---------- */
function HeatGrid({ hue, active }) {
  const cols = 22, rows = 7, cell = 9, gap = 3
  const rand = seeded(7)
  const cells = []
  for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) cells.push({ c, r, o: 0.12 + Math.pow(rand(), 1.6) * 0.75 })
  const w = cols * (cell + gap), h = rows * (cell + gap)
  const labels = { 1: 'SIM', 3: 'HIL', 5: 'FLT' }
  return (
    <svg viewBox={`-40 -26 ${w + 56} ${h + 40}`} className="h-full w-full max-w-[420px]" aria-hidden>
      {['V1', 'V2', 'V3', 'V4'].map((t, i) => (
        <text key={t} x={i * (w / 4) + w / 8} y="-12" textAnchor="middle" fill={hue} fillOpacity="0.7" fontSize="8" letterSpacing="1" style={mono}>{t}</text>
      ))}
      {Object.entries(labels).map(([r, t]) => (
        <text key={t} x="-10" y={+r * (cell + gap) + cell - 1} textAnchor="end" fill={hue} fillOpacity="0.7" fontSize="8" letterSpacing="1" style={mono}>{t}</text>
      ))}
      <rect x="-5" y="-5" width={w + 7} height={h + 7} fill="none" stroke={hue} strokeOpacity="0.3" />
      {cells.map(({ c, r, o }) => (
        <motion.rect
          key={`${c}-${r}`} x={c * (cell + gap)} y={r * (cell + gap)} width={cell} height={cell} rx="1.2" fill={hue}
          initial={{ opacity: o }}
          animate={active ? { opacity: [o, Math.min(1, o + 0.6), o] } : { opacity: o }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.6, delay: c * 0.06 + r * 0.02, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  )
}

/* ---------- 3 · Hardware: a dot grid that fills unit by unit, then resets ---------- */
function DotGrid({ hue, active }) {
  const cols = 7, rows = 5, total = cols * rows
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!active) return
    const t = setInterval(() => setN((v) => (v >= total + 6 ? 0 : v + 1)), 140)
    return () => clearInterval(t)
  }, [active, total])
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full max-w-[400px]" aria-hidden>
      {Array.from({ length: total }, (_, i) => {
        const c = i % cols, r = Math.floor(i / cols)
        const on = i < n
        return (
          <g key={i} transform={`translate(${40 + c * 40} ${18 + r * 36})`}>
            <motion.circle
              r="4.2"
              initial={false}
              animate={{ fill: on ? hue : 'rgba(0,0,0,0)', scale: on ? [1.6, 1] : 1 }}
              transition={{ duration: 0.35 }}
              stroke={hue}
              strokeOpacity={on ? 1 : 0.35}
              strokeWidth="1.2"
            />
            {on && i === n - 1 && (
              <motion.circle r="4" fill="none" stroke={hue} initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 3.2, opacity: 0 }} transition={{ duration: 0.7 }} />
            )}
          </g>
        )
      })}
    </svg>
  )
}

/* ---------- 4 · Iteration: a cascade of revision windows with a typing front window ---------- */
const REVS = ['prototype v1', 'bench test', 'operator feedback', 'field trial', 'rev 07']
function Cascade({ hue, active }) {
  const [text, setText] = useState('')
  useEffect(() => {
    if (!active) return
    let word = 0, ch = 0, hold = 0
    const t = setInterval(() => {
      const target = REVS[word]
      if (ch < target.length) { ch++; setText(target.slice(0, ch)) }
      else if (hold < 14) hold++
      else { word = (word + 1) % REVS.length; ch = 0; hold = 0; setText('') }
    }, 70)
    return () => clearInterval(t)
  }, [active])

  const layers = 9
  return (
    <div className="relative h-full w-full max-w-[400px]" aria-hidden>
      {Array.from({ length: layers }, (_, i) => {
        const k = layers - 1 - i // 0 = back
        return (
          <motion.div
            key={i}
            className="absolute rounded-[3px] border bg-[#0c0c0d]"
            style={{
              borderColor: hue,
              left: `${8 + k * 3.6}%`, top: `${4 + k * 5.2}%`, width: '52%', height: '52%',
              zIndex: k,
            }}
            initial={{ opacity: 0.2 }}
            animate={active ? { opacity: [0.2, 0.75, 0.2] } : { opacity: 0.2 }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.16, ease: 'easeInOut' }}
          />
        )
      })}
      <div
        className="absolute flex items-center rounded-[3px] border bg-[#0c0c0d] px-3"
        style={{ borderColor: hue, left: `${8 + layers * 3.6}%`, top: `${4 + layers * 5.2}%`, width: '52%', height: '30%', zIndex: 20, boxShadow: `0 0 30px -10px ${hue}` }}
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg">
          {text}<span className="blink ml-0.5 inline-block h-3 w-1.5 translate-y-0.5" style={{ background: hue }} />
        </span>
      </div>
    </div>
  )
}
