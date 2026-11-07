'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useInView } from 'motion/react'
import { RevealText, FadeIn, Counter, Scramble, TiltCard, Button, Badge } from '../components/ui'
import { cx } from '@/utils/cx'
import { Chip } from '@/components/base/badges/chip'
import { Button as BButton } from '@/components/base/buttons/button'
import { Tooltip, TooltipTrigger } from '@/components/base/tooltip/tooltip'
import { toast } from '@/components/base/toast/toast'
import { Meter } from '@/components/base/meter/meter'
import { ProgressBar } from '@/components/base/progress/progress'
import { Divider } from '@/components/base/divider/divider'
import { Kbd } from '@/components/base/kbd/kbd'
import { ModalTrigger, Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/base/modal/modal'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@/components/base/table/table'
import {
  RiFileCopyLine, RiCheckLine, RiFileList3Line, RiMailSendLine, RiLockLine,
} from '@remixicon/react'

/* ============================== MARQUEE ============================== */
export function Marquee() {
  const items = ['All-weather Shahed detection', 'Active radar seekers', 'Counter-UAS', 'Beyond visual range', 'Autonomous launch', 'Fog · Smoke · Rain · Darkness', 'Airframe agnostic']
  const row = [...items, ...items]
  return (
    <div className="relative overflow-hidden border-y border-line py-5">
      <div className="marquee flex w-max gap-10 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 font-mono text-xs uppercase tracking-[0.2em] text-fg-muted">
            {t} <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ============================== PROBLEM ============================== */
export function Problem() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])
  const clip = useTransform(scrollYProgress, [0.1, 0.4], ['inset(18% 18% 18% 18% round 24px)', 'inset(0% 0% 0% 0% round 24px)'])

  return (
    <section id="problem" ref={ref} className="relative mx-auto max-w-[1440px] px-4 py-28 md:px-8 md:py-40">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="eyebrow">01 — The problem</div>
          <RevealText text={'Interceptors\nare still flown\nby hand.'} className="display mt-6 text-[clamp(2.6rem,6vw,5.5rem)]" />
          <FadeIn delay={0.2} className="mt-8 space-y-5 text-lg leading-relaxed text-fg-muted">
            <p>Most interceptors are still manually piloted. Active radar seekers would allow autonomous launch, but at six figures per unit they cost more than the targets they intercept.</p>
            <p>Over half of the Shaheds over Ukraine are now jet-powered. They are too fast for FPV operators, who have to find the target by hand in the last kilometer.</p>
          </FadeIn>
        </div>

        <div className="lg:col-span-7">
          <motion.div style={{ clipPath: clip }} className="relative aspect-[4/3] overflow-hidden">
            <motion.img style={{ y: imgY, scale: 1.2 }} src="/images/fpv-pilot.webp" alt="Operator mounting a seeker head on an FPV interceptor" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
            <div className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-muted">Field integration · FPV interceptor</div>
          </motion.div>
        </div>
      </div>

      <div className="mt-20 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-3">
        <Stat value={<Counter to={4} prefix="$" suffix="M" />} label="Per Patriot intercept" note="The radar seeker head is the most expensive subsystem of an autonomous interceptor." />
        <Stat value={<Counter to={50} suffix="%+" />} label="Shaheds now jet-powered" note="Too fast for FPV operators to catch by eye." extra={<JetMeter />} />
        <Stat value={<span>6<span className="text-fg-subtle">-fig</span></span>} label="Cost of a seeker today" note="More than the drone it is meant to stop." />
      </div>
    </section>
  )
}

/* BoardUI Meter: fills to 50% when it scrolls into view */
function JetMeter() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => setV(50), 150)
    return () => clearTimeout(t)
  }, [inView])
  return (
    <div ref={ref} className="mt-6 max-w-xs">
      <Meter label="Jet-powered share over Ukraine" value={v} tone="warning" size="sm" valueLabel="50%+" />
    </div>
  )
}

function Stat({ value, label, note, extra }) {
  return (
    <div className="group relative bg-bg p-8 transition-colors duration-500 hover:bg-surface md:p-10">
      <div className="display text-[clamp(3.5rem,7vw,6rem)] text-fg transition-colors duration-500 group-hover:text-accent">{value}</div>
      <div className="mt-4 font-mono text-xs uppercase tracking-[0.18em]">{label}</div>
      <p className="mt-2 max-w-xs text-sm text-fg-muted">{note}</p>
      {extra}
    </div>
  )
}

