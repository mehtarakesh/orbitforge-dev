# OrbitForge

OrbitForge is the public product repo for the cross-platform AI coding surfaces behind `orbitforge.dev`.

This repository focuses on the surfaces developers actually run on their machines:

- VS Code extension
- Desktop app
- CLI

The hosted web app and marketing site are intentionally private for now. This public repo is where the local product experience, provider interoperability, and contributor workflows are developed in the open.

## Why OrbitForge Exists

Most AI coding tools still break at the points that matter most in real work:

- they look multi-model, but one surface gets all the attention and the rest drift
- they treat local models as a second-class path
- they return polished text instead of release-ready output
- they make developers rebuild context every time they switch tools
- they do not give contributors a sharp enough map of what actually needs to improve

OrbitForge exists to solve those failure modes directly.

## Real Pain Points OrbitForge Solves

### 1. Provider freedom usually breaks the moment you change surfaces

The pain:
Most tools say they support many providers, but the CLI, desktop shell, and editor integration do not stay behaviorally aligned. A prompt that works in one surface often needs different settings, different endpoints, or different assumptions in another.

How OrbitForge solves it:
OrbitForge keeps the same provider vocabulary across the public surfaces: `ollama`, `lmstudio`, `openai`, `anthropic`, `openrouter`, and `openai-compatible`. Each surface exposes the same core inputs:

- provider
- model
- base URL
- API key
- workspace context

Why that matters:
Developers can move between VS Code, terminal, and desktop without relearning the product every time. Contributors can also reason about parity gaps directly instead of pretending they do not exist.

Where it lives:

- `apps/orbitforge-vscode`
- `apps/orbitforge-desktop`
- `apps/orbitforge-cli`

### 2. Local AI is still treated like a backup plan instead of a first-class workflow

The pain:
Open-source users, enterprise teams, and privacy-sensitive developers often want Ollama, LM Studio, or another local OpenAI-compatible endpoint. Many tools technically allow this, but the UX is clearly built around hosted keys first and local usage feels bolted on.

How OrbitForge solves it:
OrbitForge keeps local-first paths visible and configurable:

- Ollama defaults are built into the extension, desktop app, and CLI
- LM Studio can be targeted by base URL instead of requiring a special product mode
- OpenAI-compatible endpoints are supported as a general path, not a one-off hack

Why that matters:
The developer can test fast with a local model, move to a hosted model when needed, and keep the same product surface.

### 3. AI coding output is usually fluent, but not shippable

The pain:
A lot of coding assistants return plausible paragraphs that feel helpful in the moment but are weak as implementation artifacts. They skip proof, skip validation, and bury risk. That creates a dangerous illusion of progress.

How OrbitForge solves it:
OrbitForge pushes every surface toward the same release-ready response contract. The default system framing asks for:

1. A concise plan
2. The implementation approach
3. Validation steps
4. Remaining risks

Why that matters:
It turns the assistant into something closer to a shipping collaborator than a chat box. The result is not just "what to do", but also "how to check whether it worked" and "what can still go wrong".

### 4. Workspace context is rebuilt by hand every time someone changes tools

The pain:
Developers constantly lose momentum when they jump between editor, desktop shell, and terminal. Most tools do not help much beyond a blank prompt box.

How OrbitForge solves it:
OrbitForge carries workspace context as a first-class input in every surface. The VS Code extension can summarize the current workspace and selection, while the CLI and desktop shell accept explicit context so the same task can be moved between environments without starting from zero.

Why that matters:
Less time is spent repeating the assignment. More time is spent actually executing it.

### 5. Open-source contributors usually do not know what the hard problems are

The pain:
Many repos say "contributions welcome" but provide no real guidance on which product gaps are structural, repetitive, or strategically important. That causes low-signal PRs and leaves the hardest issues untouched.

How OrbitForge solves it:
This repo now ships with Claude Code-ready project memory, rules, skills, and automation so contributors can work on the real gaps:

- provider parity across surfaces
- packaging and release verification
- shared request/response abstractions
- error normalization
- local-first credential and endpoint ergonomics

Why that matters:
Claude Code can contribute to the repo in a targeted way, and human contributors get a clearer map of what actually moves the product forward.

## What Is Public In This Repo

Public surfaces:

- `apps/orbitforge-vscode`
- `apps/orbitforge-desktop`
- `apps/orbitforge-cli`

Private for now:

- the hosted `orbitforge.dev` web app
- the marketing site
- the private release infrastructure behind the hosted experience

## Build Commands

```bash
npm install
npm run build:extension
npm run build:desktop
npm run build:cli
```

## Packaging Commands

```bash
npm run package:extension
npm run package:desktop
npm run package:desktop:mac
npm run package:desktop:win
npm run package:desktop:linux
npm run package:cli
```

## Contributing With Claude Code

This repo is now prepared for Claude Code contributors.

It includes:

- `CLAUDE.md` for project memory and contribution rules
- `.claude/rules/` for scope-specific repo guidance
- `.claude/skills/` for niche OrbitForge contribution workflows
- `.github/workflows/claude.yml` so `@claude` can help on issues and PR comments once the repo secret is configured

### How to use Claude Code in this repo

1. Open the repo in Claude Code.
2. Let Claude load `CLAUDE.md`.
3. Ask Claude to work on one of the real product gaps below.
4. Use the built-in OrbitForge project skills when the task matches them.

Recommended Claude Code contribution lanes:

- extract a shared provider adapter layer instead of keeping similar request logic in three places
- normalize provider errors so the same failure has the same remediation text everywhere
- add streaming support consistently across CLI, desktop, and VS Code
- add secure credential storage instead of plain config entry where the platform supports it
- strengthen packaging validation for Windows and Linux release paths

## Claude Code Niche Skills In This Repo

### `/provider-parity-audit`

Use this when touching:

- provider lists
- auth headers
- base URL handling
- model routing
- response parsing

It is meant to stop "fixes" that only improve one surface while the others quietly drift.

### `/surface-shipping-check`

Use this when touching:

- release UX
- packaging
- platform-specific behavior
- public docs about what ships

It is meant to keep the desktop app, CLI, and extension aligned with the repo narrative and build commands.

## GitHub Automation For Claude Code

To enable the workflow in `.github/workflows/claude.yml`:

1. Install the Claude GitHub app on this repository.
2. Add the `ANTHROPIC_API_KEY` repository secret.
3. Mention `@claude` on an issue comment or pull request review comment.

That setup lets Claude Code help with review and scoped implementation work inside the public OrbitForge repo.

## Honest Current Gaps

OrbitForge is opinionated about the problems it wants to solve, but the public repo still has open work:

- provider request code is still duplicated across surfaces
- the public repo does not yet expose a shared testing harness for provider parity
- secure credential storage can be improved, especially outside hosted flows
- Windows and Linux packaging need deeper release-host verification

Those are good contribution targets because they attack real product risk, not just cosmetic cleanup.
