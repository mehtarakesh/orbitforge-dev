import { SiteFooter } from '@/components/talent/site-footer'
import { SiteHeader } from '@/components/talent/site-header'
import { deploymentEnvironmentFields, deploymentSteps, siteUrl } from '@/lib/talent/site'

export default function DeployPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_24%),linear-gradient(180deg,_#020617_0%,_#0f172a_55%,_#020617_100%)] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">Deploy</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight">
              Launch the full CodeOrbit AI website on a free Vercel stack.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              The hosted surface includes the marketing site, workbench, documentation, pricing, download center, and
              the public health endpoint. For Next.js, Vercel Hobby is the cleanest zero-cost path to go live quickly.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Primary domain</p>
                <p className="mt-3 text-2xl font-semibold">{siteUrl.replace('https://', '')}</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Project root</p>
                <p className="mt-3 text-2xl font-semibold">apps/web</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-400/20 bg-slate-950/80 p-7 shadow-2xl shadow-cyan-950/30">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Launch commands</p>
            <div className="mt-5 space-y-4 text-sm text-slate-200">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <code>npm install</code>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <code>npm run test:web</code>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <code>npm run build:web</code>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          {deploymentSteps.map((step, index) => (
            <article key={step.id} className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7">
              <p className="text-sm uppercase tracking-[0.28em] text-fuchsia-300">Step {index + 1}</p>
              <h2 className="mt-3 text-2xl font-semibold">{step.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">{step.body}</p>
              <div className="mt-5 space-y-3">
                {step.bullets.map((bullet) => (
                  <div key={bullet} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                    {bullet}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-14 rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Environment matrix</p>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead>
                <tr className="text-slate-400">
                  <th className="pb-4 pr-6 font-medium">Variable</th>
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
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
