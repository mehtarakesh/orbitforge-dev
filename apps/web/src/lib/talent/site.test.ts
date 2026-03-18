import { describe, expect, it } from 'vitest'

import {
  deploymentEnvironmentFields,
  deploymentSteps,
  footerGroups,
  normalizeSiteUrl,
  platformMatrix,
  siteNavLinks,
} from '@/lib/talent/site'

describe('site data', () => {
  it('normalizes the public site url', () => {
    expect(normalizeSiteUrl('https://codeorbit-ai.dev/')).toBe('https://codeorbit-ai.dev')
  })

  it('exposes deployment steps for a hosted launch', () => {
    expect(deploymentSteps.map((step) => step.id)).toEqual(['import', 'env', 'domain', 'launch'])
  })

  it('keeps the main navigation tied to public product routes', () => {
    expect(siteNavLinks.map((link) => link.href)).toEqual(
      expect.arrayContaining(['/features', '/docs', '/deploy', '/pricing', '/download', '/status'])
    )
  })

  it('documents public environment fields and platform coverage', () => {
    expect(deploymentEnvironmentFields.find((field) => field.key === 'NEXT_PUBLIC_SITE_URL')?.required).toBe(true)
    expect(platformMatrix).toHaveLength(3)
  })

  it('keeps footer groups focused on product, resources, and company', () => {
    expect(footerGroups.map((group) => group.title)).toEqual(['Product', 'Resources', 'Company'])
  })
})
