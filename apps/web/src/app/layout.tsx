import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, Space_Grotesk } from 'next/font/google'

import { siteDescription, siteKeywords, siteUrl } from '@/lib/talent/site'

import './globals.css'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans' })
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400', '500'] })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'CodeOrbit AI',
    template: '%s | CodeOrbit AI',
  },
  description: siteDescription,
  applicationName: 'CodeOrbit AI',
  keywords: siteKeywords,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CodeOrbit AI',
    description: siteDescription,
    url: siteUrl,
    siteName: 'CodeOrbit AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeOrbit AI',
    description: siteDescription,
  },
  icons: {
    icon: '/icon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#020617',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${plexMono.variable} bg-slate-950 text-white`}>{children}</body>
    </html>
  )
}
