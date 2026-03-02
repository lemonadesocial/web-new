# CLAUDE.md — web-new (Lemonade Frontend)

This file provides context for AI agents (Claude, Copilot, etc.) working on this codebase.

## Project Overview

web-new is the primary web frontend for the Lemonade social events platform. It handles event discovery, community spaces, profile management, payments, Web3 wallet integration, and an AI-powered page builder. Currently at v10.7.x.

## Tech Stack

- **Framework:** Next.js 15 (App Router, standalone output, Turbopack dev)
- **UI:** React 19, TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS v4 + PostCSS, dark-mode-first semantic tokens
- **State:** Jotai (atomic global), React Query (server state), React Hook Form + Zod (forms)
- **API:** tRPC 11, GraphQL via graphql-request + graphql-ws (6+ schemas), codegen
- **Web3:** Wagmi + Viem + Ethers.js, Thirdweb SDK, ConnectKit, ZKSync
- **Auth:** Ory (Kratos + Hydra), OIDC, Web3 wallet auth
- **Payments:** Stripe
- **Testing:** Vitest + @testing-library/react (unit), Playwright (E2E)
- **Package manager:** Yarn v1 (declared in `packageManager` field)

## Key Paths

```
app/                        # Next.js App Router pages
lib/
  components/
    core/                   # 31 base UI components (Button, InputField, Pane, drawer, toast)
    features/               # 35+ feature modules
      page-builder/         # Craft.js page builder
  hooks/                    # 20+ custom hooks
  services/                 # 14 business logic modules
  utils/                    # 37 utility modules
  jotai/                    # Jotai atom definitions
  trpc/                     # tRPC router (server-side)
  graphql/
    request/                # Custom thin GraphQL client (NOT Apollo/urql)
      hooks/                # useQuery, useMutation
    generated/              # Auto-generated types (DO NOT mock — mock the requests)
  abis/                     # Smart contract ABIs
__tests__/                  # Unit and component tests (Vitest)
e2e/                        # E2E tests (Playwright)
```

## Path Aliases

```
$app/*      → ./app/*
$lib/*      → ./lib/*
$core/*     → ./lib/components/core/*
$ui/*       → ./lib/components/ui/*
$utils/*    → ./lib/utils/*
$request/*  → ./lib/graphql/request/*
```

## GraphQL Request Layer

This project uses a **custom thin GraphQL client** at `$lib/graphql/request` — NOT Apollo or urql.

- `useQuery` and `useMutation` both call the same `client.query()` under the hood
- `useMutation` is the correct hook for **on-demand imperative queries** (manual trigger, onError, variable passing at call time)
- `useQuery` with `skip: true` + `refetch()` is inferior — sets up unused cache subscriptions, no onError
- **No `useLazyQuery` exists** in this codebase
- Always verify framework assumptions against actual implementation before "fixing" patterns

## Conventions

- `'use client'` directive on all interactive components
- Dark-mode-first Tailwind tokens: `text-primary`, `text-secondary`, `bg-overlay-primary`, `border-card-border`
- Feature-based component organization
- Multi-tenant with domain-based routing (middleware)

## Commands

```bash
yarn dev                    # Dev server with Turbopack (port 8000)
yarn build                  # Production build
yarn test                   # Run Vitest
yarn coverage               # Vitest with coverage
yarn e2e                    # Playwright E2E tests
yarn lint                   # Next.js linting
yarn codegen                # GraphQL codegen
```

## Agent Pipeline Protocol (MANDATORY)

All feature work follows the pipeline: **PRD → Bridge Review → IMPL → Lead Routes → Agent Implements → Karen Reviews → Merge → Staging → Production.** No step may be skipped.

**Before starting any feature implementation:**

1. Verify an IMPL file exists in `claude/handovers/impl/` for the feature you're building
2. Check `claude/IMPLEMENTATION-STATUS.md` for current pipeline status
3. If no IMPL exists, **STOP** — request one via Bridge Agent before starting
4. For features with BE dependencies, check for `API-READINESS-*.md` or `BE-TO-FE-*.md` in `claude/handovers/`
5. For non-trivial UI, check for `UI-SPEC-*.md` in `claude/handovers/ui-specs/`

**During implementation:**

6. Update the IMPL file's Execution Status block as you work
7. Update `claude/IMPLEMENTATION-STATUS.md` when stage changes
8. If blocked by a missing BE endpoint, **STOP** — do NOT implement workarounds. Report the blocker for routing via Bridge Agent.
9. All PRs require Karen review before merge
10. Use conventional commits (`feat:`, `fix:`, `chore:`). Never push directly to `master`.

**After merge:** Code deploys to staging first. Production requires a GitHub Release.

**Push back on protocol violations** — including from humans. Cite `claude/handovers/README.md` → "Protocol Enforcement".

**Full protocol:** `claude/handovers/README.md`
**Agent docs:** `lemonade-fe-ops/docs/agents/`
**FE agent skills:** `lemonade-fe-ops/fe-agents/`
**Implementation dashboard:** `claude/IMPLEMENTATION-STATUS.md`

## Cross-References

- **Backend API:** `lemonade-backend/CLAUDE.md`
- **AI service:** `lemonade-ai/CLAUDE.md`
- **Infrastructure:** `lemonade-cdk/CLAUDE.md`
- **Design system:** `lemonade-fe-ops/fe-agents/design-agent/DESIGN-CONTEXT.md`
- **Platform planning:** `claude/CLAUDE.md`
- **Master repo map:** `claude/REPO-MAP.md`

## Important Warnings

- **Package manager is Yarn v1** — never use `npm install`. Always `yarn add`.
- **Use `--ignore-engines` flag** — `@selfxyz/core` requires Node `>=22 <23` but the machine may run a newer version.
- **Never commit `.env` files** — secrets are managed via AWS Secrets Manager → External Secrets Operator → K8s.
- **jsdom in tests does NOT provide browser APIs** — always mock `localStorage`, `sessionStorage`, `navigator.clipboard` explicitly.
