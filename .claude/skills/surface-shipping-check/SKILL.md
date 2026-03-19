# Surface Shipping Check

Use this skill when a task affects packaging, release behavior, or public claims about what OrbitForge ships.

## Goal

Keep the public repo honest and release-oriented across the extension, desktop app, and CLI.

## When To Use It

Use this skill when the task touches:

- build commands
- package commands
- release notes
- README claims
- cross-platform desktop behavior
- VS Code packaging
- CLI distribution

## Workflow

1. Identify which public surfaces are affected.
2. Verify the README still matches reality.
3. Run the relevant build or package commands for the touched surfaces.
4. Record any platform-specific gaps that remain.
5. Prefer shipping-safe wording over marketing wording.

## OrbitForge-Specific Priorities

- keep Windows, macOS, and Linux packaging status explicit
- keep the public/private repo boundary explicit
- call out unverified platform paths instead of hand-waving them away
- keep contributor instructions synced with the actual scripts in `package.json`
