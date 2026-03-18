import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/talent/site'

const routes = ['', '/app', '/features', '/docs', '/deploy', '/pricing', '/download', '/status', '/evidence', '/login', '/register']

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }))
}
