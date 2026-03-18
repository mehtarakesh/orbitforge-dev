# CodeOrbit AI

CodeOrbit AI is the public product repo for the cross-platform developer surfaces:

- VS Code extension
- Desktop app
- CLI

The `apps/web` product has been removed from this public repository for now.

## Public Repo Scope

This public repo currently includes:

- `apps/codeorbit-ai-vscode`
- `apps/codeorbit-ai-desktop`
- `apps/codeorbit-ai-cli`

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

Located in `apps/codeorbit-ai-vscode`.

### Desktop App

Located in `apps/codeorbit-ai-desktop`.

### CLI

Located in `apps/codeorbit-ai-cli`.

## Note

The web product was intentionally removed from the public GitHub repository. If and when it returns, it can be restored from a private local backup or a private source repo.
