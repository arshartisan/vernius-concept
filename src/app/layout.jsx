import { Manrope, JetBrains_Mono } from 'next/font/google'
import '../index.css'

// Manrope for all UI and display type; JetBrains Mono backs the SF Mono stack for mono labels.
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono-web', display: 'swap' })

export const metadata = {
  title: 'Vernius | Low-cost radars for interceptors',
  description:
    'Active radar seekers and ground radars for counter-UAS. All-weather Shahed detection that works with existing interceptors and platforms. Backed by Y Combinator.',
  metadataBase: new URL('https://www.vernius.systems'),
  openGraph: {
    title: 'Vernius | Low-cost radars for interceptors',
    description: 'Active radar seekers and ground radars for counter-UAS.',
    images: ['/images/hero-bg.webp'],
  },
}

export const viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${manrope.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/frames/f001.webp" />
      </head>
      <body>{children}</body>
    </html>
  )
}