/* Capabilities lives in ./Capabilities.jsx */
export { Capabilities } from './Capabilities'

/* ============================== PRODUCTS ============================== */
const PRODUCTS = [
  {
    name: 'Archimedes 1A', size: '80 mm radar', platform: 'FPV interceptors', targets: 'Shahed-class UAS', img: '/images/product-1a-exploded.webp',
    summary: 'An active radar seeker head that adapts to existing interceptors and detects Shahed-class targets beyond visual range in fog, smoke, rain and darkness.',
    specs: [
      ['Radar', '80 mm active radar seeker'],
      ['Platform', 'FPV interceptors'],
      ['Targets', 'Shahed-class UAS'],
      ['Conditions', 'Fog, smoke, rain, darkness'],
      ['Nose cone', 'HDPE Low Loss Interceptor Head'],
      ['Seeker', 'Archimedes Active Radar Seeker Module'],
      ['Guidance', 'Cue, radar midcourse, vision terminal'],
      ['Integration', 'Adapts to existing interceptors'],
    ],
  },
  {
    name: 'Archimedes 1B', size: '120 mm radar', platform: 'UGVs & motherships', targets: 'Quad FPV & Shahed-class UAS', img: '/images/product-1b-groundradar.webp',
    summary: 'A 120 mm radar for UGVs and motherships that detects quad FPVs and Shahed-class UAS.',
    specs: [
      ['Radar', '120 mm radar'],
      ['Platform', 'UGVs & motherships'],
      ['Targets', 'Quad FPV & Shahed-class UAS'],
      ['Conditions', 'All-weather Shahed detection'],
      ['Integration', 'Can be adapted to your airframe'],
    ],
  },
  { name: 'Barca 1', size: 'Ballistic-capable seeker', platform: 'Interceptor missiles', targets: 'Cruise missiles & SRBMs', img: null, classified: true },
]

