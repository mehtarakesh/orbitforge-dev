import type { BlastRadius, ReleaseContract } from '@/lib/talent/innovation'

export type MissionLock = {
  northStar: string
  immutableConstraints: string[]
  nonGoals: string[]
  proofRequirements: string[]
  driftRisks: string[]
}

export type ProofGateAssessment = {
  trustScore: number
  status: 'trusted' | 'needs-evidence' | 'drifted'
  supportedClaims: string[]
  unsupportedClaims: string[]
  missingEvidence: string[]
  nextAction: string
}

function unique(items: string[]) {
  return Array.from(new Set(items.filter(Boolean)))
}

function buildConstraintList(prompt: string, workspaceContext: string, blastRadius: BlastRadius) {
  const haystack = `${prompt} ${workspaceContext}`.toLowerCase()

  return unique([
    /(ollama|lm studio|lmstudio|openai|anthropic|openrouter|provider|model-agnostic|compatible)/.test(haystack)
      ? 'Preserve provider-agnostic behavior and avoid introducing vendor lock-in.'
      : '',
    /(local|offline|private)/.test(haystack) ? 'Keep local-first execution viable for teams that cannot use hosted models.' : '',
    /(web|desktop|cli|vscode|extension|windows|linux|mac|macos)/.test(haystack)
      ? `Maintain parity across the named surfaces: ${blastRadius.impactedAreas.join(', ') || 'the active workspace'}.`
      : '',
    /(docs|readme|pricing|download|launch|public)/.test(haystack)
      ? 'Keep public-facing docs and rollout messaging aligned with product behavior.'
      : '',
    /(release|ship|production|launch)/.test(haystack)
      ? 'Do not treat output as release-ready without explicit proof.'
      : '',
  ])
}

export function buildMissionLock(
  prompt: string,
  workspaceContext: string,
  releaseContract: ReleaseContract,
  blastRadius: BlastRadius
): MissionLock {
  const haystack = `${prompt} ${workspaceContext}`.toLowerCase()
  const immutableConstraints = buildConstraintList(prompt, workspaceContext, blastRadius)

  const nonGoals = unique([
    !/(api|backend|route|provider)/.test(haystack) ? 'Do not expand a surface-scoped task into an unnecessary backend rewrite.' : '',
    !/(desktop|electron|windows|linux|mac)/.test(haystack) ? 'Do not pull packaging work into the scope unless the task explicitly needs it.' : '',
    !/(docs|readme|pricing|download|launch)/.test(haystack) ? 'Do not let public-facing docs drift if the task never asked for messaging changes.' : '',
    blastRadius.impactedAreas.length <= 2 ? 'Avoid broadening the task beyond the current blast radius.' : '',
  ])

  const proofRequirements = unique([
    ...releaseContract.validations,
    'Reference the exact proof used to justify any completion or release-ready claim.',
    blastRadius.impactedAreas.length >= 3 ? 'Show cross-surface evidence, not only a single-surface success signal.' : '',
  ])

  const driftRisks = unique([
    /(quick|quickly|fast|simple|minor)/.test(haystack) && blastRadius.impactedAreas.length >= 3
      ? 'The prompt sounds small, but the blast radius suggests hidden follow-on work.'
      : '',
    /(release|launch|ship|production)/.test(haystack) && !/(test|validate|build|smoke|verify)/.test(haystack)
      ? 'The task asks to ship without naming proof expectations.'
      : '',
    !workspaceContext.trim() ? 'No workspace context is present, so the human is carrying unstated assumptions outside the tool.' : '',
  ])

  return {
    northStar: prompt.trim() || 'Ship the requested change without breaking hidden constraints.',
    immutableConstraints,
    nonGoals,
    proofRequirements,
    driftRisks,
  }
}

function evidenceHint(requirement: string) {
  const lowerRequirement = requirement.toLowerCase()

  if (lowerRequirement.includes('build')) {
    return /(build|compiled|next build|tsc)/i
  }

  if (lowerRequirement.includes('test') || lowerRequirement.includes('validation')) {
    return /(test|validated|validation|smoke|verify|verified)/i
  }

  if (lowerRequirement.includes('provider')) {
    return /(provider|ollama|lm studio|lmstudio|openai|anthropic|openrouter|compatible)/i
  }

  if (lowerRequirement.includes('extension')) {
    return /(vscode|vsix|extension)/i
  }

  if (lowerRequirement.includes('desktop')) {
    return /(desktop|electron|dmg|nsis|appimage)/i
  }

  return new RegExp(requirement.split(' ').slice(0, 2).join('|'), 'i')
}

export function evaluateProofGate(lock: MissionLock, output?: string): ProofGateAssessment {
  if (!output?.trim()) {
    return {
      trustScore: 26,
      status: 'needs-evidence',
      supportedClaims: [],
      unsupportedClaims: [],
      missingEvidence: lock.proofRequirements,
      nextAction: 'Run a model lane and require explicit proof before accepting completion.',
    }
  }

  const text = output.trim()
  const lowerText = text.toLowerCase()
  const supportedClaims = lock.proofRequirements.filter((requirement) => evidenceHint(requirement).test(text))
  const missingEvidence = lock.proofRequirements.filter((requirement) => !supportedClaims.includes(requirement))
  const unsupportedClaims = unique([
    /(production-ready|ready to ship|ready for release|fully complete|done|completed|implemented|fixed)/i.test(text) &&
    !/(test|build|validated|smoke|verify|evidence|proof)/i.test(text)
      ? 'The output makes a completion claim without naming concrete proof.'
      : '',
    lowerText.includes('no risk') ? 'The output claims zero risk, which is almost never justified for release work.' : '',
    lowerText.includes('everything') && missingEvidence.length >= 2 ? 'The output sounds comprehensive, but the proof requirements are still mostly missing.' : '',
  ])

  const trustScore = Math.max(0, Math.min(100, 94 - missingEvidence.length * 12 - unsupportedClaims.length * 20))
  const status = unsupportedClaims.length ? 'drifted' : trustScore >= 80 ? 'trusted' : trustScore >= 55 ? 'needs-evidence' : 'drifted'

  return {
    trustScore,
    status,
    supportedClaims,
    unsupportedClaims,
    missingEvidence,
    nextAction:
      status === 'trusted'
        ? 'The output is evidence-backed enough to move into human review.'
        : status === 'needs-evidence'
          ? 'Ask for explicit proof against the missing requirements before accepting the result.'
          : 'Re-lock the mission, reduce drift, and require proof-backed output instead of trusting the current answer.',
  }
}
