import { siteUrl } from '@/lib/talent/site'

export type HealthState = 'operational' | 'attention'

export type HealthCheck = {
  id: string
  label: string
  status: HealthState
  detail: string
}

export type HealthSnapshot = {
  status: HealthState
  checkedAt: string
  siteUrl: string
  deployTarget: string
  checks: HealthCheck[]
  environment: {
    siteUrlConfigured: boolean
    openaiEnabled: boolean
    anthropicEnabled: boolean
    openrouterEnabled: boolean
    localFallbacksAvailable: boolean
  }
}

export function buildHealthSnapshot(
  now = new Date(),
  env: Record<string, string | undefined> = process.env
): HealthSnapshot {
  const normalizedUrl = (env.NEXT_PUBLIC_SITE_URL || siteUrl).replace(/\/+$/, '')
  const openaiEnabled = Boolean(env.OPENAI_API_KEY)
  const anthropicEnabled = Boolean(env.ANTHROPIC_API_KEY)
  const openrouterEnabled = Boolean(env.OPENROUTER_API_KEY)
  const localFallbacksAvailable = Boolean(env.OLLAMA_BASE_URL || env.LMSTUDIO_BASE_URL)

  const checks: HealthCheck[] = [
    {
      id: 'website',
      label: 'Hosted website',
      status: 'operational',
      detail: 'Marketing pages, docs, pricing, downloads, and the browser workbench live in the same Next.js deployment.',
    },
    {
      id: 'health-endpoint',
      label: 'Operational health endpoint',
      status: 'operational',
      detail: 'The public deployment exposes `/api/health` for uptime checks and smoke validation.',
    },
    {
      id: 'domain',
      label: 'Canonical domain metadata',
      status: normalizedUrl.startsWith('https://') ? 'operational' : 'attention',
      detail: normalizedUrl.startsWith('https://')
        ? `Metadata, sitemap, and manifest are configured against ${normalizedUrl}.`
        : 'Set `NEXT_PUBLIC_SITE_URL` to the public HTTPS domain before launch.',
    },
    {
      id: 'providers',
      label: 'Model-provider readiness',
      status: openaiEnabled || anthropicEnabled || openrouterEnabled || localFallbacksAvailable ? 'operational' : 'attention',
      detail:
        openaiEnabled || anthropicEnabled || openrouterEnabled || localFallbacksAvailable
          ? 'At least one cloud or local provider path is configured for the workbench.'
          : 'No provider credentials or local base URLs are configured yet. The site can launch, but hosted inference is not ready.',
    },
  ]

  const status = checks.some((check) => check.status === 'attention') ? 'attention' : 'operational'

  return {
    status,
    checkedAt: now.toISOString(),
    siteUrl: normalizedUrl,
    deployTarget: 'Vercel Hobby',
    checks,
    environment: {
      siteUrlConfigured: Boolean(env.NEXT_PUBLIC_SITE_URL || siteUrl),
      openaiEnabled,
      anthropicEnabled,
      openrouterEnabled,
      localFallbacksAvailable,
    },
  }
}