export function Products() {
  return (
    <section id="products" className="relative border-t border-line py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="eyebrow">03 — Products</div>
        <div className="mt-6 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <RevealText text={'Low-cost,\nhigh-performance\nCUAS radars.'} className="display text-[clamp(2.6rem,6vw,5.5rem)]" />
          <p className="max-w-sm text-fg-muted">All products offer all-weather Shahed detection and can be adapted to your airframe.</p>
        </div>

        <div className="mt-16 grid gap-5 [perspective:1200px] md:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <FadeIn key={p.name} delay={i * 0.1}>
              <TiltCard className="flex h-full flex-col">
                <div className="relative aspect-square overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#1d1d1d,#0a0a0a_70%)]">
                  {p.classified ? (
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="grid-bg absolute inset-0" />
                      <Chip variant="subtle" color="rose" className="relative -rotate-6 px-5 py-2 font-mono text-lg tracking-[0.3em] ring-1 ring-current/40">
                        <Scramble text="CLASSIFIED" />
                      </Chip>
                    </div>
                  ) : (
                    <img src={p.img} alt={p.name} className="absolute inset-0 m-auto h-[82%] w-[82%] object-contain transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-110 group-hover:-rotate-2" />
                  )}
                  <span className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.2em] text-fg-subtle">0{i + 1}</span>
                </div>
                <div className="flex flex-1 flex-col border-t border-line p-6">
                  <h3 className="text-2xl font-semibold tracking-tight">{p.name}</h3>
                  <dl className="mt-5 space-y-3 text-sm">
                    {[['Form', p.size], ['Platform', p.platform], ['Targets', p.targets]].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 border-b border-line pb-3 last:border-0">
                        <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-fg-subtle">{k}</dt>
                        <dd className="text-right">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
                    <Chip variant="caption" color="lime" className="gap-1.5">
                      <span className="size-1.5 rounded-full bg-current" /> All-weather Shahed detection
                    </Chip>
                    {p.classified ? (
                      <TooltipTrigger delay={150}>
                        <BButton variant="secondary" size="small" leadingIcon={RiLockLine} aria-disabled="true" className="cursor-not-allowed rounded-full px-3">Restricted</BButton>
                        <Tooltip>Specs available on request</Tooltip>
                      </TooltipTrigger>
                    ) : (
                      <SpecsModal product={p} />
                    )}
                  </div>
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

/* BoardUI Modal + Table: full spec sheet for a product */
function SpecsModal({ product: p }) {
  return (
    <ModalTrigger>
      <BButton variant="secondary" size="small" leadingIcon={RiFileList3Line} className="rounded-full px-3">View specs</BButton>
      <Modal size="lg">
        {({ close }) => (
          <>
            <ModalHeader title={p.name} description={p.summary} />
            <ModalBody className="space-y-5">
              <div className="flex items-center gap-4 rounded-xl bg-background-secondary-default p-3">
                <img src={p.img} alt="" className="size-20 shrink-0 object-contain" />
                <div className="flex flex-wrap gap-2">
                  <Chip variant="caption" color="orange">{p.size}</Chip>
                  <Chip variant="caption" color="lime">All-weather</Chip>
                  <Chip variant="caption" color="soft">{p.platform}</Chip>
                </div>
              </div>
              <Table aria-label={p.name + ' specifications'} size="sm">
                <TableHeader>
                  <TableColumn isRowHeader>Parameter</TableColumn>
                  <TableColumn>Value</TableColumn>
                </TableHeader>
                <TableBody>
                  {p.specs.map(([k, v]) => (
                    <TableRow key={k} id={k}>
                      <TableCell><span className="font-mono text-xs uppercase tracking-[0.12em] text-text-secondary">{k}</span></TableCell>
                      <TableCell>{v}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ModalBody>
            <ModalFooter>
              <BButton variant="secondary" onClick={close} className="rounded-full px-3">Close</BButton>
              <BButton
                variant="glow"
                className="px-4"
                leadingIcon={RiMailSendLine}
                onClick={() => { close(); window.location.href = 'mailto:contact@vernius.systems?subject=' + encodeURIComponent(p.name + ' integration') }}
              >
                Discuss integration
              </BButton>
            </ModalFooter>
          </>
        )}
      </Modal>
    </ModalTrigger>
  )
}

/* ============================== ENGAGEMENT STAGES ============================== */
const STAGES = [
  { n: '01', t: 'Cue', d: 'Receives bearing, range and altitude from the cueing network.' },
  { n: '02', t: 'Midcourse', d: 'Active radar guides the interceptor beyond visual range.' },
  { n: '03', t: 'Terminal', d: 'Autonomous vision-based guidance for the final intercept.' },
]

export function Stages() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const draw = useTransform(scrollYProgress, [0.05, 0.9], [0, 1])
  const [stage, setStage] = useState(0)
  const [pct, setPct] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setStage(v < 0.33 ? 0 : v < 0.66 ? 1 : 2)
    setPct(Math.round(v * 100))
  })

  // interceptor dot follows the path
  const pathRef = useRef(null)
  const dotX = useTransform(draw, (v) => pathRef.current?.getPointAtLength(v * pathRef.current.getTotalLength()).x ?? 60)
  const dotY = useTransform(draw, (v) => pathRef.current?.getPointAtLength(v * pathRef.current.getTotalLength()).y ?? 520)

  return (
    <section id="sequence" ref={ref} className="relative h-[300vh] border-t border-line">
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1440px] flex-1 items-center gap-10 px-4 pb-6 pt-24 md:px-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="eyebrow">04 — Engagement sequence</div>
            <h2 className="display mt-5 text-[clamp(2.2rem,4.2vw,4rem)]">Cue. Guide.<br /><span className="text-accent">Intercept.</span></h2>
            <div className="mt-8 space-y-2">
              {STAGES.map((s, i) => (
                <div key={s.n} className={cx('relative rounded-xl border p-5 transition-all duration-500', stage === i ? 'border-line-strong bg-surface' : 'border-transparent opacity-40')}>
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-accent">{s.n}</span>
                    <span className="text-xl font-semibold">{s.t}</span>
                  </div>
                  <AnimatePresence initial={false}>
                    {stage === i && (
                      <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-9 text-fg-muted">
                        <span className="block pt-2">{s.d}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden aspect-[4/3] max-h-[72svh] w-full lg:col-span-7 lg:block">
            <svg viewBox="0 0 800 600" className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="trail" x1="0" x2="1">
                  <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0" />
                  <stop offset="1" stopColor="var(--color-accent)" />
                </linearGradient>
              </defs>
              {/* range rings around target */}
              {[40, 90, 150].map((r) => (
                <circle key={r} cx="700" cy="110" r={r} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeDasharray="2 6" />
              ))}
              {/* zones */}
              <text x="60" y="580" className="fill-fg-subtle font-mono text-[11px] tracking-widest">LAUNCH</text>
              <text x="300" y="300" className="fill-fg-subtle font-mono text-[11px] tracking-widest">RADAR MIDCOURSE · BVR</text>
              <text x="560" y="40" className="fill-fg-subtle font-mono text-[11px] tracking-widest">TERMINAL</text>
              <path ref={pathRef} d="M60 540 C 220 520, 260 340, 420 300 S 640 200, 700 110" fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="2" strokeDasharray="4 6" />
              <motion.path d="M60 540 C 220 520, 260 340, 420 300 S 640 200, 700 110" fill="none" stroke="url(#trail)" strokeWidth="3" style={{ pathLength: draw }} />
              {/* cue line */}
              <motion.line x1="60" y1="540" x2="700" y2="110" stroke="var(--color-signal)" strokeOpacity="0.35" strokeDasharray="3 8" initial={{ pathLength: 0 }} animate={{ pathLength: stage >= 0 ? 1 : 0 }} transition={{ duration: 1.2 }} />
              {/* target */}
              <g transform="translate(700 110)">
                <circle r="7" className={stage === 2 ? 'fill-signal' : 'fill-fg'} />
                <circle r="16" fill="none" stroke="var(--color-signal)" className="ping-ring origin-center [transform-box:fill-box]" />
              </g>
              <text x="716" y="100" className="fill-signal font-mono text-[11px]">SHAHED-CLASS</text>
              {/* interceptor */}
              <motion.circle cx={dotX} cy={dotY} r="6" className="fill-accent" />
              <motion.circle cx={dotX} cy={dotY} r="22" fill="none" stroke="var(--color-accent)" strokeOpacity="0.5" />
            </svg>
          </div>
        </div>
        <div className="mx-auto mb-8 w-[calc(100%-2rem)] max-w-[1440px] md:w-[calc(100%-4rem)]">
          <ProgressBar
            label={<span className="font-mono text-[11px] uppercase tracking-[0.18em]">Stage {STAGES[stage].n} · {STAGES[stage].t}</span>}
            value={pct}
            size="sm"
          />
        </div>
      </div>
    </section>
  )
}

/* Team lives in ./Team.jsx */
export { Team } from './Team'

/* ============================== CONTACT / FOOTER ============================== */
export function Contact() {
  const [copied, setCopied] = useState(false)
  const email = 'contact@vernius.systems'
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      toast.success('Email copied', { description: email, duration: 3000 })
      setTimeout(() => setCopied(false), 1800)
    } catch {
      toast.error('Couldn’t copy', { description: `Write to ${email}` })
    }
  }
  return (
    <section id="contact" className="relative overflow-hidden border-t border-line">
      <div className="pointer-events-none absolute left-1/2 top-full size-[140vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(224_138_79/0.22),transparent_60%)]" />
      <div className="relative mx-auto max-w-[1440px] px-4 py-28 text-center md:px-8 md:py-40">
        <Badge className="mx-auto">Now working with airframe partners</Badge>
        <RevealText as="h2" text={'Put a seeker\non your interceptor.'} className="display mx-auto mt-8 text-[clamp(2.8rem,8vw,8rem)]" />
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href={`mailto:${email}`}>Get in touch</Button>
          <TooltipTrigger delay={200}>
            <BButton
              variant="secondary"
              trailingIcon={copied ? RiCheckLine : RiFileCopyLine}
              onClick={copy}
              className="h-12 rounded-full px-5 font-mono text-[14px]"
            >
              {email}
            </BButton>
            <Tooltip>Copy email address</Tooltip>
          </TooltipTrigger>
        </div>
      </div>

      <footer className="relative">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <Divider align="center" contentClassName="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em]">
            Press <Kbd>⌘</Kbd><Kbd>K</Kbd> to jump anywhere
          </Divider>
        </div>
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-8 font-mono text-[11px] uppercase tracking-[0.15em] text-fg-subtle md:flex-row md:items-center md:justify-between md:px-8">
          <span>© 2026 Vernius Inc.</span>
          <span>Backed by Y Combinator</span>
          <a href={`mailto:${email}`} className="hover:text-fg">{email}</a>
        </div>
        {/* giant wordmark: only the top ~75% of the letters shows, the rest is cut off by the page bottom */}
        <div aria-hidden className="h-[16.3vw] select-none overflow-hidden">
          <div className="display px-2 text-center text-[24vw] leading-[0.8] text-white/[0.04]">Vernius</div>
        </div>
      </footer>
    </section>
  )
}
