import type { BlastRadius, ReleaseContract } from '@/lib/talent/innovation'
import { normalizeBaseUrl, type ProviderId } from '@/lib/talent/provider-client'

export type HiddenPainSignal = {
  severity: 'warning' | 'critical'
  title: string
  detail: string
}

export type HiddenPainAnalysis = {
  operatorBurdenScore: number
  invisibleCosts: string[]
  missingInputs: string[]
  faultlines: HiddenPainSignal[]
  seamlessActions: string[]
}

export type RecoveryLane = {
  provider: ProviderId
  model: string
  baseUrl: string
  trigger: string
  reason: string
}

export type SessionCapsule = {
  version: 'codeorbit-ai.v1'
  provider: ProviderId
  model: string
  baseUrl: string
  prompt: string
  workspaceContext: string
  readinessScore?: number
  gate?: string
  summary?: string
  output?: string
  createdAt: string
}

type HiddenPainInput = {
  provider: ProviderId
  model: string
  baseUrl?: string
  prompt: string
  workspaceContext?: string
  checks: Array<{ id: string; status: 'ready' | 'warning' | 'blocked'; detail: string }>
  releaseContract: ReleaseContract
  blastRadius: BlastRadius
}

function unique(items: string[]) {
  return Array.from(new Set(items.filter(Boolean)))
}

function base64Encode(value: string) {
  if (typeof window === 'undefined') {
    return Buffer.from(value, 'utf8').toString('base64')
  }

  return window.btoa(unescape(encodeURIComponent(value)))
}

function base64Decode(value: string) {
  if (typeof window === 'undefined') {
    return Buffer.from(value, 'base64').toString('utf8')
  }

  return decodeURIComponent(escape(window.atob(value)))
}

export function buildHiddenPainAnalysis(input: HiddenPainInput): HiddenPainAnalysis {
  const prompt = input.prompt.toLowerCase()
  const workspace = (input.workspaceContext || '').toLowerCase()
  const blockedChecks = input.checks.filter((check) => check.status === 'blocked')
  const warningChecks = input.checks.filter((check) => check.status === 'warning')
  const mentionsRelease = /(release|launch|ship|publish|production|pricing|enterprise)/.test(prompt)
  const mentionsQuick = /(quick|quickly|fast|small|minor|simple)/.test(prompt)
  const expectedSurfaces = unique([
    /(web|page|ui|landing|site)/.test(prompt) ? 'web' : '',
    /(api|route|backend|provider)/.test(prompt) ? 'api' : '',
    /\bcli\b/.test(prompt) ? 'cli' : '',
    /(desktop|electron)/.test(prompt) ? 'desktop' : '',
    /(vscode|extension)/.test(prompt) ? 'vscode' : '',
    /(docs|readme|changelog|pricing|download)/.test(prompt) ? 'docs' : '',
  ])

  const faultlines: HiddenPainSignal[] = unique([
    mentionsQuick && input.blastRadius.impactedAreas.length >= 3
      ? 'critical|Scope compression|The prompt asks for a quick change, but the blast radius spans multiple surfaces and will likely hide follow-on work.'
      : '',
    mentionsRelease && !/(test|validate|build|smoke|verify)/.test(prompt)
      ? 'critical|Release without proof|The prompt asks to ship or launch, but it never asks for evidence, checks, or rollback proof.'
      : '',
    expectedSurfaces.includes('docs') && !/(docs|readme|pricing|download)/.test(workspace)
      ? 'warning|Public-surface drift|The prompt mentions docs or public rollout work, but the workspace context does not explicitly include those files.'
      : '',
    expectedSurfaces.includes('api') && !/(api|route|provider)/.test(workspace)
      ? 'warning|Backend blind spot|The prompt mentions API or provider changes, but the workspace context does not show backend ownership.'
      : '',
    blockedChecks.some((check) => check.id === 'auth')
      ? 'critical|Silent auth failure risk|A hosted provider is selected without usable credentials, which will create a failure that looks like a model problem.'
      : '',
  ]).map((entry) => {
    const [severity, title, detail] = entry.split('|')
    return {
      severity: severity as HiddenPainSignal['severity'],
      title,
      detail,
    }
  })

  const missingInputs = unique([
    !expectedSurfaces.length ? 'Name the exact surface that should change so the tool can stop carrying that ambiguity for you.' : '',
    !/(test|validate|build|smoke|verify)/.test(prompt) ? 'Add the validation signal you expect so the output is not judged by vibe alone.' : '',
    mentionsRelease && !/(rollback|fallback|safe|revert)/.test(prompt)
      ? 'Add rollback intent for release-facing work so the system can optimize for reversibility, not only output quality.'
      : '',
    warningChecks.some((check) => check.id === 'workspace')
      ? 'Add more workspace context; humans usually underestimate how much unstated repo context they are carrying mentally.'
      : '',
  ])

  const invisibleCosts = unique([
    mentionsRelease ? 'Public release work always includes hidden documentation and messaging overhead.' : '',
    input.blastRadius.impactedAreas.length >= 3 ? 'Cross-surface work creates coordination cost even when the patch itself looks small.' : '',
    expectedSurfaces.includes('api') ? 'Provider changes often fail on payload shape differences rather than on code syntax.' : '',
  ])

  const seamlessActions = unique([
    blockedChecks.length ? 'Run preflight first and clear blocked checks before spending tokens on generation.' : '',
    faultlines.some((faultline) => faultline.severity === 'critical')
      ? 'Use the auto-heal recovery lane or shrink the scope before the primary run.'
      : '',
    expectedSurfaces.length >= 2 ? 'Export a session capsule before switching surfaces so the next tool does not lose your exact intent.' : '',
    mentionsRelease ? 'Run the model jury before trusting a single release plan.' : '',
  ])

  const operatorBurdenScore = Math.min(
    100,
    18 + faultlines.length * 16 + missingInputs.length * 12 + warningChecks.length * 8 + blockedChecks.length * 14
  )

  return {
    operatorBurdenScore,
    invisibleCosts,
    missingInputs,
    faultlines,
    seamlessActions,
  }
}

