'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { RiArrowRightUpLine } from '@remixicon/react'
import { cx } from '@/utils/cx'
import { Button } from '@/components/base/buttons/button'

/* ============================== FOOTER ==============================
 * A light "product sheet" panel in the hero's studio grey: wordmark and blurb on the left,
 * the render and a minimal contact form in the middle, view thumbnails on the right.
 * There is no form backend, so sending composes an email in the visitor's mail app. */

const ease = [0.16, 1, 0.3, 1]

const VIEWS = [
  { src: '/images/drone-front-cutout.webp', alt: 'Interceptor with Archimedes seeker, front view', fit: 'contain' },
  { src: '/images/drone-top-cutout.webp', alt: 'Interceptor with Archimedes seeker, top view', fit: 'contain' },
]

const LINKS = [
  ['Problem', '#problem'],
  ['Capabilities', '#capabilities'],
  ['Archimedes 1A', '#archimedes'],
  ['Products', '#products'],
  ['Team', '#team'],
]

export function SiteFooter({ email }) {
  const [view, setView] = useState(0)
  const v = VIEWS[view]

  return (
    <footer className="relative px-2 pb-2 md:px-3 md:pb-3">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 1, ease }}
        className="relative grid overflow-hidden rounded-[22px] bg-studio text-ink md:rounded-[28px] lg:min-h-[680px] lg:grid-cols-[1fr_2.3fr_1fr]"
      >
        {/* left: wordmark + blurb */}
        <div className="flex flex-col justify-between gap-10 p-6 md:p-8">
          <div>
            <div className="text-[clamp(3rem,5.4vw,5.2rem)] font-medium leading-[0.9] tracking-[-0.06em]">Vernius</div>
            <ul className="mt-8 hidden space-y-1.5 text-[13px] lg:block">
              {LINKS.map(([l, h]) => (
                <li key={h}>
                  <a href={h} className="group inline-flex items-center gap-1 text-ink-muted transition-colors hover:text-ink">
                    {l}
                    <RiArrowRightUpLine className="size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="max-w-[230px] space-y-4 text-[13px] leading-snug">
            <p>Low-cost active radar seekers and ground radars for counter-UAS. All-weather Shahed detection that works with existing interceptors.</p>
            <p className="text-ink-muted">Backed by Y Combinator</p>
          </div>
        </div>

        {/* middle: blurb, render, form */}
        <div className="flex flex-col border-ink/10 px-6 pb-8 md:px-8 lg:border-x lg:pt-8">
          <p className="ml-auto max-w-[360px] text-right text-[13px] leading-snug">
            Archimedes 1A is an active radar seeker head that adapts to existing interceptors, detecting targets beyond visual range in fog, smoke, rain and darkness.
          </p>

          <div className="relative mx-auto my-6 h-[clamp(260px,44svh,440px)] w-full max-w-[640px]">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.img
                key={v.src}
                src={v.src}
                alt={v.alt}
                initial={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.03, filter: 'blur(6px)' }}
                transition={{ duration: 0.7, ease }}
                className={cx(
                  'absolute inset-0 size-full',
                  v.fit === 'contain'
                    ? 'object-contain drop-shadow-[0_30px_30px_rgb(0_0_0/0.25)]'
                    : 'rounded-2xl object-cover',
                )}
              />
            </AnimatePresence>
          </div>

          <ContactForm email={email} />
        </div>

        {/* right: thumbnails */}
        <div className="flex flex-col justify-between gap-8 p-6 md:p-8">
          <div className="font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.14em] text-ink-muted">
            <div>© 2026 Vernius Inc.</div>
            <a href={`mailto:${email}`} className="normal-case tracking-normal text-ink underline-offset-4 hover:underline">{email}</a>
          </div>
          <div className="grid w-fit grid-cols-2 gap-2">
            {VIEWS.map((t, i) => (
              <button
                key={t.src}
                onClick={() => setView(i)}
                aria-label={`Show ${t.alt.toLowerCase()}`}
                aria-pressed={i === view}
                className={cx(
                  'relative size-16 overflow-hidden rounded-lg bg-white/40 p-1.5 transition-all duration-300 md:size-[72px]',
                  i === view ? 'ring-1 ring-ink/60' : 'opacity-70 hover:opacity-100',
                )}
              >
                <img src={t.src} alt="" className={cx('size-full', t.fit === 'contain' ? 'object-contain' : 'object-cover')} />
              </button>
            ))}
          </div>
        </div>
      </motion.div>

    </footer>
  )
}

function ContactForm({ email }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const subject = `Vernius enquiry from ${form.name}`
    const body = `${form.message}\n\n${form.name}\n${form.email}`
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <form onSubmit={submit} className="mx-auto mt-auto w-full max-w-[360px] space-y-5">
      <Field label="Name" required value={form.name} onChange={set('name')} autoComplete="name" />
      <Field label="Email" type="email" required value={form.email} onChange={set('email')} autoComplete="email" />
      <Field label="Message" value={form.message} onChange={set('message')} />
      <Button
        type="submit"
        variant="glow"
        trailingIcon={RiArrowRightUpLine}
        className="mt-3 h-12 w-full rounded-full text-[15px]"
      >
        {sent ? 'Opening your mail app…' : 'Send message'}
      </Button>
      <p className="text-center text-[11.5px] text-ink-muted">Opens your email app, addressed to {email}.</p>
    </form>
  )
}

function Field({ label, required, ...props }) {
  return (
    <label className="group block">
      <span className="text-[12.5px]">{label}{required && '*'}</span>
      <span className="relative mt-1 block">
        <input
          required={required}
          {...props}
          className="peer block w-full border-b border-ink/40 bg-transparent pb-2 pt-1 text-[14px] outline-none placeholder:text-ink-muted"
        />
        <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-ink transition-transform duration-500 peer-focus:scale-x-100" />
      </span>
    </label>
  )
}
