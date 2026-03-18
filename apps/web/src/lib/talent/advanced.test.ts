import { describe, expect, it } from 'vitest'

import { buildBlastRadius, buildReleaseContract } from './innovation'
import { buildHiddenPainAnalysis, buildRecoveryLanes, decodeSessionCapsule, encodeSessionCapsule } from './advanced'

describe('buildHiddenPainAnalysis', () => {
  it('surfaces hidden contradictions and missing inputs for risky release prompts', () => {
    const blastRadius = buildBlastRadius('Quickly ship a release across web, api, docs, and pricing.', 'apps/web apps/api')
    const contract = buildReleaseContract('Quickly ship a release across web, api, docs, and pricing.', 'apps/web apps/api')
    const analysis = buildHiddenPainAnalysis({
      provider: 'openai',
      model: 'gpt-4.1',
      baseUrl: 'https://api.openai.com/v1',
      prompt: 'Quickly ship a release across web, api, docs, and pricing.',
      workspaceContext: 'apps/web apps/api',
      checks: [
        { id: 'auth', status: 'blocked', detail: 'Missing key' },
        { id: 'workspace', status: 'warning', detail: 'Limited scope' },
      ],
      releaseContract: contract,
      blastRadius,
    })

    expect(analysis.operatorBurdenScore).toBeGreaterThan(40)
    expect(analysis.faultlines.some((entry) => entry.title === 'Scope compression')).toBe(true)
    expect(analysis.missingInputs.length).toBeGreaterThan(0)
  })
})

describe('buildRecoveryLanes', () => {
  it('creates fallback lanes when auth or portability risk is present', () => {
    const blastRadius = buildBlastRadius('Update provider routes and ship release docs.', 'apps/web apps/api docs')
    const lanes = buildRecoveryLanes({
      provider: 'openai',
      model: 'gpt-4.1',
      baseUrl: 'https://api.openai.com/v1',
      prompt: 'Update provider routes and ship release docs.',
      workspaceContext: 'apps/web apps/api docs',
      authBlocked: true,
      blastRadius,
    })

    expect(lanes.length).toBeGreaterThan(2)
    expect(lanes.some((lane) => lane.provider === 'ollama')).toBe(true)
    expect(lanes.some((lane) => lane.trigger === 'compatibility-check')).toBe(true)
  })
})

describe('session capsule', () => {
  it('round-trips a portable session capsule', () => {
    const encoded = encodeSessionCapsule({
      version: 'codeorbit-ai.v1',
      provider: 'ollama',
      model: 'qwen2.5-coder:7b',
      baseUrl: 'http://localhost:11434',
      prompt: 'Prepare a reviewer-ready patch.',
      workspaceContext: 'apps/web and docs',
      readinessScore: 88,
      gate: 'go',
      summary: 'Ready to run',
      output: 'Plan and validations',
      createdAt: '2026-03-17T00:00:00.000Z',
    })

    const decoded = decodeSessionCapsule(encoded)

    expect(decoded.provider).toBe('ollama')
    expect(decoded.prompt).toContain('reviewer-ready')
    expect(decoded.gate).toBe('go')
  })
})
