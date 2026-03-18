import Link from 'next/link'

import { siteNavLinks } from '@/lib/talent/site'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-300/10 text-sm font-semibold tracking-[0.3em] text-cyan-200">
            AI
          </span>
          <span>
            <span className="block text-lg font-semibold tracking-tight">CodeOrbit AI</span>
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-400">Ship work, not just prompts</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-slate-300 lg:flex">
          {siteNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30 hover:text-white sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Start free
          </Link>
        </div>
      </div>
      <div className="hidden border-t border-white/5 lg:block">
        <div className="mx-auto max-w-7xl px-6 py-3 text-xs uppercase tracking-[0.26em] text-slate-400">
          Ollama, LM Studio, Anthropic, OpenAI, OpenRouter, and OpenAI-compatible endpoints in one hosted surface.
        </div>
      </div>
    </header>
  )
}
