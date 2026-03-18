export type SiteLink = {
  href: string
  label: string
}

export type FooterGroup = {
  title: string
  links: SiteLink[]
}

export type PlatformSurface = {
  platform: string
  surfaces: string[]
  packaging: string
  bestFor: string
}

export type DeploymentStep = {
  id: string
  title: string
  body: string
  bullets: string[]
}

export type EnvironmentField = {
  key: string
  required: boolean
  description: string
  example: string
}

export type VerificationItem = {
  name: string
  proof: string
  whyItMatters: string
}

const defaultSiteUrl = 'https://codeorbit-ai.dev'

export function normalizeSiteUrl(raw?: string) {
  return (raw || defaultSiteUrl).replace(/\/+$/, '')
}

export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)

export const siteDescription =
  'CodeOrbit AI is a model-agnostic AI coding workspace with a hosted website, browser workbench, desktop app, CLI, and VS Code extension.'

export const siteKeywords = [
  'AI coding tool',
  'AI developer platform',
  'Ollama',
  'LM Studio',
  'OpenAI-compatible',
  'VS Code extension',
  'desktop coding app',
  'code generation',
  'release workflow',
  'multi-model coding',
]

export const siteNavLinks: SiteLink[] = [
  { href: '/features', label: 'Features' },
  { href: '/docs', label: 'Docs' },
  { href: '/deploy', label: 'Deploy' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/download', label: 'Download' },
  { href: '/status', label: 'Status' },
]

export const footerGroups: FooterGroup[] = [
  {
    title: 'Product',
    links: [
      { href: '/app', label: 'Workbench' },
      { href: '/features', label: 'Release Intelligence' },
      { href: '/download', label: 'Downloads' },
      { href: '/pricing', label: 'Plans' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/docs', label: 'Documentation' },
      { href: '/deploy', label: 'Deployment Guide' },
      { href: '/evidence', label: 'Proof Center' },
      { href: '/status', label: 'Operational Status' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: 'mailto:hello@codeorbit-ai.dev', label: 'Contact' },
      { href: 'mailto:sales@codeorbit-ai.dev', label: 'Enterprise' },
      { href: 'mailto:support@codeorbit-ai.dev', label: 'Support' },
    ],
  },
]

export const launchStats = [
  { label: 'Execution lanes', value: '6 providers' },
  { label: 'Shipping surfaces', value: 'Web, CLI, desktop, VS Code' },
  { label: 'Release safeguards', value: '13 intelligence systems' },
  { label: 'Hosting target', value: 'Vercel Hobby + custom domain' },
]

export const platformMatrix: PlatformSurface[] = [
  {
    platform: 'macOS',
    surfaces: ['Hosted web app', 'Desktop app', 'CLI', 'VS Code extension'],
    packaging: 'DMG + ZIP for desktop, VSIX for editor, TGZ for CLI',
    bestFor: 'Local-first builders using Ollama, LM Studio, and desktop packaging.',
  },
  {
    platform: 'Windows',
    surfaces: ['Hosted web app', 'Desktop app', 'CLI', 'VS Code extension'],
    packaging: 'NSIS + ZIP for desktop, VSIX for editor, TGZ for CLI',
    bestFor: 'Teams standardizing PowerShell, enterprise laptops, and shared rollout rules.',
  },
  {
    platform: 'Linux',
    surfaces: ['Hosted web app', 'Desktop app', 'CLI'],
    packaging: 'AppImage + tar.gz for desktop, TGZ for CLI',
    bestFor: 'CI pipelines, self-hosted coding flows, and local model infrastructure.',
  },
]

export const deploymentSteps: DeploymentStep[] = [
  {
    id: 'import',
    title: 'Import the repo into Vercel',
    body: 'Use a Vercel Hobby project and connect the GitHub repository that contains the public CodeOrbit AI web app.',
    bullets: [
      'Create a new Vercel project from GitHub.',
      'Set the Root Directory to `apps/web`.',
      'Keep the framework as Next.js and use Node 20 or newer.',
    ],
  },
  {
    id: 'env',
    title: 'Add environment variables',
    body: 'Set the public site URL plus whichever provider keys or base URLs you want enabled in production.',
    bullets: [
      'Set `NEXT_PUBLIC_SITE_URL=https://codeorbit-ai.dev`.',
      'Add hosted provider keys only if you want cloud models enabled.',
      'Keep local-provider URLs optional so the public site still works without local infrastructure.',
    ],
  },
  {
    id: 'domain',
    title: 'Attach codeorbit-ai.dev',
    body: 'Point the apex domain and optional `www` subdomain to Vercel so the hosted marketing site and workbench live on one address.',
    bullets: [
      'Add `codeorbit-ai.dev` in Vercel Project Settings -> Domains.',
      'Follow Vercel DNS prompts for the apex record and `www` CNAME.',
      'Wait for SSL issuance, then set the production domain as primary.',
    ],
  },
  {
    id: 'launch',
    title: 'Run public launch checks',
    body: 'Before announcing the product, validate the key routes, health endpoint, and build pipeline from the same repo state you deploy.',
    bullets: [
      'Run `npm run test:web` and `npm run build:web` from the repo root.',
      'Open `/`, `/features`, `/docs`, `/download`, `/pricing`, and `/api/health`.',
      'Verify the provider catalog and download/install guidance match the actual shipped surfaces.',
    ],
  },
]

export const deploymentEnvironmentFields: EnvironmentField[] = [
  {
    key: 'NEXT_PUBLIC_SITE_URL',
    required: true,
    description: 'Canonical public domain used for metadata, sitemap, and links.',
    example: 'https://codeorbit-ai.dev',
  },
  {
    key: 'OLLAMA_BASE_URL',
    required: false,
    description: 'Optional Ollama endpoint for local/private deployments.',
    example: 'http://localhost:11434',
  },
  {
    key: 'LMSTUDIO_BASE_URL',
    required: false,
    description: 'Optional LM Studio OpenAI-compatible endpoint.',
    example: 'http://localhost:1234/v1',
  },
  {
    key: 'OPENAI_API_KEY',
    required: false,
    description: 'Enables OpenAI routes for hosted runs.',
    example: 'sk-...',
  },
  {
    key: 'ANTHROPIC_API_KEY',
    required: false,
    description: 'Enables Anthropic routes for hosted runs.',
    example: 'sk-ant-...',
  },
  {
    key: 'OPENROUTER_API_KEY',
    required: false,
    description: 'Enables OpenRouter brokered model access.',
    example: 'sk-or-...',
  },
]

export const verificationItems: VerificationItem[] = [
  {
    name: 'Public routes',
    proof: 'Home, features, docs, deploy, pricing, download, status, and evidence all render without private localhost dependencies.',
    whyItMatters: 'A public product site should not collapse when it leaves the development laptop.',
  },
  {
    name: 'Health endpoint',
    proof: 'The hosted app exposes `/api/health` for uptime checks and deployment validation.',
    whyItMatters: 'Operations and trust need a machine-readable status signal, not only screenshots.',
  },
  {
    name: 'Release content parity',
    proof: 'Pricing, downloads, docs, and the README describe the same shipped surfaces and deployment flow.',
    whyItMatters: 'Public claims need to match reality across every surface a new user sees.',
  },
  {
    name: 'Cross-surface install story',
    proof: 'The repo documents web hosting, CLI packaging, desktop targets, and VS Code packaging together.',
    whyItMatters: 'A product feels unfinished when the installation story changes by surface.',
  },
]
