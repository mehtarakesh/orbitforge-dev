import Link from 'next/link'

import { SiteFooter } from '@/components/talent/site-footer'
import { SiteHeader } from '@/components/talent/site-header'
import { downloadArtifacts } from '@/lib/talent/catalog'

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#020617_0%,_#111827_100%)] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Download Center</p>
          <h1 className="mt-4 text-5xl font-semibold">Install the surface that fits your workflow.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Start in the browser, build the VS Code extension into a VSIX, or use the docs surface to roll Talent Code
            Tool out across a team.
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
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 text-sm leading-7 text-slate-200">
              <strong>macOS</strong>
              <br />
              Browser app, VS Code extension, desktop app, and CLI are supported.
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 text-sm leading-7 text-slate-200">
              <strong>Windows</strong>
              <br />
              Browser app, VS Code extension, desktop app, and CLI are supported.
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 text-sm leading-7 text-slate-200">
              <strong>Linux</strong>
              <br />
              Browser app, desktop app, and CLI are supported; the CLI is intended for local and CI usage.
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
