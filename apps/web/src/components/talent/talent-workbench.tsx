'use client'

import { useEffect, useMemo, useState } from 'react'

import { providerCatalog, releaseChecklist } from '@/lib/talent/catalog'

type ProviderRecord = {
  id: string
  name: string
  tagline: string
  baseUrl: string
  models: string[]
}

type ApiResult = {
  output: string
  provider: string
  model: string
  baseUrl: string
}

const starterPrompt = 'Review the selected workspace, suggest the implementation plan, produce the patch strategy, and define the release validation steps.'

export function TalentWorkbench() {
  const [providers, setProviders] = useState<ProviderRecord[]>(providerCatalog)
  const [provider, setProvider] = useState(providerCatalog[0]?.id || 'ollama')
  const [model, setModel] = useState(providerCatalog[0]?.models[0] || 'deepseek-coder:33b')
  const [baseUrl, setBaseUrl] = useState(providerCatalog[0]?.baseUrl || 'http://localhost:11434')
  const [apiKey, setApiKey] = useState('')
  const [workspaceContext, setWorkspaceContext] = useState('apps/web and apps/api are the active code surfaces. Focus on coding-assistant UX, release readiness, provider interoperability, and docs parity.')
  const [prompt, setPrompt] = useState(starterPrompt)
  const [result, setResult] = useState<ApiResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadProviders() {
      try {
        const response = await fetch('/api/talent/providers')
        const data = await response.json()

        if (!cancelled && Array.isArray(data.providers)) {
          setProviders(data.providers)
        }
      } catch {
        // Keep client-side fallback catalog if discovery is unavailable.
      }
    }

    loadProviders()

    return () => {
      cancelled = true
    }
  }, [])

  const activeProvider = useMemo(
    () => providers.find((entry) => entry.id === provider) || providerCatalog[0],
    [provider, providers]
  )

  useEffect(() => {
    if (!activeProvider) {
      return
    }

    setBaseUrl(activeProvider.baseUrl)
    setModel(activeProvider.models[0] || '')
  }, [activeProvider])

  async function runPrompt() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/talent/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          model,
          baseUrl,
          apiKey,
          prompt,
          workspaceContext,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Talent request failed.')
      }

      setResult(data)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Request failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-950/30">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Talent Workbench</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Ship from prompt to release notes</h1>
          </div>
          <button
            type="button"
            onClick={() => setPrompt(starterPrompt)}
            className="rounded-full border border-cyan-400/40 px-4 py-2 text-sm text-cyan-100 transition hover:border-cyan-300 hover:text-white"
          >
            Reset prompt
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Provider</span>
            <select
              value={provider}
              onChange={(event) => setProvider(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
            >
              {providers.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Model</span>
            <input
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Base URL</span>
            <input
              value={baseUrl}
              onChange={(event) => setBaseUrl(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
            />
          </label>
        </div>

        <label className="mt-4 block space-y-2">
          <span className="text-sm text-slate-300">API Key</span>
          <input
            type="password"
            placeholder="Optional for local providers"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
          />
        </label>

        <label className="mt-4 block space-y-2">
          <span className="text-sm text-slate-300">Workspace context</span>
          <textarea
            rows={5}
            value={workspaceContext}
            onChange={(event) => setWorkspaceContext(event.target.value)}
            className="w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
          />
        </label>

        <label className="mt-4 block space-y-2">
          <span className="text-sm text-slate-300">Task prompt</span>
          <textarea
            rows={7}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className="w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
          />
        </label>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={runPrompt}
            disabled={loading}
            className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Running...' : 'Run talent prompt'}
          </button>
          <button
            type="button"
            onClick={() => setPrompt('Inspect the workspace, identify release blockers, and produce a reviewer-ready checklist.')}
            className="rounded-full border border-white/15 px-5 py-3 text-sm text-white transition hover:border-white/40"
          >
            Release audit
          </button>
          <button
            type="button"
            onClick={() => setPrompt('Review the current files, outline the patch, and write the validation commands before coding.')}
            className="rounded-full border border-white/15 px-5 py-3 text-sm text-white transition hover:border-white/40"
          >
            Patch planning
          </button>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-100">
            {error}
          </div>
        ) : null}
      </section>

      <section className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Provider Profile</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{activeProvider?.name}</h2>
          <p className="mt-3 text-sm text-slate-300">{activeProvider?.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeProvider?.models.map((entry) => (
              <span key={entry} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200">
                {entry}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-300">Release Checklist</p>
          <div className="mt-4 space-y-3">
            {releaseChecklist.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Latest Output</p>
          <div className="mt-4 rounded-3xl bg-slate-900 p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-slate-500">
              {result ? `${result.provider} / ${result.model}` : 'Awaiting run'}
            </p>
            <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap text-sm leading-6 text-slate-100">
              {result?.output || 'Run a prompt to generate plan, implementation notes, validation, and remaining risk sections.'}
            </pre>
          </div>
        </div>
      </section>
    </div>
  )
}
