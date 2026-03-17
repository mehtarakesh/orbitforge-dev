import { SiteFooter } from '@/components/talent/site-footer'
import { SiteHeader } from '@/components/talent/site-header'
import { pricingPlans } from '@/lib/talent/catalog'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#020617_0%,_#111827_100%)] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Pricing</p>
          <h1 className="mt-4 text-5xl font-semibold">Choose your rollout path.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            CodeOrbit AI is priced to support local-first builders, shipping teams, and enterprise engineering orgs
            standardizing cross-model development workflows.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <section key={plan.name} className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{plan.name}</p>
              <h2 className="mt-4 text-4xl font-semibold">{plan.price}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">{plan.audience}</p>
              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                    {feature}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
