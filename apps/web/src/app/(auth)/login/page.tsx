'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type LocalProfile = {
  name?: string
  email: string
  team?: string
}

const storageKey = 'codeorbit-ai-profile'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [team, setTeam] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [knownProfile, setKnownProfile] = useState<LocalProfile | null>(null)

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) {
      return
    }

    try {
      const parsed = JSON.parse(raw) as LocalProfile
      setKnownProfile(parsed)
      setEmail(parsed.email || '')
      setTeam(parsed.team || '')
    } catch {
      window.localStorage.removeItem(storageKey)
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!email.trim()) {
        throw new Error('Use the email address tied to this browser profile.')
      }

      const profile: LocalProfile = {
        ...(knownProfile || {}),
        email: email.trim(),
        team: team.trim(),
      }

      window.localStorage.setItem(storageKey, JSON.stringify(profile))
      window.localStorage.setItem('codeorbit-ai-session', JSON.stringify({ email: profile.email, signedInAt: new Date().toISOString() }))
      router.push('/app')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not restore your session.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_26%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] px-4 py-14 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Resume your workspace</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Sign in restores your local browser profile.</h1>
          <p className="mt-5 text-sm leading-7 text-slate-300">
            CodeOrbit AI is local-first. For the hosted public site, “sign in” restores the browser profile you use to
            store preferences before jumping back into the workbench.
          </p>
          {knownProfile ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
              <p className="font-semibold text-white">Existing profile found</p>
              <p className="mt-2">{knownProfile.email}</p>
              {knownProfile.team ? <p className="text-slate-400">{knownProfile.team}</p> : null}
            </div>
          ) : null}
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error ? <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</div> : null}
            <div>
              <label htmlFor="email" className="text-sm text-slate-300">
                Work email
              </label>
              <input
                id="email"
                type="email"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50"
                placeholder="you@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="team" className="text-sm text-slate-300">
                Team or workspace
              </label>
              <input
                id="team"
                type="text"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50"
                placeholder="Platform Engineering"
                value={team}
                onChange={(event) => setTeam(event.target.value)}
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
            >
              {loading ? 'Restoring...' : 'Open workbench'}
            </button>
          </form>
          <p className="mt-6 text-sm text-slate-400">
            Need a fresh browser profile?{' '}
            <Link href="/register" className="text-cyan-200 hover:text-white">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
