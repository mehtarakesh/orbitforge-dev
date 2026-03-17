import { NextResponse } from 'next/server'

import { runTalentPrompt, type TalentRequest } from '@/lib/talent/provider-client'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TalentRequest
    const output = await runTalentPrompt(body)

    return NextResponse.json({
      output,
      provider: body.provider,
      model: body.model,
      baseUrl: body.baseUrl,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Talent request failed.',
      },
      { status: 500 }
    )
  }
}
