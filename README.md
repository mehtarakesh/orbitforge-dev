# OrbitForge

OrbitForge is the public product repo for the cross-platform developer surfaces behind `orbitforge.dev`:

- VS Code extension
- Desktop app
- CLI

The `apps/web` product has been removed from this public repository for now.

## Public Repo Scope

This public repo currently includes:

- `apps/orbitforge-vscode`
- `apps/orbitforge-desktop`
- `apps/orbitforge-cli`

This public repo currently does not include:

- the hosted web app
- the marketing website
- the deployable Next.js product site

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

## Apps

### VS Code Extension

Located in `apps/orbitforge-vscode`.

### Desktop App

Located in `apps/orbitforge-desktop`.

### CLI

Located in `apps/orbitforge-cli`.

## Note

The hosted web product for `orbitforge.dev` was intentionally removed from the public GitHub repository. If and when it returns, it can be restored from a private local backup or a private source repo.
