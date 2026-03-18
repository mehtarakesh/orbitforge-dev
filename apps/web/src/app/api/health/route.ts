import { NextResponse } from 'next/server'

import { buildHealthSnapshot } from '@/lib/talent/health'

export async function GET() {
  return NextResponse.json(buildHealthSnapshot(), {
    headers: {
      'cache-control': 'public, max-age=60, stale-while-revalidate=300',
    },
  })
}
