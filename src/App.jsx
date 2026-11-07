'use client'

import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { motion, useScroll, useSpring, AnimatePresence, useMotionValue } from 'motion/react'
import Hero from './sections/Hero'
import ScrollVideo from './sections/ScrollVideo'
import { Marquee, Problem, Capabilities, Products, Stages, Team, Contact } from './sections/Sections'
import { cx } from '@/utils/cx'
import { Button as BButton, ButtonLink } from '@/components/base/buttons/button'
import { Toaster } from '@/components/base/toast/toast'
import { Kbd } from '@/components/base/kbd/kbd'
import { toast } from '@/components/base/toast/toast'
import { CommandPalette, CommandPaletteSection, CommandPaletteItem } from '@/components/base/command-palette/command-palette'
import {
  RiMenuLine, RiCloseLine, RiSearchLine, RiAlertLine, RiRadarLine, RiBox3Line, RiFocus3Line,
  RiRouteLine, RiTeamLine, RiMailSendLine, RiFileCopyLine, RiArrowUpLine, RiCompass3Line,
} from '@remixicon/react'

const NAV = [
  ['Problem', '#problem'],
  ['Capabilities', '#capabilities'],
  ['Products', '#products'],
  ['Archimedes 1A', '#archimedes'],
  ['Team', '#team'],
]

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: { offset: 0 } })
    window.__lenis = lenis
    let id
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf) }
    id = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(id); lenis.destroy(); delete window.__lenis }
  }, [])

  return (
    <div className="grain">
      <ProgressBar />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Problem />
        <Capabilities />
        <ScrollVideo />
        <Products />
        <Stages />
        <Team />
        <Contact />
      </main>
      <Toaster />
    </div>
  )
}

/* ---------- ⌘K command palette (BoardUI CommandPalette) ---------- */
const EMAIL = 'contact@vernius.systems'
const JUMPS = [
  { id: 'top', label: 'Back to top', icon: RiArrowUpLine, target: 0 },
  { id: 'problem', label: 'The problem', icon: RiAlertLine, target: '#problem' },
  { id: 'capabilities', label: 'Capabilities', icon: RiCompass3Line, target: '#capabilities' },
  { id: 'archimedes', label: 'Archimedes 1A teardown', icon: RiFocus3Line, target: '#archimedes', desc: 'Scroll video' },
  { id: 'products', label: 'Products', icon: RiBox3Line, target: '#products' },
  { id: 'sequence', label: 'Engagement sequence', icon: RiRouteLine, target: '#sequence' },
  { id: 'team', label: 'Team', icon: RiTeamLine, target: '#team' },
  { id: 'contact', label: 'Contact', icon: RiRadarLine, target: '#contact' },
]

export function scrollToTarget(target) {
  const lenis = window.__lenis
  if (lenis) lenis.scrollTo(target, { duration: 1.6 })
  else if (target === 0) window.scrollTo({ top: 0, behavior: 'smooth' })
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
}

function Palette({ open, onOpenChange }) {
  const run = async (key) => {
    const jump = JUMPS.find((j) => j.id === key)
    if (jump) return scrollToTarget(jump.target)
    if (key === 'email') window.location.href = `mailto:${EMAIL}`
    if (key === 'copy') {
      try { await navigator.clipboard.writeText(EMAIL); toast.success('Email copied', { description: EMAIL, duration: 3000 }) }
      catch { toast.error('Couldn’t copy', { description: `Write to ${EMAIL}` }) }
    }
  }
  return (
    <CommandPalette isOpen={open} onOpenChange={onOpenChange} onAction={run} placeholder="Jump to a section or run an action…">
      <CommandPaletteSection title="Navigate">
        {JUMPS.map((j) => (
          <CommandPaletteItem key={j.id} id={j.id} icon={j.icon} description={j.desc}>{j.label}</CommandPaletteItem>
        ))}
      </CommandPaletteSection>
      <CommandPaletteSection title="Contact">
        <CommandPaletteItem id="email" icon={RiMailSendLine} description={EMAIL}>Email Vernius</CommandPaletteItem>
        <CommandPaletteItem id="copy" icon={RiFileCopyLine}>Copy email address</CommandPaletteItem>
      </CommandPaletteSection>
    </CommandPalette>
  )
}

function ProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent" />
}

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [palette, setPalette] = useState(false)
  const [isMac, setIsMac] = useState(false)
  useEffect(() => { setIsMac(/Mac|iPhone|iPad/.test(navigator.platform)) }, [])
  // Hide on scroll down, slide back in from the top on scroll up (always shown near the top).
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    let last = window.scrollY
    const on = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      if (y < 120) setHidden(false)
      else if (y > last + 6) setHidden(true)
      else if (y < last - 6) setHidden(false)
      if (Math.abs(y - last) > 6) last = y
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const show = !hidden || open || palette

  return (
    <motion.header
      initial={false}
      animate={{ y: show ? 0 : '-130%' }}
      transition={{ duration: show ? 0.55 : 0.4, ease: [0.16, 1, 0.3, 1] }}
      onFocusCapture={() => setHidden(false)}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4"
    >
      <nav className={cx('mx-auto flex max-w-[1000px] items-center justify-between rounded-full border p-2.5 transition-all duration-500', scrolled ? 'border-line-strong bg-bg/75 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.6)] backdrop-blur-xl' : 'border-white/10 bg-bg/85 backdrop-blur-xl')}>
        <a href="#" className="flex items-center gap-2.5" aria-label="Vernius home">
          <Logo />
          <span className="display text-xl tracking-[-0.03em]">Vernius</span>
        </a>
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map(([l, h]) => (
            <li key={h}>
              <a href={h} className="group relative rounded-full px-4 py-2 text-sm text-fg-muted transition-colors hover:text-fg">
                {l}
                <span className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <BButton
            variant="secondary"
            size="small"
            leadingIcon={RiSearchLine}
            onClick={() => setPalette(true)}
            aria-label="Open command palette"
            className="hidden gap-1.5 rounded-full bg-transparent px-3 md:inline-flex [&>span]:gap-1.5"
          >
            <span className="text-text-secondary">Jump to</span>
            <Kbd>{isMac ? '⌘' : 'Ctrl'}</Kbd><Kbd>K</Kbd>
          </BButton>
          <ButtonLink href="#contact" variant="glow" size="small" className="hidden px-3 sm:inline-flex">Get in touch</ButtonLink>
          <BButton
            variant="secondary"
            size="small"
            iconOnly
            leadingIcon={open ? RiCloseLine : RiMenuLine}
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="rounded-full lg:hidden"
          />
        </div>
      </nav>
      <Palette open={palette} onOpenChange={setPalette} />
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mx-auto mt-2 max-w-[1440px] rounded-3xl border border-line-strong bg-bg/90 p-4 backdrop-blur-xl lg:hidden">
            {NAV.map(([l, h], i) => (
              <motion.a key={h} href={h} onClick={() => setOpen(false)} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="display block border-b border-line py-3 text-3xl last:border-0">
                {l}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
      <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeOpacity="0.3" />
      <circle cx="16" cy="16" r="8" fill="none" stroke="currentColor" strokeOpacity="0.5" />
      <path d="M16 16 L16 2 A14 14 0 0 1 28.1 9 Z" fill="var(--color-accent)" fillOpacity="0.85">
        <animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="6s" repeatCount="indefinite" />
      </path>
      <circle cx="16" cy="16" r="2" fill="currentColor" />
    </svg>
  )
}

/* Custom cursor: a ring that eases behind the pointer and grows over interactive elements (desktop only). */
function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40 })
  const sy = useSpring(y, { stiffness: 500, damping: 40 })
  const [hover, setHover] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)
    const move = (e) => {
      x.set(e.clientX); y.set(e.clientY)
      setHover(!!e.target.closest?.('a,button,[role=tab]'))
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [x, y])

  if (!enabled) return null
  return (
    <motion.div
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[70] mix-blend-difference"
    >
      <motion.div
        animate={{ width: hover ? 56 : 14, height: hover ? 56 : 14, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-white/0"
        style={{ backgroundColor: hover ? 'transparent' : 'white' }}
      />
    </motion.div>
  )
}
