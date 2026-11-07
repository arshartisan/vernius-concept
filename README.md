# Vernius — landing page

Next.js 16 (App Router) + React 19 + Tailwind v4 + [BoardUI](https://www.boardui.com) + Motion + Lenis.

```bash
npm install
npm run dev      # http://localhost:3000 (use `npx next dev -p 3100` if 3000 is taken)
npm run build    # production build; the page is prerendered as static HTML
npm start        # serve the production build
```

## Scroll-adaptive video
The 1080p upscale of `Cylinder_drone_exploding_parts_view_a38e70fd.webm` (190 frames, 24 fps, 1920×1080) is pre-extracted to
`public/frames/f001…f190.webp` (~7 MB). `src/sections/ScrollVideo.jsx` paints the frame matching scroll
progress onto a `<canvas>` inside a 520vh sticky section. This is frame-accurate in both directions
(seeking a `<video>` element stutters because it can only jump cleanly to keyframes).

To swap in a new video, regenerate the frames:
```bash
python -c "import cv2;c=cv2.VideoCapture('new.webm');i=0
while 1:
  ok,f=c.read()
  if not ok:break
  i+=1;cv2.imwrite(f'public/frames/f{i:03d}.webp',f,[cv2.IMWRITE_WEBP_QUALITY,78])"
```
Then update `FRAME_COUNT`, and the callout pixel coordinates if needed.

## Structure
- `src/app/layout.jsx`: metadata, viewport, `next/font` fallbacks, `<html class="dark">`
- `src/app/page.jsx`: renders `App`
- `src/App.jsx` (client): Lenis smooth scroll, nav, ⌘K palette, progress bar, custom cursor
- `src/sections/Hero.jsx`: parallax hero, radar scope
- `src/sections/ScrollVideo.jsx`: Archimedes 1A teardown
- `src/sections/Sections.jsx`: Problem, Capabilities, Products, Engagement sequence, Team, Contact
- `src/components/ui.jsx`: Button, Badge, RevealText, Counter, Scramble, TiltCard
- `src/index.css`: design tokens (`@theme`)

## BoardUI
Components were installed with `npx boardui@latest add … --path src/components/boardui`.
They import from `@/…`; `tsconfig.json` maps `@/*` to `src/components/boardui/*`.

- CTAs use Button's `glow` variant: a deep accent body with a lit lower rim and a soft bloom.
  The styles are in `src/components/boardui/styles/landing.css` (`.button-glow`) and are built from the accent ramp, so they follow the copper re-tint.
- Theme: `src/index.css` imports BoardUI's `styles/globals.css` and `styles/landing.css` and changes its accent from blue to Vernius copper (`--color-accent-50…950`).
  Dark mode is class-based (`<html class="dark">` in `index.html`).
- Where it's used:
  - Nav: `CommandPalette` (⌘K / Ctrl+K: jump to any section, email, copy email), `Kbd`, `Button`, `ButtonLink`
  - Hero / contact: `ButtonLink` CTAs, `Chip` badges, copy button with `Tooltip` + `toast` / `Toaster`
  - Problem: `Meter` on the jet-powered stat
  - Capabilities: bento grid in `src/sections/Capabilities.jsx` with animated SVG line art (isometric blocks are projected in code by `IsoScene`)
  - Archimedes teardown: `Spinner` while frames buffer, `ProgressTrack` scrub bar
  - Products: "View specs" `Modal` with a spec `Table`; `Chip`s; `Tooltip` on the restricted Barca 1
  - Engagement sequence: `ProgressBar` with stage label
  - Team: four animated cards in `src/sections/Team.jsx` (RF board pulses, build heat-map, filling dot grid, revision cascade)
  - Footer: `Divider` with a `Kbd` hint
  - `cx` for class merging everywhere
- Add more with `npx boardui@latest add <name> --path src/components/boardui --yes` (`npx boardui@latest list` shows all).

## Fonts
SF Pro comes from the Apple system font stack (`--font-sans` / `--font-display` in `src/index.css`); SF Mono is used for mono text.
Apple's licence limits SF Pro to Apple platforms, so it is not self-hosted. Macs and iPhones render real SF Pro, and other systems fall back to
Inter (self-hosted through `next/font/google`), the closest open-licence match. A machine with SF Pro installed locally will also use it.
