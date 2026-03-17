import { SiteFooter } from '@/components/talent/site-footer'
import { SiteHeader } from '@/components/talent/site-header'
import { TalentWorkbench } from '@/components/talent/talent-workbench'

export default function TalentAppPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-14">
        <TalentWorkbench />
      </main>
      <SiteFooter />
    </div>
  )
}
