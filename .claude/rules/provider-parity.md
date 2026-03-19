# Provider Parity Rule

OrbitForge must behave like one product across three public surfaces, not three unrelated experiments.

When changing provider behavior:

- inspect the CLI, desktop app, and VS Code extension
- keep provider IDs aligned
- keep default base URLs aligned unless a surface has a documented reason not to
- keep auth header behavior aligned
- keep model routing assumptions aligned
- keep response parsing semantics aligned

If the change only lands in one surface, document why.

High-value follow-up work:

- extract shared provider request helpers
- standardize provider error messages
- add parity tests that compare request construction across surfaces
