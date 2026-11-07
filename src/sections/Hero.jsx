'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react'
import { RiShieldStarLine, RiFoggyLine } from '@remixicon/react'
import { cx } from '@/utils/cx'
import { Button } from '../components/ui'

/* Framed spotlight hero: column grid, headline top-left, the cut-out interceptor centred in a
 * copper glow with orbit rings and labelled markers, notched info cards in the side columns. */
const ease = [0.16, 1, 0.3, 1]

// marker positions are % of the drone stage
const MARKERS = [
  { x: 58, y: 25, label: 'Archimedes radar seeker' },
  { x: 25, y: 66, label: 'Copper-wound motors' },
  { x: 80, y: 41, label: 'Fold-out wings' },
]

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const droneY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const droneScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const fade = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-50%'])

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 50, damping: 18 })
  const sy = useSpring(py, { stiffness: 50, damping: 18 })
  const rotY = useTransform(sx, [-1, 1], [-9, 9])
  const rotX = useTransform(sy, [-1, 1], [7, -7])
  const ringX = useTransform(sx, [-1, 1], [-14, 14])
  const ringY = useTransform(sy, [-1, 1], [-10, 10])
  const onMove = (e) => {
    px.set((e.clientX / window.innerWidth) * 2 - 1)
    py.set((e.clientY / window.innerHeight) * 2 - 1)
  }

  return (
    <section ref={ref} id="top" onPointerMove={onMove} className="relative h-svh min-h-[760px] overflow-hidden bg-[#070707]">
      {/* smoke + copper glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,rgb(255_255_255/0.05),transparent_70%)]" />
      <motion.div
        animate={{ opacity: [0.75, 1, 0.75], scale: [1, 1.06, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-1/2 top-[46%] size-[min(70vw,720px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(224_138_79/0.42),rgb(135_72_37/0.16)_38%,transparent_68%)] blur-2xl"
      />

      {/* frame lines */}
      <FrameLines />

      {/* headline */}
      <motion.div style={{ opacity: fade, y: titleY }} className="relative z-20 px-5 pt-28 md:px-10 lg:pl-[calc(4%+24px)] lg:pt-36">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease }} className="flex items-center gap-2 text-[13px] text-fg-muted">
          <span className="h-px w-5 bg-fg-muted" /><span className="size-1 bg-accent" /> Made for existing interceptors
        </motion.div>
        <h1 className="mt-4 max-w-[640px] text-[clamp(2.6rem,4.6vw,4.6rem)] font-normal leading-[0.98] tracking-[-0.05em]" aria-label="Low cost radars for interceptors">
          {['Low cost radars', 'for interceptors'].map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]" aria-hidden>
              <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease, delay: 0.2 + i * 0.1 }} className="block">
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
      </motion.div>

      {/* drone stage */}
      <motion.div style={{ y: droneY, scale: droneScale }} className="pointer-events-none absolute left-1/2 top-[50%] z-10 aspect-square w-[min(92vw,560px,64svh)] -translate-x-1/2 -translate-y-[38%] md:top-[50%] md:-translate-y-1/2">
        {/* orbit rings */}
        <motion.svg style={{ x: ringX, y: ringY }} viewBox="0 0 600 600" className="absolute inset-[-8%] size-[116%] overflow-visible" aria-hidden>
          <motion.g animate={{ rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: 'linear' }} style={{ originX: '300px', originY: '300px' }}>
            <circle cx="300" cy="300" r="215" fill="none" stroke="rgb(255 255 255 / 0.16)" />
            <circle cx="515" cy="300" r="3" fill="rgb(255 255 255 / 0.7)" />
          </motion.g>
          <motion.g animate={{ rotate: -360 }} transition={{ duration: 120, repeat: Infinity, ease: 'linear' }} style={{ originX: '300px', originY: '300px' }}>
            <circle cx="300" cy="300" r="262" fill="none" stroke="rgb(255 255 255 / 0.1)" strokeDasharray="2 6" />
            <circle cx="38" cy="300" r="3" fill="var(--color-accent)" />
          </motion.g>
          <Cross x={505} y={95} />
          <Cross x={95} y={505} />
        </motion.svg>

        <motion.div style={{ rotateY: rotY, rotateX: rotX }} className="absolute inset-[12%] [perspective:1000px]">
          <motion.img
            src="/images/drone-top-cutout.webp"
            alt="Interceptor carrying the Archimedes radar seeker"
            fetchPriority="high"
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: [0, -14, 0] }}
            transition={{ opacity: { duration: 1.2, ease }, scale: { duration: 1.4, ease }, filter: { duration: 1.2 }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
            className="size-full object-contain drop-shadow-[0_40px_50px_rgb(0_0_0/0.75)]"
          />
        </motion.div>

        {/* markers */}
        {MARKERS.map((m, i) => <Marker key={m.label} {...m} delay={1.4 + i * 0.2} />)}
      </motion.div>

      {/* left card: pilot telemetry */}
      <motion.div
        style={{ opacity: fade }}
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease, delay: 1 }}
        className="absolute bottom-0 left-[4%] z-20 hidden w-[230px] lg:block xl:w-[250px]"
      >
        <Notched corner="tr">
          <div className="p-4">
            <h3 className="text-[15px] font-medium tracking-[-0.02em]">Live pilot telemetry</h3>
            <p className="mt-2 text-[12px] leading-snug text-fg-muted">Operator-assisted mode streams live target range and bearing to the pilot flying manually.</p>
          </div>
          <Phone />
        </Notched>
      </motion.div>

      {/* right cards */}
      <motion.div
        style={{ opacity: fade }}
        initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1, ease, delay: 1.1 }}
        className="absolute right-[4%] top-[22%] z-20 hidden w-[230px] lg:block xl:w-[250px]"
      >
        <Notched corner="tl">
          <div className="p-4">
            <span className="grid size-6 place-items-center bg-accent text-ink"><RiShieldStarLine className="size-3.5" aria-hidden /></span>
            <h3 className="mt-4 text-[15px] font-medium tracking-[-0.02em]">Backed by Y Combinator</h3>
            <p className="mt-2 text-[12px] leading-snug text-fg-muted">Spun out of Defense Tech for Ukraine. We work directly with operators and airframe partners.</p>
          </div>
        </Notched>
      </motion.div>

      <motion.div
        style={{ opacity: fade }}
        initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1, ease, delay: 1.25 }}
        className="absolute bottom-10 right-[4%] z-20 hidden w-[230px] px-4 lg:block xl:w-[250px]"
      >
        <RiFoggyLine className="size-7 text-fg-subtle" aria-hidden />
        <h3 className="mt-4 text-[15px] font-medium tracking-[-0.02em]">All-weather detection</h3>
        <p className="mt-2 text-[12px] leading-snug text-fg-muted">Detects Shahed-class targets beyond visual range, in fog, smoke, rain and darkness.</p>
      </motion.div>

      {/* CTA */}
      <motion.div
        style={{ opacity: fade }}
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, ease, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 md:bottom-12"
      >
        <Button href="#products">Explore more</Button>
      </motion.div>
    </section>
  )
}

