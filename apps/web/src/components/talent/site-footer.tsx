import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <p>CodeOrbit AI ships browser, VS Code, desktop, CLI, and enterprise rollout surfaces from one repo.</p>
        <div className="flex gap-4">
          <Link href="/docs" className="hover:text-white">
            Docs
          </Link>
          <Link href="/pricing" className="hover:text-white">
            Pricing
          </Link>
          <Link href="/download" className="hover:text-white">
            Download
          </Link>
        </div>
      </div>
    </footer>
  )
}
