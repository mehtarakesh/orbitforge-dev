import type { MetadataRoute } from 'next'

import { siteDescription, siteUrl } from '@/lib/talent/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CodeOrbit AI',
    short_name: 'CodeOrbit',
    description: siteDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
    scope: siteUrl,
  }
}
