export type ProviderId = 'ollama' | 'lmstudio' | 'openai' | 'anthropic' | 'openrouter' | 'openai-compatible'

export type AgentMode = 'single' | 'parallel'

export type AgentRoleId = 'architect' | 'implementer' | 'critic'

export type OrbitForgeRequest = {
  provider: ProviderId
  model: string
  baseUrl: string
  apiKey?: string
  prompt: string
  workspaceContext?: string
  temperature?: number
  mode?: AgentMode
  agents?: AgentRoleId[]
}

export type ProviderInvocation = {
  provider: ProviderId
  model: string
  baseUrl: string
  apiKey?: string
  temperature?: number
  systemPrompt: string
  userPrompt: string
}

export type OrbitForgeAgentResult = {
  id: AgentRoleId
  title: string
  focus: string
  status: 'success' | 'error'
  output: string
  durationMs: number
}

export type OrbitForgeRunResult = {
  mode: AgentMode
  provider: ProviderId
  model: string
  summary: string
  output: string
  agents: OrbitForgeAgentResult[]
}

export type OrbitForgeRunOptions = {
  invoker?: (invocation: ProviderInvocation) => Promise<string>
}

type AgentDefinition = {
  id: AgentRoleId
  title: string
  focus: string
  systemPrompt: string
}

export const defaultSystemPrompt = `You are OrbitForge, a release-ready software engineer.
Always return:
1. A concise plan.
2. The implementation approach.
3. Validation steps.
4. Remaining risks.`

const synthesisSystemPrompt = `You are OrbitForge Synthesizer.
You merge multiple coding-agent lanes into one decisive answer.
Always return:
1. The converged implementation path.
2. Validation steps that should actually be run.
3. Risks and disagreements that still need a human decision.`

export const defaultParallelAgents: AgentRoleId[] = ['architect', 'implementer', 'critic']

export const providerDefaults: Record<ProviderId, { baseUrl: string; model: string }> = {
  ollama: { baseUrl: 'http://localhost:11434', model: 'deepseek-coder:33b' },
  lmstudio: { baseUrl: 'http://localhost:1234/v1', model: 'deepseek-coder' },
  openai: { baseUrl: 'https://api.openai.com/v1', model: 'gpt-4.1' },
  anthropic: { baseUrl: 'https://api.anthropic.com/v1', model: 'claude-sonnet-4-5' },
  openrouter: { baseUrl: 'https://openrouter.ai/api/v1', model: 'anthropic/claude-sonnet-4' },
  'openai-compatible': { baseUrl: 'http://localhost:1234/v1', model: 'local-model' },
}

export function getProviderDefaults(provider: ProviderId) {
  return providerDefaults[provider]
}

const agentDefinitions: Record<AgentRoleId, AgentDefinition> = {
  architect: {
    id: 'architect',
    title: 'Architect',
    focus: 'Decompose the work, identify impacted surfaces, and recommend execution order.',
    systemPrompt: `You are OrbitForge Architect.
Focus on decomposition, affected files, rollout order, migration concerns, and hidden coupling.
Return:
1. The shape of the solution.
2. The main files or modules likely involved.
3. The safest execution order.
4. Structural risks.`,
  },
  implementer: {
    id: 'implementer',
    title: 'Implementer',
    focus: 'Propose the concrete patch plan, APIs, commands, and edge-case handling.',
    systemPrompt: `You are OrbitForge Implementer.
Focus on the actual patch strategy, code paths, request shapes, validation commands, and platform caveats.
Return:
1. The concrete implementation approach.
2. The code-level or config-level changes.
3. Validation commands or checks.
4. Delivery risks.`,
  },
  critic: {
    id: 'critic',
    title: 'Critic',
    focus: 'Challenge assumptions, spot regressions, and surface missing proof.',
    systemPrompt: `You are OrbitForge Critic.
Focus on what could break, what has not been proven, what is missing from validation, and where the plan is overconfident.
Return:
1. The weakest assumptions.
2. Missing tests or proof.
3. Likely regressions.
4. What a human should double-check before shipping.`,
  },
}

function getWorkspaceContextBlock(workspaceContext?: string) {
  return workspaceContext?.trim() ? workspaceContext.trim() : 'Not provided.'
}

