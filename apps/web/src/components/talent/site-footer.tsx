import Link from 'next/link'

import { footerGroups } from '@/lib/talent/site'

function isExternal(href: string) {
  return href.startsWith('http') || href.startsWith('mailto:')
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-xl">
          <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">CodeOrbit AI</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
            One public product surface for docs, downloads, deployment, and the browser workbench.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            CodeOrbit AI keeps the marketing site, hosted app, status endpoint, and release-safe coding workflow in
            the same repo so public launches stay consistent.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">{group.title}</p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                {group.links.map((link) =>
                  isExternal(link.href) ? (
                    <a key={link.href} href={link.href} className="block transition hover:text-white">
                      {link.label}
                    </a>
                  ) : (
                    <Link key={link.href} href={link.href} className="block transition hover:text-white">
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>Built for teams that need local models, hosted models, and a release story in the same product.</p>
          <p>codeorbit-ai.dev</p>
        </div>
      </div>
    </footer>
  )
}
