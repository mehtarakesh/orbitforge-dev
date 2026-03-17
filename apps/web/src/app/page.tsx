import Link from 'next/link'
import {
  ArrowRight,
  Blocks,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  Download,
  Layers3,
  ShieldCheck,
} from 'lucide-react'

import { SiteFooter } from '@/components/talent/site-footer'
import { SiteHeader } from '@/components/talent/site-header'
import { comparisonRows, featureColumns, innovationFeatureCards, pricingPlans, providerCatalog } from '@/lib/talent/catalog'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0f172a_50%,_#020617_100%)] text-white">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-7xl px-6 pb-16 pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Model-agnostic coding operator</p>
              <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-tight text-white md:text-7xl">
                CodeOrbit AI brings Claude Code-style momentum to any model stack.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Run local Ollama sessions, connect LM Studio, switch to Anthropic or OpenAI, and move from plan to patch
                to launch notes without changing products.
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
                  href="/download"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-white transition hover:border-white/40"
                >
                  Download surfaces
                  <Download className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur">
              <div className="grid gap-4">
                {providerCatalog.map((provider) => (
                  <div key={provider.id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold">{provider.name}</p>
                        <p className="mt-1 text-sm text-slate-300">{provider.tagline}</p>
                      </div>
                      <span className="rounded-full border border-cyan-400/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
                        {provider.localFirst ? 'Local-first' : 'Cloud'}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {provider.models.slice(0, 3).map((model) => (
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

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-6 md:grid-cols-3">
            {featureColumns.map((column, index) => {
              const icons = [Bot, Layers3, ShieldCheck]
              const Icon = icons[index] || Bot
              return (
                <div key={column.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <Icon className="h-8 w-8 text-cyan-300" />
                  <h2 className="mt-4 text-2xl font-semibold">{column.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{column.detail}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Five Signature Features</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
              {innovationFeatureCards.map((feature) => (
                <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{feature.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-300">Gap Coverage</p>
                <h2 className="mt-3 text-3xl font-semibold">Where Talent closes the product gap</h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-slate-300">
                We used Claude Code&apos;s documented agent workflow as the verified benchmark and treated OpenConsole as the
                console-first multi-provider baseline to close the missing release, editor, and packaging layers.
              </p>
            </div>
            <div className="mt-8 overflow-hidden rounded-3xl border border-white/10">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                <thead className="bg-white/5 text-slate-300">
                  <tr>
                    <th className="px-4 py-3 font-medium">Capability</th>
                    <th className="px-4 py-3 font-medium">Claude Code</th>
                    <th className="px-4 py-3 font-medium">OpenConsole</th>
                    <th className="px-4 py-3 font-medium">Talent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {comparisonRows.map((row) => (
                    <tr key={row.feature} className="bg-slate-950/70">
                      <td className="px-4 py-4 text-white">{row.feature}</td>
                      <td className="px-4 py-4 text-slate-300">{row.claudeCode}</td>
                      <td className="px-4 py-4 text-slate-300">{row.openConsole}</td>
                      <td className="px-4 py-4 text-cyan-200">{row.talent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <Blocks className="h-8 w-8 text-amber-300" />
              <h3 className="mt-4 text-2xl font-semibold">Web app</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Prompt, plan, validate, and package releases inside a browser-first workbench built for model switching.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <BriefcaseBusiness className="h-8 w-8 text-emerald-300" />
              <h3 className="mt-4 text-2xl font-semibold">Enterprise rollout</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Share provider presets, codify review rules, and keep vendor optionality without splitting your tooling.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <CheckCircle2 className="h-8 w-8 text-cyan-300" />
              <h3 className="mt-4 text-2xl font-semibold">Release-ready docs</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Download, setup, pricing, and launch documentation ship with the product instead of sitting in a backlog.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-3">
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
      </main>
      <SiteFooter />
    </div>
  )
}
