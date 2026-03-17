import { NextResponse } from 'next/server'

import { providerCatalog } from '@/lib/talent/catalog'

export async function GET() {
  return NextResponse.json({
    providers: providerCatalog,
    defaultProvider: process.env.TALENT_DEFAULT_PROVIDER || 'ollama',
  })
}
