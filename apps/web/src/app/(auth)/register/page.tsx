'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const storageKey = 'codeorbit-ai-profile'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [team, setTeam] = useState('')
  const [primaryProvider, setPrimaryProvider] = useState('Ollama')
  const [useCase, setUseCase] = useState('Ship product updates with proof and release checks.')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!name.trim() || !email.trim()) {
        throw new Error('Add your name and work email to create the browser profile.')
      }

      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          team: team.trim(),
          primaryProvider,
          useCase,
          createdAt: new Date().toISOString(),
        })
      )

      router.push('/app')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create your local profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] px-4 py-14 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Start free</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Create a local CodeOrbit AI browser profile.</h1>
          <p className="mt-5 text-sm leading-7 text-slate-300">
            This hosted signup flow is local-first on purpose. It lets you configure your preferred provider lane and
            jump into the workbench without requiring a separate auth backend for the public launch.
          </p>
          <div className="mt-6 space-y-3 text-sm text-slate-200">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Provider preference saved in this browser only.</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Use it for hosted demos, local teams, or enterprise discovery calls.</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Your model credentials still live in environment variables, not in this form.</div>
          </div>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error ? <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</div> : null}
            <div>
              <label htmlFor="name" className="text-sm text-slate-300">
                Full name
              </label>
              <input
                id="name"
                type="text"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50"
                placeholder="Jane Doe"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
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
                Team
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
            <div>
              <label htmlFor="provider" className="text-sm text-slate-300">
                Primary provider
              </label>
              <select
                id="provider"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50"
                value={primaryProvider}
                onChange={(event) => setPrimaryProvider(event.target.value)}
              >
                <option>Ollama</option>
                <option>LM Studio</option>
                <option>OpenAI</option>
                <option>Anthropic</option>
                <option>OpenRouter</option>
              </select>
            </div>
            <div>
              <label htmlFor="use-case" className="text-sm text-slate-300">
                Main use case
              </label>
              <textarea
                id="use-case"
                className="mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50"
                value={useCase}
                onChange={(event) => setUseCase(event.target.value)}
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
            >
              {loading ? 'Creating profile...' : 'Create browser profile'}
            </button>
          </form>
          <p className="mt-6 text-sm text-slate-400">
            Already created one?{' '}
            <Link href="/login" className="text-cyan-200 hover:text-white">
              Resume it here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