function buildUserPrompt(task: string, workspaceContext?: string, focus?: string) {
  return `Workspace context:\n${getWorkspaceContextBlock(workspaceContext)}\n\nTask:\n${task.trim()}${
    focus ? `\n\nRole focus:\n${focus}` : ''
  }`
}

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/$/, '')
}

async function readJson(response: Response) {
  const text = await response.text()

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`Unexpected response: ${text.slice(0, 400)}`)
  }
}

function resolveApiKey(provider: ProviderId, explicitApiKey?: string) {
  if (explicitApiKey) {
    return explicitApiKey
  }

  switch (provider) {
    case 'anthropic':
      return process.env.ANTHROPIC_API_KEY || ''
    case 'openrouter':
      return process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || ''
    case 'openai-compatible':
      return process.env.OPENAI_COMPATIBLE_API_KEY || process.env.OPENAI_API_KEY || ''
    case 'openai':
      return process.env.OPENAI_API_KEY || ''
    case 'ollama':
    case 'lmstudio':
    default:
      return ''
  }
}

export async function invokeProvider(invocation: ProviderInvocation) {
  const baseUrl = normalizeBaseUrl(invocation.baseUrl)

  if (invocation.provider === 'anthropic') {
    const response = await fetch(`${baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': resolveApiKey('anthropic', invocation.apiKey),
      },
      body: JSON.stringify({
        model: invocation.model,
        max_tokens: 2400,
        temperature: invocation.temperature ?? 0.2,
        system: invocation.systemPrompt,
        messages: [{ role: 'user', content: invocation.userPrompt }],
      }),
    })

    const payload = await readJson(response)

    if (!response.ok) {
      throw new Error(payload.error?.message || payload.error?.type || 'Anthropic request failed')
    }

    return payload.content?.map((entry: { text?: string }) => entry.text || '').join('\n') || ''
  }

  if (invocation.provider === 'ollama') {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: invocation.model,
        stream: false,
        options: {
          temperature: invocation.temperature ?? 0.2,
        },
        messages: [
          { role: 'system', content: invocation.systemPrompt },
          { role: 'user', content: invocation.userPrompt },
        ],
      }),
    })

    const payload = await readJson(response)

    if (!response.ok) {
      throw new Error(payload.error || 'Ollama request failed')
    }

    return payload.message?.content || ''
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(resolveApiKey(invocation.provider, invocation.apiKey)
        ? { Authorization: `Bearer ${resolveApiKey(invocation.provider, invocation.apiKey)}` }
        : {}),
    },
    body: JSON.stringify({
      model: invocation.model,
      temperature: invocation.temperature ?? 0.2,
      messages: [
        { role: 'system', content: invocation.systemPrompt },
        { role: 'user', content: invocation.userPrompt },
      ],
    }),
  })

  const payload = await readJson(response)

  if (!response.ok) {
    throw new Error(payload.error?.message || payload.error || 'Provider request failed')
  }

  return payload.choices?.[0]?.message?.content || ''
}

function sanitizeAgents(requestedAgents?: AgentRoleId[]) {
  const source = requestedAgents?.length ? requestedAgents : defaultParallelAgents
  const deduped = Array.from(new Set(source.filter((agentId) => agentDefinitions[agentId])))
  return deduped.length ? deduped : defaultParallelAgents
}

function getInvoker(options?: OrbitForgeRunOptions) {
  return options?.invoker || invokeProvider
}

function buildSynthesisPrompt(request: OrbitForgeRequest, agentResults: OrbitForgeAgentResult[]) {
  const lanes = agentResults
    .filter((entry) => entry.status === 'success')
    .map(
      (entry) =>
        `### ${entry.title}\nFocus: ${entry.focus}\n\n${entry.output.trim()}`
    )
    .join('\n\n')

  return `Task:\n${request.prompt.trim()}\n\nWorkspace context:\n${getWorkspaceContextBlock(
    request.workspaceContext
  )}\n\nAgent lanes:\n${lanes}`
}

function formatParallelOutput(
  request: OrbitForgeRequest,
  agentResults: OrbitForgeAgentResult[],
  synthesisOutput?: string
) {
  const metadata = `Mode: parallel\nProvider: ${request.provider}\nModel: ${request.model}\nAgents: ${agentResults
    .map((entry) => entry.title)
    .join(', ')}`

  const sections = agentResults
    .map((entry) => {
      const heading = `## ${entry.title} ${entry.status === 'success' ? 'Lane' : 'Lane Error'}`
      const meta = `Focus: ${entry.focus}\nDuration: ${entry.durationMs}ms`
      return `${heading}\n${meta}\n\n${entry.output.trim()}`
    })
    .join('\n\n')

  const convergence = synthesisOutput?.trim()
    ? `## Converged Recommendation\n${synthesisOutput.trim()}\n\n`
    : ''

  return `# OrbitForge Parallel Agent Run\n${metadata}\n\n${convergence}${sections}`.trim()
}

function buildSummary(mode: AgentMode, agentResults: OrbitForgeAgentResult[], synthesisOutput?: string) {
  if (mode === 'single') {
    return 'Single agent run completed.'
  }

  const successCount = agentResults.filter((entry) => entry.status === 'success').length
  return synthesisOutput?.trim()
    ? `${successCount}/${agentResults.length} agent lanes completed and converged.`
    : `${successCount}/${agentResults.length} agent lanes completed.`
}

async function runSingleAgent(request: OrbitForgeRequest, options?: OrbitForgeRunOptions): Promise<OrbitForgeRunResult> {
  const output = await getInvoker(options)({
    provider: request.provider,
    model: request.model,
    baseUrl: request.baseUrl,
    apiKey: request.apiKey,
    temperature: request.temperature,
    systemPrompt: defaultSystemPrompt,
    userPrompt: buildUserPrompt(request.prompt, request.workspaceContext),
  })

  return {
    mode: 'single',
    provider: request.provider,
    model: request.model,
    summary: buildSummary('single', []),
    output,
    agents: [],
  }
}

async function runParallelAgents(request: OrbitForgeRequest, options?: OrbitForgeRunOptions): Promise<OrbitForgeRunResult> {
  const invoker = getInvoker(options)
  const selectedAgents = sanitizeAgents(request.agents)

  const agentResults = await Promise.all(
    selectedAgents.map(async (agentId) => {
      const agent = agentDefinitions[agentId]
      const startedAt = Date.now()

      try {
        const output = await invoker({
          provider: request.provider,
          model: request.model,
          baseUrl: request.baseUrl,
          apiKey: request.apiKey,
          temperature: request.temperature,
          systemPrompt: agent.systemPrompt,
          userPrompt: buildUserPrompt(request.prompt, request.workspaceContext, agent.focus),
        })

        return {
          id: agent.id,
          title: agent.title,
          focus: agent.focus,
          status: 'success' as const,
          output,
          durationMs: Date.now() - startedAt,
        }
      } catch (error) {
        return {
          id: agent.id,
          title: agent.title,
          focus: agent.focus,
          status: 'error' as const,
          output: error instanceof Error ? error.message : 'Parallel agent lane failed.',
          durationMs: Date.now() - startedAt,
        }
      }
    })
  )

  const successfulResults = agentResults.filter((entry) => entry.status === 'success')
  let synthesisOutput = ''

  if (successfulResults.length >= 2) {
    try {
      synthesisOutput = await invoker({
        provider: request.provider,
        model: request.model,
        baseUrl: request.baseUrl,
        apiKey: request.apiKey,
        temperature: request.temperature,
        systemPrompt: synthesisSystemPrompt,
        userPrompt: buildSynthesisPrompt(request, successfulResults),
      })
    } catch {
      synthesisOutput = ''
    }
  }

  return {
    mode: 'parallel',
    provider: request.provider,
    model: request.model,
    summary: buildSummary('parallel', agentResults, synthesisOutput),
    output: formatParallelOutput(request, agentResults, synthesisOutput),
    agents: agentResults,
  }
}

export async function runOrbitForgeTask(request: OrbitForgeRequest, options?: OrbitForgeRunOptions) {
  if ((request.mode || 'single') === 'parallel') {
    return runParallelAgents(request, options)
  }

  return runSingleAgent(request, options)
}

export function parseAgentIds(input?: string) {
  if (!input?.trim()) {
    return undefined
  }

  const parsed = input
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean) as AgentRoleId[]

  return sanitizeAgents(parsed)
}
