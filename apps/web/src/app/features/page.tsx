import { SiteFooter } from '@/components/talent/site-footer'
import { SiteHeader } from '@/components/talent/site-header'
import { comparisonRows } from '@/lib/talent/catalog'
import { innovationFeatures } from '@/lib/talent/innovation'

const featureGroups = [
  {
    title: 'Before the first run',
    description: 'These systems stop vague or risky prompts before the first model call starts.',
    ids: ['mission-lock', 'release-gate', 'hidden-pain', 'freshness-sentinel'],
  },
  {
    title: 'While decisions are being made',
    description: 'These features help compare options, predict breakage, and lock the deliverable contract.',
    ids: ['jury', 'blast-radius', 'release-contract', 'proof-gate'],
  },
  {
    title: 'When the workflow gets messy',
    description: 'These features keep context alive, recover from provider failures, and preserve good runs.',
    ids: ['session-capsule', 'continuity-vault', 'auto-heal', 'ops-ledger'],
  },
  {
    title: 'Right before public sharing',
    description: 'These features make the repo, docs, and launch note story actually shippable.',
    ids: ['ship-memo'],
  },
]

const featureMap = Object.fromEntries(innovationFeatures.map((feature) => [feature.id, feature]))

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#020617_0%,_#111827_100%)] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <section className="max-w-4xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Features</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight">Release intelligence for the parts most tools ignore.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            CodeOrbit AI is built around the hidden failure modes of AI coding workflows: intent drift, missing proof,
            stale guidance, invisible coordination work, manual provider recovery, and public launch friction.
          </p>
        </section>

        <section className="mt-12 space-y-8">
          {featureGroups.map((group) => (
            <article key={group.title} className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-300">{group.title}</p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">{group.description}</p>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {group.ids.map((id) => {
                  const feature = featureMap[id]
                  if (!feature) {
                    return null
                  }

                  return (
                    <div key={feature.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                      <h2 className="text-2xl font-semibold">{feature.name}</h2>
                      <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-400">Pain point</p>
                      <p className="mt-2 text-sm leading-7 text-slate-200">{feature.painPoint}</p>
                      <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-400">What changes</p>
                      <p className="mt-2 text-sm leading-7 text-slate-200">{feature.outcome}</p>
                      <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-400">Implementation</p>
                      <p className="mt-2 text-sm leading-7 text-slate-200">{feature.implementation}</p>
                    </div>
                  )
                })}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-14 rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Category comparison</p>
          <div className="mt-6 overflow-x-auto">
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
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
