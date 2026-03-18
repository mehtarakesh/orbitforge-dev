import Link from 'next/link'

import { SiteFooter } from '@/components/talent/site-footer'
import { SiteHeader } from '@/components/talent/site-header'
import { docsSections, releaseChecklist } from '@/lib/talent/catalog'
import { innovationFeatures } from '@/lib/talent/innovation'
import { deploymentEnvironmentFields, deploymentSteps } from '@/lib/talent/site'

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#020617_0%,_#111827_100%)] text-white">
      <SiteHeader />
      <main className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Docs</p>
          <div className="mt-4 space-y-3">
            {docsSections.map((section) => (
              <Link key={section.id} href={`#${section.id}`} className="block rounded-2xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
                {section.title}
              </Link>
            ))}
            <Link href="#deploy" className="block rounded-2xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
              Deployment
            </Link>
            <Link href="#env" className="block rounded-2xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
              Environment
            </Link>
            <Link href="#checklist" className="block rounded-2xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
              Launch checklist
            </Link>
          </div>
        </aside>
        <section className="space-y-8">
          <article className="rounded-[2rem] border border-cyan-400/20 bg-slate-950/80 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Public launch</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight">Everything needed to host CodeOrbit AI at one domain.</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200">
              This docs surface covers product setup, provider strategy, web deployment, download packaging, and the
              release proof model that keeps the public site aligned with the actual shipped product.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Best free host</p>
                <p className="mt-3 text-xl font-semibold">Vercel Hobby</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Project root</p>
                <p className="mt-3 text-xl font-semibold">apps/web</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Smoke endpoint</p>
                <p className="mt-3 text-xl font-semibold">/api/health</p>
              </div>
            </div>
          </article>

          {docsSections.map((section) => (
            <article key={section.id} id={section.id} className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-300">{section.title}</p>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200">{section.body}</p>
            </article>
          ))}

          <article id="deploy" className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Deployment</p>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {deploymentSteps.map((step, index) => (
                <div key={step.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Step {index + 1}</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">{step.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-200">{step.body}</p>
                  <div className="mt-4 space-y-2">
                    {step.bullets.map((bullet) => (
                      <div key={bullet} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-200">
                        {bullet}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Feature Docs</p>
            <div className="mt-5 space-y-5">
              {innovationFeatures.map((feature) => (
                <div key={feature.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <h2 className="text-2xl font-semibold text-white">{feature.name}</h2>
                  <p className="mt-3 text-sm uppercase tracking-[0.25em] text-slate-400">Pain point</p>
                  <p className="mt-2 text-sm leading-7 text-slate-200">{feature.painPoint}</p>
                  <p className="mt-4 text-sm uppercase tracking-[0.25em] text-slate-400">What it changes</p>
                  <p className="mt-2 text-sm leading-7 text-slate-200">{feature.outcome}</p>
                  <p className="mt-4 text-sm uppercase tracking-[0.25em] text-slate-400">How CodeOrbit AI implements it</p>
                  <p className="mt-2 text-sm leading-7 text-slate-200">{feature.implementation}</p>
                </div>
              ))}
            </div>
          </article>

          <article id="env" className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Environment</p>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                <thead>
                  <tr className="text-slate-400">
                    <th className="pb-4 pr-6 font-medium">Key</th>
                    <th className="pb-4 pr-6 font-medium">Required</th>
                    <th className="pb-4 pr-6 font-medium">Description</th>
                    <th className="pb-4 font-medium">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-slate-200">
                  {deploymentEnvironmentFields.map((field) => (
                    <tr key={field.key}>
                      <td className="py-4 pr-6 font-mono">{field.key}</td>
                      <td className="py-4 pr-6">{field.required ? 'Required' : 'Optional'}</td>
                      <td className="py-4 pr-6">{field.description}</td>
                      <td className="py-4 font-mono text-slate-300">{field.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Quick Start</p>
            <p className="mt-4 text-sm leading-7 text-slate-200">
              Install dependencies from the repo root, then build the web app, CLI, desktop shell, and extension from
              one workspace setup.
            </p>
            <pre className="mt-5 overflow-x-auto rounded-3xl border border-white/10 bg-white/5 p-5 font-mono text-sm text-slate-200">
{`npm install
npm run build:web
npm run build:cli
npm run build:desktop
npm run build:extension`}
            </pre>
          </article>

          <article id="checklist" className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-300">Launch checklist</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {releaseChecklist.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
