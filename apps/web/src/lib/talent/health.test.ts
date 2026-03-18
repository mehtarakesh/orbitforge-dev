import { describe, expect, it } from 'vitest'

import { buildHealthSnapshot } from '@/lib/talent/health'

describe('buildHealthSnapshot', () => {
  it('reports attention when no provider path is configured', () => {
    const snapshot = buildHealthSnapshot(new Date('2026-03-17T00:00:00Z'), {
      NEXT_PUBLIC_SITE_URL: 'https://codeorbit-ai.dev',
    })

    expect(snapshot.status).toBe('attention')
    expect(snapshot.environment.siteUrlConfigured).toBe(true)
    expect(snapshot.environment.openaiEnabled).toBe(false)
  })

  it('reports operational provider readiness when a provider is configured', () => {
    const snapshot = buildHealthSnapshot(new Date('2026-03-17T00:00:00Z'), {
      NEXT_PUBLIC_SITE_URL: 'https://codeorbit-ai.dev',
      OPENAI_API_KEY: 'sk-test',
    })

    const providerCheck = snapshot.checks.find((check) => check.id === 'providers')
    expect(providerCheck?.status).toBe('operational')
  })
})
