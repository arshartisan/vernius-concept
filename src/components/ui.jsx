'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring, animate } from 'motion/react'
import { cx } from '@/utils/cx'
import { ButtonLink } from '@/components/base/buttons/button'
import { Chip } from '@/components/base/badges/chip'
import { RiArrowRightLine } from '@remixicon/react'

/* ---------- Button: BoardUI ButtonLink + magnetic pointer follow ---------- */
const HERO_SIZE = 'h-12 rounded-full px-5 text-[15px] [&>svg]:size-[18px]'

export function Button({ variant = 'glow', size = 'hero', className, children, href, ...props }) {
  const ref = useRef(null)
  const x = useSpring(0, { stiffness: 220, damping: 18 })
  const y = useSpring(0, { stiffness: 220, damping: 18 })
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.25)
    y.set((e.clientY - r.top - r.height / 2) * 0.35)
  }
  const reset = () => { x.set(0); y.set(0) }

  return (
    <motion.span ref={ref} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset} className="inline-flex">
      <ButtonLink
        href={href}
        variant={variant}
        size={size === 'hero' ? 'medium' : size}
        trailingIcon={RiArrowRightLine}
        className={cx(size === 'hero' && HERO_SIZE, className)}
        {...props}
      >
        {children}
      </ButtonLink>
    </motion.span>
  )
}

/* ---------- Badge: BoardUI Chip with a live status ping ---------- */
export function Badge({ className, children, dot = true, color = 'orange' }) {
  return (
    <Chip variant="caption" color={color} className={cx('gap-2 px-2.5 font-mono uppercase tracking-[0.14em] backdrop-blur', className)}>
      {dot && (
        <span className="relative flex size-1.5">
          <span className="ping-ring absolute inset-0 rounded-full bg-current" />
          <span className="relative size-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </Chip>
  )
}

/* ---------- Word-by-word reveal headline ---------- */
export function RevealText({ text, className, delay = 0, as: Tag = 'h2' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const lines = text.split('\n')
  return (
    <Tag ref={ref} className={className} aria-label={text.replace(/\n/g, ' ')}>
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden>
          {line.split(' ').map((w, wi) => (
            <span key={wi} className="inline-block overflow-hidden pb-[0.08em] align-top">
              <motion.span
                className="inline-block"
                initial={{ y: '110%', rotate: 4 }}
                animate={inView ? { y: '0%', rotate: 0 } : {}}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: delay + (li * 4 + wi) * 0.05 }}
              >
                {w}&nbsp;
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}

/* ---------- Fade-up on view ---------- */
export function FadeIn({ children, className, delay = 0, y = 30 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Count-up number ---------- */
export function Counter({ to, prefix = '', suffix = '', decimals = 0, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 2.2, ease: [0.16, 1, 0.3, 1], onUpdate: setVal })
    return () => c.stop()
  }, [inView, to])
  return (
    <span ref={ref} className={className}>
      {prefix}{val.toFixed(decimals)}{suffix}
    </span>
  )
}

/* ---------- Scramble text (decrypt effect) ---------- */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>'
export function Scramble({ text, className, trigger = true }) {
  const [out, setOut] = useState(text)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView || !trigger) return
    let frame = 0
    const total = 24
    const id = setInterval(() => {
      frame++
      setOut(
        text.split('').map((ch, i) => {
          if (ch === ' ') return ' '
          return i < (frame / total) * text.length ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        }).join('')
      )
      if (frame >= total) clearInterval(id)
    }, 40)
    return () => clearInterval(id)
  }, [inView, trigger, text])
  return <span ref={ref} className={className}>{out}</span>
}

/* ---------- 3D tilt card with pointer spotlight ---------- */
export function TiltCard({ className, children, intensity = 8 }) {
  const ref = useRef(null)
  const rx = useSpring(0, { stiffness: 150, damping: 15 })
  const ry = useSpring(0, { stiffness: 150, damping: 15 })
  const mx = useMotionValue('50%')
  const my = useMotionValue('50%')

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * intensity)
    rx.set(-(py - 0.5) * intensity)
    mx.set(`${px * 100}%`)
    my.set(`${py * 100}%`)
  }
  const reset = () => { rx.set(0); ry.set(0) }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000, '--mx': mx, '--my': my }}
      className={cx('group relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface', className)}
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(500px circle at var(--mx) var(--my), rgb(224 138 79 / 0.13), transparent 45%)' }}
      />
      {children}
    </motion.div>
  )
}
