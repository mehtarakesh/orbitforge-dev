import Link from 'next/link'
import { ArrowRight, CheckCircle2, Download, Globe2, Lock, Radar, Server, Sparkles } from 'lucide-react'

import { SiteFooter } from '@/components/talent/site-footer'
import { SiteHeader } from '@/components/talent/site-header'
import { comparisonRows, featureColumns, innovationFeatureCards, pricingPlans, providerCatalog } from '@/lib/talent/catalog'
import { deploymentSteps, launchStats, siteUrl } from '@/lib/talent/site'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0f172a_50%,_#020617_100%)] text-white">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-7xl px-6 pb-16 pt-20">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
                Hosted at {siteUrl.replace('https://', '')}
              </p>
              <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-tight text-white md:text-7xl">
                The public website and coding workbench for teams that ship with more than one model.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                CodeOrbit AI combines the hosted website, workbench, docs, deployment guide, pricing, downloads, and
                release intelligence in one product surface. You can route through Ollama, LM Studio, Anthropic,
                OpenRouter, or OpenAI without rebuilding your workflow for each provider.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                >
                  Open workbench
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/deploy"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-white transition hover:border-white/40"
                >
                  Deploy the website
                  <Globe2 className="h-4 w-4" />
                </Link>
                <Link
                  href="/download"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-white transition hover:border-white/40"
                >
                  Download surfaces
                  <Download className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-cyan-400/20 bg-slate-950/80 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Launch console</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {launchStats.map((stat) => (
                    <div key={stat.label} className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{stat.label}</p>
                      <p className="mt-3 text-lg font-semibold">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 space-y-4">
                {providerCatalog.slice(0, 4).map((provider) => (
                  <div key={provider.id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold">{provider.name}</p>
                        <p className="mt-1 text-sm text-slate-300">{provider.tagline}</p>
                      </div>
                      <span className="rounded-full border border-cyan-400/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
                        {provider.localFirst ? 'Local-first' : 'Cloud'}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {provider.models.slice(0, 2).map((model) => (
                        <span key={model} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200">
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <Globe2 className="h-8 w-8 text-cyan-300" />
              <h3 className="mt-4 text-2xl font-semibold">Direct-hosted website</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Run the landing page, docs, deploy guide, pricing, downloads, workbench, evidence center, and health
                endpoint from a single public domain.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <Lock className="h-8 w-8 text-fuchsia-300" />
              <h3 className="mt-4 text-2xl font-semibold">Release-safe workflow</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Mission Lock, Proof Gate, Preflight, Blast Radius, and Hidden Pain detection reduce the distance
                between “looks good” and “safe to ship.”
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <Server className="h-8 w-8 text-emerald-300" />
              <h3 className="mt-4 text-2xl font-semibold">Multi-provider runtime</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Local and hosted models live behind one interface, so teams can mix private coding loops with cloud
                reasoning without switching tools.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex items-end justify-between gap-6">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-300">Deployment story</p>
              <h2 className="mt-4 text-4xl font-semibold">A public product launch should not require a second project.</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {deploymentSteps.map((step, index) => (
              <div key={step.id} className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Step {index + 1}</p>
                <h3 className="mt-3 text-2xl font-semibold">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Signature layer</p>
            <h2 className="mt-4 text-4xl font-semibold">Why teams choose CodeOrbit AI over isolated prompt consoles.</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {innovationFeatureCards.map((feature) => (
              <div key={feature.title} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <Sparkles className="h-8 w-8 text-cyan-300" />
                <h3 className="mt-4 text-2xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{feature.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {featureColumns.map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                <p className="text-lg font-semibold">{feature.title}</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">{feature.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Provider lanes</p>
              <h2 className="mt-4 text-4xl font-semibold">Keep vendor choice flexible from day one.</h2>
              <div className="mt-8 space-y-4">
                {providerCatalog.map((provider) => (
                  <div key={provider.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold">{provider.name}</p>
                        <p className="mt-1 text-sm text-slate-300">{provider.tagline}</p>
                      </div>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
                        {provider.apiStyle}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {provider.strengths.map((strength) => (
                        <span key={strength} className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-200">
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
              <div className="flex items-center gap-3">
                <Radar className="h-8 w-8 text-cyan-300" />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Compare the category</p>
                  <h2 className="mt-2 text-4xl font-semibold">Not another prompt box.</h2>
                </div>
              </div>
              <div className="mt-8 overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                  <thead>
                    <tr className="text-slate-400">
                      <th className="pb-4 pr-6 font-medium">Capability</th>
                      <th className="pb-4 pr-6 font-medium">Claude Code</th>
                      <th className="pb-4 pr-6 font-medium">OpenConsole-style</th>
                      <th className="pb-4 font-medium">CodeOrbit AI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-200">
                    {comparisonRows.map((row) => (
                      <tr key={row.feature}>
                        <td className="py-4 pr-6">{row.feature}</td>
                        <td className="py-4 pr-6">{row.claudeCode}</td>
                        <td className="py-4 pr-6">{row.openConsole}</td>
                        <td className="py-4 font-semibold text-cyan-200">{row.talent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Plan for rollout</p>
            <h2 className="mt-4 text-4xl font-semibold">A hosted site, a workbench, and a pricing story that line up.</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{plan.name}</p>
                <h3 className="mt-4 text-4xl font-semibold">{plan.price}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{plan.audience}</p>
                <div className="mt-6 space-y-3 text-sm text-slate-200">
                  {plan.features.map((feature) => (
                    <div key={feature} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="rounded-[2rem] border border-cyan-400/20 bg-[linear-gradient(135deg,_rgba(14,116,144,0.4),_rgba(15,23,42,0.9))] p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-cyan-200">Launch ready</p>
                <h2 className="mt-4 text-4xl font-semibold">Go from private build to public share without stitching five tools together.</h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200">
                  The website, workbench, docs, deploy guide, proof center, pricing, and download flow are already in
                  place. You only need to plug in the domain and provider lanes you want live.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  Start free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm text-white transition hover:border-white/40"
                >
                  Read docs
                  <CheckCircle2 className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
