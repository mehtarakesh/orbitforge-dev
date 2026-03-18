import { NextResponse } from 'next/server'

import { runTalentPrompt, type TalentRequest } from '@/lib/talent/provider-client'
import { buildPreflightAssessment } from '@/lib/talent/preflight'
import { shouldAutoHealError } from '@/lib/talent/advanced'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TalentRequest
    const assessment = buildPreflightAssessment(body)
    const attempts: Array<{ provider: string; model: string; baseUrl: string; ok: boolean; note: string }> = []
    const lanes = assessment.recoveryPlan
    let lastError = ''

    for (let index = 0; index < lanes.length; index += 1) {
      const lane = lanes[index]

      try {
        const output = await runTalentPrompt({
          ...body,
          provider: lane.provider,
          model: lane.model,
          baseUrl: lane.baseUrl,
        })

        attempts.push({
          provider: lane.provider,
          model: lane.model,
          baseUrl: lane.baseUrl,
          ok: true,
          note: lane.reason,
        })

        return NextResponse.json({
          output,
          provider: lane.provider,
          model: lane.model,
          baseUrl: lane.baseUrl,
          recovered: index > 0,
          attempts,
        })
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Talent request failed.'
        attempts.push({
          provider: lane.provider,
          model: lane.model,
          baseUrl: lane.baseUrl,
          ok: false,
          note: `${lane.reason} Failed with: ${lastError}`,
        })

        if (index === 0 && !shouldAutoHealError(lastError)) {
          break
        }
      }
    }

    return NextResponse.json(
      {
        error: lastError || 'Talent request failed.',
        attempts,
        recoverySummary: assessment.hiddenPainAnalysis.seamlessActions[0] || 'Clear the preflight blockers or switch to a safer local lane.',
      },
      { status: 500 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Talent request failed.',
      },
      { status: 500 }
    )
  }
}
