import { describe, expect, it } from 'vitest'

import { buildBlastRadius, buildReleaseContract } from './innovation'
import { buildMissionLock, evaluateProofGate } from './mission-lock'

describe('buildMissionLock', () => {
  it('locks non-negotiable provider and release constraints into the task', () => {
    const blastRadius = buildBlastRadius(
      'Ship a cross-platform release for web, desktop, CLI, and VS Code while preserving Ollama and LM Studio support.',
      'apps/web apps/talent-code-tool-desktop apps/talent-code-tool-cli apps/talent-code-tool-vscode'
    )
    const contract = buildReleaseContract(
      'Ship a cross-platform release for web, desktop, CLI, and VS Code while preserving Ollama and LM Studio support.',
      'apps/web apps/talent-code-tool-desktop apps/talent-code-tool-cli apps/talent-code-tool-vscode'
    )

    const lock = buildMissionLock(
      'Ship a cross-platform release for web, desktop, CLI, and VS Code while preserving Ollama and LM Studio support.',
      'apps/web apps/talent-code-tool-desktop apps/talent-code-tool-cli apps/talent-code-tool-vscode',
      contract,
      blastRadius
    )

    expect(lock.immutableConstraints.some((item) => item.includes('provider-agnostic'))).toBe(true)
    expect(lock.immutableConstraints.some((item) => item.includes('release-ready without explicit proof'))).toBe(true)
    expect(lock.proofRequirements.length).toBeGreaterThan(1)
  })
})

describe('evaluateProofGate', () => {
  it('flags polished but unsupported completion claims', () => {
    const blastRadius = buildBlastRadius('Ship the release.', 'apps/web docs')
    const contract = buildReleaseContract('Ship the release.', 'apps/web docs')
    const lock = buildMissionLock('Ship the release.', 'apps/web docs', contract, blastRadius)

    const proofGate = evaluateProofGate(lock, 'Everything is production-ready and fully complete.')

    expect(proofGate.status).toBe('drifted')
    expect(proofGate.unsupportedClaims.length).toBeGreaterThan(0)
    expect(proofGate.trustScore).toBeLessThan(60)
  })

  it('trusts output that includes proof-backed validation language', () => {
    const blastRadius = buildBlastRadius('Refresh the docs and validate the web route.', 'apps/web docs')
    const contract = buildReleaseContract('Refresh the docs and validate the web route.', 'apps/web docs')
    const lock = buildMissionLock('Refresh the docs and validate the web route.', 'apps/web docs', contract, blastRadius)

    const proofGate = evaluateProofGate(
      lock,
      'Completed the docs refresh. Validation: ran the web build, verified the route smoke checks, and documented the provider setup.'
    )

    expect(proofGate.status).toBe('trusted')
    expect(proofGate.supportedClaims.length).toBeGreaterThan(0)
    expect(proofGate.trustScore).toBeGreaterThanOrEqual(80)
  })
})
