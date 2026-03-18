import { SiteFooter } from '@/components/talent/site-footer'
import { SiteHeader } from '@/components/talent/site-header'
import { releaseChecklist } from '@/lib/talent/catalog'
import { innovationFeatures } from '@/lib/talent/innovation'
import { verificationItems } from '@/lib/talent/site'

export default function EvidencePage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#020617_0%,_#111827_100%)] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <section className="max-w-4xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Evidence</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight">Public proof center for the website, workbench, and release layer.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            CodeOrbit AI is designed around proof, not only polished output. This page summarizes the evidence model we
            expect before calling the product ready to share publicly.
          </p>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          {verificationItems.map((item) => (
            <article key={item.name} className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7">
              <h2 className="text-2xl font-semibold">{item.name}</h2>
              <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-400">Proof</p>
              <p className="mt-2 text-sm leading-7 text-slate-200">{item.proof}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-400">Why it matters</p>
              <p className="mt-2 text-sm leading-7 text-slate-200">{item.whyItMatters}</p>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-300">Launch checklist</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {releaseChecklist.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Commands we expect to pass</p>
          <pre className="mt-5 overflow-x-auto rounded-3xl border border-white/10 bg-white/5 p-5 font-mono text-sm text-slate-200">
{`npm run test:web
npm run build:web

# optional packaging
npm run build:cli
npm run build:desktop
npm run build:extension`}
          </pre>
        </section>

        <section className="mt-12 rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Proof-oriented feature layer</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {innovationFeatures.slice(0, 8).map((feature) => (
              <div key={feature.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-xl font-semibold">{feature.name}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">{feature.outcome}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
