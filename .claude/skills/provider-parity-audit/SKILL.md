# Provider Parity Audit

Use this skill when a task touches provider support, request plumbing, or response parsing in OrbitForge.

## Goal

Keep the CLI, desktop app, and VS Code extension behaviorally aligned when they talk to Ollama, LM Studio, Anthropic, OpenAI, OpenRouter, or OpenAI-compatible endpoints.

## When To Use It

Use this skill when the task involves:

- provider IDs
- auth headers
- base URL defaults
- model selection
- request payload shape
- response parsing
- error handling

## Workflow

1. Inspect the same behavior in all three public surfaces.
2. Identify drift, duplication, and hidden incompatibilities.
3. Fix the requested problem in the primary surface.
4. Either bring the other surfaces to parity or document the intentional difference.
5. Update the README if the public capability story changed.
6. Run the relevant build commands before finishing.

## OrbitForge-Specific Pitfalls

- fixing one provider path in the extension while the CLI still breaks
- handling Anthropic differently without documenting why
- changing default local endpoints in one place only
- returning different failure wording for the same provider error

## Good Outcomes

A strong result leaves the repo more consistent across surfaces than it was before the change started.
