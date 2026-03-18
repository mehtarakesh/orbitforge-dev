import Link from 'next/link'

import { SiteFooter } from '@/components/talent/site-footer'
import { SiteHeader } from '@/components/talent/site-header'
import { buildHealthSnapshot } from '@/lib/talent/health'

export default function StatusPage() {
  const snapshot = buildHealthSnapshot()

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#020617_0%,_#0f172a_60%,_#020617_100%)] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Status</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight">
              {snapshot.status === 'operational' ? 'Public deployment is operational.' : 'Public deployment needs attention.'}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              This page is safe for a hosted launch. It checks the website, health endpoint, canonical domain
              configuration, and whether at least one provider path is ready for the workbench.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Snapshot</p>
            <div className="mt-5 space-y-4 text-sm text-slate-200">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Checked at</p>
                <p className="mt-2 font-mono">{snapshot.checkedAt}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Deploy target</p>
                <p className="mt-2">{snapshot.deployTarget}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Health API</p>
                <Link href="/api/health" className="mt-2 inline-block text-cyan-200 hover:text-white">
                  /api/health
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          {snapshot.checks.map((check) => (
            <article key={check.id} className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold">{check.label}</h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${
                    check.status === 'operational'
                      ? 'bg-emerald-400/10 text-emerald-200'
                      : 'bg-amber-400/10 text-amber-200'
                  }`}
                >
                  {check.status}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300">{check.detail}</p>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-300">Environment readiness</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {Object.entries(snapshot.environment).map(([key, value]) => (
              <div key={key} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{key}</p>
                <p className={`mt-3 text-lg font-semibold ${value ? 'text-emerald-200' : 'text-amber-200'}`}>{value ? 'Ready' : 'Needs setup'}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
