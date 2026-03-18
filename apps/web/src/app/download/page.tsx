import Link from 'next/link'

import { SiteFooter } from '@/components/talent/site-footer'
import { SiteHeader } from '@/components/talent/site-header'
import { downloadArtifacts } from '@/lib/talent/catalog'
import { platformMatrix } from '@/lib/talent/site'

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#020617_0%,_#111827_100%)] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Download Center</p>
          <h1 className="mt-4 text-5xl font-semibold">Install the surface that fits your workflow.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Start in the browser, ship the hosted website on Vercel, and package the desktop app, CLI, or VS Code
            extension from the same repo.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {downloadArtifacts.map((artifact) => (
            <section key={artifact.name} className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7">
              <h2 className="text-2xl font-semibold">{artifact.name}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">{artifact.detail}</p>
              <Link
                href={artifact.href}
                className="mt-8 inline-flex rounded-full border border-cyan-400/40 px-5 py-3 text-sm text-cyan-100 transition hover:border-cyan-300 hover:text-white"
              >
                Open
              </Link>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/5 p-7">
          <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-300">Platform Summary</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {platformMatrix.map((row) => (
              <div key={row.platform} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 text-sm leading-7 text-slate-200">
                <strong>{row.platform}</strong>
                <p className="mt-3 text-slate-300">{row.bestFor}</p>
                <div className="mt-4 space-y-2 text-xs text-slate-400">
                  <p>Surfaces: {row.surfaces.join(', ')}</p>
                  <p>Packaging: {row.packaging}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-[2rem] border border-white/10 bg-slate-950/80 p-7">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Build from source</p>
          <pre className="mt-5 overflow-x-auto rounded-3xl border border-white/10 bg-white/5 p-5 font-mono text-sm text-slate-200">
{`npm install
npm run build:web
npm run build:cli
npm run build:desktop
npm run build:extension`}
          </pre>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/docs"
              className="inline-flex rounded-full border border-cyan-400/40 px-5 py-3 text-sm text-cyan-100 transition hover:border-cyan-300 hover:text-white"
            >
              Read installation docs
            </Link>
            <Link
              href="/deploy"
              className="inline-flex rounded-full border border-white/15 px-5 py-3 text-sm text-white transition hover:border-white/30"
            >
              Deploy the website
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