export function buildRecoveryLanes(input: {
  provider: ProviderId
  model: string
  baseUrl?: string
  prompt: string
  workspaceContext?: string
  authBlocked?: boolean
  blastRadius: BlastRadius
}): RecoveryLane[] {
  const lanes = [
    {
      provider: input.provider,
      model: input.model,
      baseUrl: normalizeBaseUrl(input.provider, input.baseUrl),
      trigger: 'primary',
      reason: 'Primary execution lane.',
    },
  ]

  if (input.provider === 'ollama' && input.model !== 'qwen2.5-coder:7b') {
    lanes.push({
      provider: 'ollama',
      model: 'qwen2.5-coder:7b',
      baseUrl: normalizeBaseUrl('ollama'),
      trigger: 'missing-model',
      reason: 'Fallback to a smaller local coding model when the preferred Ollama model is unavailable.',
    })
  }

  if (input.provider !== 'lmstudio') {
    lanes.push({
      provider: 'lmstudio',
      model: 'local-model',
      baseUrl: normalizeBaseUrl('lmstudio'),
      trigger: 'compatibility-check',
      reason: 'Cross-check against an OpenAI-compatible local lane when portability matters.',
    })
  }

  if (input.authBlocked || input.provider === 'openai' || input.provider === 'anthropic' || input.provider === 'openrouter') {
    lanes.push({
      provider: 'ollama',
      model: 'qwen2.5-coder:7b',
      baseUrl: normalizeBaseUrl('ollama'),
      trigger: 'auth-or-network',
      reason: 'Local escape hatch when hosted auth or network conditions fail.',
    })
  }

  if (input.blastRadius.riskLevel === 'high' || input.blastRadius.riskLevel === 'critical') {
    lanes.push({
      provider: 'openai-compatible',
      model: 'local-model',
      baseUrl: normalizeBaseUrl('openai-compatible'),
      trigger: 'second-opinion',
      reason: 'Keep a second lane ready when the hidden coordination cost is high.',
    })
  }

  return lanes.filter(
    (lane, index, all) =>
      all.findIndex((entry) => `${entry.provider}:${entry.model}:${entry.baseUrl}` === `${lane.provider}:${lane.model}:${lane.baseUrl}`) === index
  )
}

export function shouldAutoHealError(error: string) {
  const lowerError = error.toLowerCase()
  return ['not found', 'timeout', 'network', '401', '403', 'api key', 'connection', 'refused'].some((token) =>
    lowerError.includes(token)
  )
}

export function encodeSessionCapsule(capsule: SessionCapsule) {
  return base64Encode(JSON.stringify(capsule))
}

export function decodeSessionCapsule(value: string): SessionCapsule {
  const parsed = JSON.parse(base64Decode(value.trim())) as SessionCapsule

  if (parsed.version !== 'codeorbit-ai.v1') {
    throw new Error('Unsupported session capsule version.')
  }

  return parsed
}
