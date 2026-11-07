'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react'
import {
  RiRadarLine, RiFoggyLine, RiShowersLine, RiMoonClearLine, RiWindyLine, RiPlayFill, RiArrowDownSLine,
} from '@remixicon/react'
import { cx } from '@/utils/cx'
import { Button } from '../components/ui'

/* Studio hero: a light "product shot" panel inset into the dark page.
 * Two renders of the interceptor rotate (auto-advance, or pick via thumbnails / index). */
const SHOTS = [
  { src: '/images/hero-drone-front.webp', alt: 'Interceptor drone with Archimedes radar nose cone, front view', label: 'Front' },
  { src: '/images/hero-drone-top.webp', alt: 'Interceptor drone with Archimedes radar nose cone, top view', label: 'Top' },
]
const INTERVAL = 6000
const ease = [0.16, 1, 0.3, 1]

export default function Hero() {
  const ref = useRef(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [tick, setTick] = useState(0) // restarts the thumbnail progress bar

  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => setActive((a) => (a + 1) % SHOTS.length), INTERVAL)
    return () => clearTimeout(t)
  }, [active, paused, tick])

  const pick = (i) => { setActive(i); setTick((n) => n + 1) }

  // scroll: drone drifts up and grows, copy fades
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const droneY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const droneScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const ghostX = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  // pointer parallax
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 50, damping: 18 })
  const sy = useSpring(py, { stiffness: 50, damping: 18 })
  const rot = useTransform(sx, [-30, 30], [-2.5, 2.5])
  const cardX = useTransform(sx, (v) => v * -0.6)
  const cardY = useTransform(sy, (v) => v * -0.6)
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    px.set(((e.clientX - r.left) / r.width - 0.5) * 60)
    py.set(((e.clientY - r.top) / r.height - 0.5) * 40)
  }

  return (
    <section ref={ref} id="top" className="relative h-svh min-h-[720px] p-2 md:p-3">
      <div
        onPointerMove={onMove}
        className="relative isolate h-full overflow-hidden rounded-[22px] bg-studio text-ink md:rounded-[28px]"
      >
        {/* soft studio light */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_55%_40%,rgb(255_255_255/0.35),transparent_70%)]" />

        {/* ghost word */}
        <motion.div
          style={{ x: ghostX }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease }}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[14%] select-none whitespace-nowrap text-center font-serif text-[22vw] leading-none tracking-[-0.03em] text-white/45 md:top-[12%] md:text-[15.5vw]"
        >
          ARCHIMEDES
        </motion.div>

        {/* drone */}
        <motion.div
          style={{ y: droneY, scale: droneScale }}
          className="pointer-events-none absolute inset-x-0 top-[13%] mx-auto aspect-[2752/1536] w-[118%] max-w-none -translate-x-[8%] md:left-[4%] md:top-[-4%] md:w-[78%] md:translate-x-0 lg:w-[72%]"
        >
          <motion.div style={{ x: sx, y: sy, rotate: rot }} className="size-full">
            <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="relative size-full">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.img
                  key={SHOTS[active].src}
                  src={SHOTS[active].src}
                  alt={SHOTS[active].alt}
                  initial={{ opacity: 0, scale: 0.94, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
                  transition={{ duration: 1.1, ease }}
                  fetchPriority="high"
                  className="absolute inset-0 size-full object-contain [mask-image:radial-gradient(ellipse_50%_55%_at_50%_50%,black_62%,transparent_100%)]"
                />
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* vertical product label */}
        <motion.div style={{ opacity: fade }} className="absolute left-5 top-28 hidden flex-col items-center gap-8 md:flex lg:left-7">
          <span className="font-serif text-[15px] tracking-[0.18em] text-ink/75 [writing-mode:vertical-rl] rotate-180">
            ARCHIMEDES 1A · RADAR SEEKER
          </span>
          <span className="flex flex-col gap-2" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className={cx('h-px bg-ink/40', i === 3 ? 'w-6' : 'w-4')} />
            ))}
          </span>
        </motion.div>

        {/* glass cards */}
        <motion.div style={{ x: cardX, y: cardY, opacity: fade }} className="absolute right-[6%] top-[22%] hidden md:block lg:right-[9%]">
          <GlassCard delay={1.0} className="w-[260px]">
            <div className="flex items-center gap-2 text-[15px] font-semibold">
              <RiRadarLine className="size-[18px] text-accent-600" aria-hidden /> Active radar seeker
            </div>
            <p className="mt-2 text-[13px] leading-snug text-ink-muted">
              Detects Shahed-class targets beyond visual range, then hands off to vision for the terminal phase.
            </p>
          </GlassCard>
        </motion.div>

        <motion.div style={{ x: cardX, y: cardY, opacity: fade }} className="absolute right-[3%] top-[47%] hidden lg:block xl:right-[6%]">
          <GlassCard delay={1.2} className="w-[290px]">
            <div className="flex items-center gap-3.5">
              <Ring value={50} label="50%+" />
              <p className="text-[13.5px] leading-snug">
                of Shaheds are now jet-powered, too fast to catch by eye.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-ink/10 px-2 pt-3 text-ink-muted" aria-label="Works in fog, rain, darkness and smoke">
              {[RiFoggyLine, RiShowersLine, RiMoonClearLine, RiWindyLine].map((I, i) => <I key={i} className="size-4" aria-hidden />)}
            </div>
          </GlassCard>
        </motion.div>

        {/* slide index */}
        <div className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-3 md:flex lg:right-7">
          {SHOTS.map((s, i) => (
            <button
              key={s.src}
              onClick={() => pick(i)}
              aria-label={`Show ${s.label.toLowerCase()} view`}
              aria-current={i === active}
              className={cx('flex items-center gap-2 font-mono text-[12px] transition-colors', i === active ? 'font-semibold text-ink' : 'text-ink/40 hover:text-ink/70')}
            >
              <motion.span animate={{ width: i === active ? 10 : 0 }} className="h-px bg-ink" />
              {String(i + 1).padStart(2, '0')}
            </button>
          ))}
        </div>

        {/* headline + copy */}
        <motion.div style={{ opacity: fade }} className="absolute inset-x-0 bottom-[118px] px-5 md:bottom-[160px] md:px-16 lg:px-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h1 className="font-display font-bold uppercase leading-[0.92] tracking-[-0.035em] text-[clamp(2.3rem,5vw,5.6rem)] md:whitespace-nowrap">
              <span className="block overflow-hidden">
                <motion.span initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease, delay: 0.3 }} className="block bg-[linear-gradient(90deg,var(--color-ink)_55%,rgb(13_13_14/0.25))] bg-clip-text text-transparent">
                  Low cost radars
                </motion.span>
              </span>
              <span className="block overflow-hidden pl-[0.9em]">
                <motion.span initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease, delay: 0.42 }} className="block">
                  <span className="mr-[0.25em] font-light tracking-[-0.12em] text-accent-600">///</span>
                  <span className="bg-[linear-gradient(90deg,var(--color-ink)_20%,rgb(13_13_14/0.12))] bg-clip-text text-transparent">for interceptors</span>
                </motion.span>
              </span>
            </h1>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.9 }} className="max-w-[440px] lg:mb-2">
              <div className="flex gap-4">
                <span className="mt-[11px] hidden h-px w-12 shrink-0 bg-ink/40 md:block" />
                <p className="text-[15px] leading-relaxed text-ink-muted">
                  Active radar seekers and ground radars for counter-UAS. All-weather Shahed detection that works with your existing interceptors and platforms.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-5 md:pl-16">
                <Button href="#products">Learn more</Button>
                <a href="#contact" className="group relative text-[15px] font-medium text-ink">
                  Get in touch
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-ink transition-transform duration-500 group-hover:scale-x-100" />
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* bottom row: thumbnails · preview · scroll */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 md:p-6">
          <div className="flex items-end gap-3" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
            {SHOTS.map((s, i) => (
              <button
                key={s.src}
                onClick={() => pick(i)}
                aria-label={`Show ${s.label.toLowerCase()} view`}
                aria-pressed={i === active}
                className={cx(
                  'group relative overflow-hidden rounded-2xl border bg-white/25 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.35)] backdrop-blur-md transition-all duration-500',
                  i === active ? 'h-[72px] w-[104px] border-white/70 md:h-[104px] md:w-[150px]' : 'h-[52px] w-[74px] border-white/40 opacity-80 hover:opacity-100 md:h-[72px] md:w-[104px]',
                )}
              >
                <img src={s.src} alt="" className="absolute inset-0 size-full scale-[1.9] object-contain transition-transform duration-700 group-hover:scale-[2.05]" />
                {i === active && (
                  <span className="absolute inset-x-3 bottom-2 h-[3px] overflow-hidden rounded-full bg-ink/15">
                    <motion.span
                      key={`${active}-${tick}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: paused ? undefined : 1 }}
                      transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
                      className="block h-full origin-left rounded-full bg-ink"
                    />
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-3">
            <a href="#archimedes" className="group hidden items-center gap-3 rounded-2xl border border-white/50 bg-white/30 p-2.5 pr-5 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.3)] backdrop-blur-md transition-colors hover:bg-white/45 md:flex">
              <span className="relative grid size-12 place-items-center rounded-full bg-ink text-white shadow-[0_6px_16px_-4px_rgb(0_0_0/0.5)] transition-transform duration-500 group-hover:scale-105">
                <span className="ping-ring absolute inset-0 rounded-full border border-ink/40" />
                <RiPlayFill className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block text-[14px] font-semibold">Watch the teardown</span>
                <span className="block text-[12.5px] text-ink-muted">Archimedes 1A, part by part</span>
              </span>
            </a>
            <a href="#problem" aria-label="Scroll to next section" className="grid h-[56px] w-11 place-items-center rounded-2xl border border-white/50 bg-white/30 backdrop-blur-md md:h-[72px]">
              <span className="flex flex-col -space-y-2.5">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}>
                    <RiArrowDownSLine className="size-4" aria-hidden />
                  </motion.span>
                ))}
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function GlassCard({ children, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.9, ease, delay }}
      className={cx(
        'rounded-2xl border border-white/55 bg-white/30 p-4 text-ink backdrop-blur-xl',
        'shadow-[0_20px_50px_-20px_rgb(0_0_0/0.35),inset_0_1px_0_rgb(255_255_255/0.6)]',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

function Ring({ value, label }) {
  const r = 22
  const c = 2 * Math.PI * r
  return (
    <span className="relative grid size-[58px] shrink-0 place-items-center">
      <svg viewBox="0 0 52 52" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <circle cx="26" cy="26" r={r} fill="none" stroke="rgb(13 13 14 / 0.1)" strokeWidth="4" />
        <motion.circle
          cx="26" cy="26" r={r} fill="none" stroke="var(--color-accent-500)" strokeWidth="4" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - value / 100) }}
          transition={{ duration: 1.6, ease, delay: 1.4 }}
        />
      </svg>
      <span className="text-[13px] font-semibold">{label}</span>
    </span>
  )
}