function FrameLines() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block" aria-hidden>
      {['left-[24%]', 'right-[24%]'].map((pos, i) => (
        <motion.span
          key={pos}
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.4, ease, delay: 0.1 + i * 0.1 }}
          className={cx('absolute top-0 h-full w-px origin-top bg-white/[0.08]', pos)}
        />
      ))}
      <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.4, ease }} className="absolute inset-x-0 top-[92px] h-px origin-left bg-white/[0.08]" />
      {['left-[24%]', 'right-[24%]'].map((pos) => (
        <span key={pos} className={cx('absolute top-[89px] size-[7px] -translate-x-[3px] bg-white/40', pos === 'right-[24%]' && 'translate-x-[3px]', pos)} />
      ))}
    </div>
  )
}

function Cross({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <motion.circle r="14" fill="none" stroke="rgb(255 255 255 / 0.35)" animate={{ r: [14, 18, 14] }} transition={{ duration: 3, repeat: Infinity }} />
      <path d="M-5 0H5M0 -5V5" stroke="rgb(255 255 255 / 0.7)" />
    </g>
  )
}

function Marker({ x, y, label, delay }) {
  const [hover, setHover] = useState(false)
  return (
    <motion.button
      type="button"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease, delay }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      aria-label={label}
      style={{ left: `${x}%`, top: `${y}%` }}
      className="pointer-events-auto absolute z-10 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/30 backdrop-blur-sm"
    >
      <span className="ping-ring absolute inset-0 rounded-full border border-accent/70" />
      <span className="text-[13px] leading-none text-fg">+</span>
      <motion.span
        initial={false}
        animate={{ opacity: hover ? 1 : 0, y: hover ? 0 : 4 }}
        className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-line-strong bg-[#0c0c0d]/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fg"
      >
        {label}
      </motion.span>
    </motion.button>
  )
}

/* Card with one clipped corner and a hairline border that follows the cut. */
function Notched({ corner = 'tr', children }) {
  const c = 22
  const clip = corner === 'tr'
    ? `polygon(0 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% 100%, 0 100%)`
    : `polygon(${c}px 0, 100% 0, 100% 100%, 0 100%, 0 ${c}px)`
  return (
    <div style={{ clipPath: clip }} className="bg-white/[0.14] p-px">
      <div style={{ clipPath: clip }} className="bg-[#111112]/90 backdrop-blur-xl">{children}</div>
    </div>
  )
}

/* Phone mockup with a live-looking operator display. */
function Phone() {
  return (
    <div className="mx-4 h-[150px] overflow-hidden rounded-t-[22px] border-x border-t border-white/20 bg-[#050505] p-3 xl:h-[160px]">
      <div className="relative h-full overflow-hidden rounded-t-[14px] bg-[#0b0b0c]">
        <svg viewBox="0 0 200 140" className="absolute inset-0 size-full" aria-hidden>
          {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${-20 + i * 40} 0 L${30 + i * 40} 140`} stroke="rgb(255 255 255 / 0.06)" />)}
          {[0, 1, 2, 3].map((i) => <path key={`h${i}`} d={`M0 ${20 + i * 34} L200 ${10 + i * 34}`} stroke="rgb(255 255 255 / 0.06)" />)}
          <motion.circle cx="120" cy="78" r="6" fill="none" stroke="var(--color-signal)" animate={{ r: [6, 26], opacity: [0.8, 0] }} transition={{ duration: 2, repeat: Infinity }} />
          <circle cx="120" cy="78" r="3" fill="var(--color-signal)" />
        </svg>
        <div className="absolute left-3 top-3 text-[9.5px] leading-tight">
          <div className="text-fg-subtle">Link</div>
          <div className="font-medium text-fg">Archimedes 1A</div>
        </div>
        <span className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-white text-ink">
          <span className="size-1.5 rounded-full bg-ink" />
        </span>
        <div className="absolute bottom-2 left-3 font-mono text-[9.5px] text-signal">RNG 1.84 KM · BRG 042°</div>
      </div>
    </div>
  )
}
