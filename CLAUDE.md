# CLAUDE.md — Project Context for AI Agents

> This file gives Claude (and any AI assistant) the context needed to work effectively on the web-new codebase. Read this first before making any changes.

## What Is This Project?

**web-new** is Lemonade's frontend — a Next.js event platform with Web3 integration, multi-tenant (whitelabel) support, and community features. Users create events, manage communities, mint NFT passports, create Lemonhead avatars, send red envelopes, and connect via Farcaster/Lens Protocol.

- **Current version:** 10.7.0
- **Repo:** github.com/lemonadesocial/web-new
- **Team context:** Built by two junior devs. Treat the codebase with respect (it ships and works) but expect patterns that need senior-level refinement.

## Tech Stack Quick Reference

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15.4.10 |
| UI Library | React | 19.0.0 |
| Language | TypeScript (strict) | 5.x |
| Styling | Tailwind CSS | 4.0.8 |
| Animation | Framer Motion | 12.4.10 |
| Global State | Jotai | 2.12.1 |
| Server State | React Query | 5.81.2 |
| Forms | React Hook Form + Zod/Yup | 7.54.2 / 3.25.67 |
| API (type-safe) | tRPC | 11.4.2 |
| API (external) | GraphQL (graphql-request) | 7.1.2 |
| Web3 | Wagmi + Viem + Ethers.js | 2.14.15 / 2.23.9 / 6.13.5 |
| Web3 SDK | Thirdweb + ConnectKit | 5.108.13 / 1.8.2 |
| Auth | Ory (Kratos + Hydra) + OIDC | 1.19.0 |
| Social | Farcaster + Lens Protocol | 0.8.1 / canary |
| Payments | Stripe | 3.6.0 |
| Database | MongoDB (direct driver) | 6.15.0 |
| Testing | Vitest + Testing Library | 3.0.6 / 16.2.0 |
| E2E Testing | Playwright | 1.50.1 |
| Monitoring | Sentry | integrated |
| Package Manager | Yarn | 1.22.22 |
| Node.js | 22 | 22.12.0 |

## Project Structure

```
web-new/
├── app/                          # Next.js App Router
│   ├── [domain]/                 # Multi-tenant: routes by hostname
│   │   ├── (blank)/              # Minimal layout (red envelopes, spaces)
│   │   └── (default)/            # Main layout (events, profile, settings)
│   │       ├── agent/            # AI agent management
│   │       ├── events/           # Event pages
│   │       ├── lemonheads/       # Avatar creation
│   │       ├── coin/             # Token features
│   │       ├── profile/          # User profiles
│   │       ├── settings/         # App settings
│   │       ├── timelines/        # Activity feeds
│   │       └── explore/          # Discovery
│   ├── api/                      # API routes
│   │   ├── trpc/[trpc]/          # tRPC endpoint
│   │   ├── og/                   # Open Graph image generation
│   │   ├── passport/             # NFT passport endpoints
│   │   ├── lemonhead/            # Avatar endpoints
│   │   └── oauth2/               # OAuth callback
│   └── styles/
│       ├── components/           # Component CSS (button, input, etc.)
│       ├── presets/              # Visual presets (pattern, minimal, shader)
│       └── themes/               # dark.css, light.css, lemonheads.css
│
├── lib/                          # Shared library code
│   ├── components/
│   │   ├── core/                 # 31 base UI components (Card, Input, Button, etc.)
│   │   ├── ui/                   # Higher-level UI components
│   │   └── features/             # 35+ feature modules
│   │       ├── auth/             # Authentication flows
│   │       ├── event/            # Event management
│   │       ├── community/        # Community/space features
│   │       ├── lemonhead/        # Avatar builder
│   │       ├── passport/         # NFT passports
│   │       ├── red-envelope/     # Red envelope (CNY) features
│   │       ├── lens-feed/        # Lens Protocol feed
│   │       └── ...
│   ├── services/                 # Business logic (14 service modules)
│   ├── hooks/                    # 36 custom React hooks
│   ├── utils/                    # 37 utility files
│   ├── trpc/                     # tRPC router definitions
│   ├── graphql/
│   │   ├── gql/                  # GraphQL query files
│   │   ├── request/              # GraphQL client setup
│   │   └── generated/            # Codegen output (DO NOT EDIT)
│   ├── jotai/                    # Global state atoms
│   ├── abis/                     # Smart contract ABIs
│   └── icons/                    # 262 SVG icons
│
├── __tests__/                    # Vitest unit tests
├── e2e/                          # Playwright E2E tests
├── data/                         # Static data files
├── public/                       # Static assets
└── .github/workflows/            # CI/CD (lint, test, deploy)
```

## Path Aliases

Always use these aliases in imports — never use relative paths like `../../`:

```
$app/*      → ./app/*
$lib/*      → ./lib/*
$core/*     → ./lib/components/core/*
$ui/*       → ./lib/components/ui/*
$utils/*    → ./lib/utils/*
$request/*  → ./lib/graphql/request/*
```

## Code Conventions

### Component Patterns

**Compound components** for core UI:
```tsx
// lib/components/core/card/card.tsx
export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Content: CardContent,
};
// Usage: <Card.Root><Card.Header>Title</Card.Header></Card.Root>
```

**Feature components** are `"use client"` and combine hooks, queries, and UI:
```tsx
'use client';
import { useMe } from '$lib/hooks/useMe';
// Feature-specific logic + rendering
```

**Server Components** are the default — only add `"use client"` when you need interactivity, state, or effects. Push the boundary as far down the tree as possible.

### Styling

- **Tailwind CSS v4** is the primary approach
- Compose classes with `clsx()` + `tailwind-merge` (`twMerge`)
- Use CSS variables for theme-aware colors: `--color-accent-500`, `--color-success-500`, etc.
- Themes are applied via `data-theme` attribute on the HTML element
- Three themes: `dark`, `light`, `lemonheads`
- Icons use a custom Tailwind plugin: `<i className="icon-[name]" />`

### State Management

| What | Where |
|------|-------|
| Global app state (user, session, theme) | Jotai atoms (`$lib/jotai/`) |
| Server/async data | React Query via tRPC or GraphQL |
| Form state | React Hook Form |
| Wallet/chain state | Wagmi hooks |
| Local component state | `useState` / `useReducer` |

**Rule of thumb:** If data comes from an API, use React Query. If it's shared UI state, use Jotai. If it's local to one component, use `useState`.

### API Patterns

**tRPC** (type-safe, for internal APIs):
```tsx
// Define: lib/trpc/index.ts
publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => { ... })

// Use: in components
const { data } = trpc.event.getById.useQuery({ id })
```

**GraphQL** (for external services — 6+ schemas):
- Backend API, Wallet service, AI API, Coin indexer, Metaverse, Farcaster/Airstack
- Types are auto-generated — run `yarn codegen` after changing `.gql` files
- **Never edit files in `lib/graphql/generated/`** — they are overwritten by codegen

### Naming Conventions

- Files: `kebab-case.tsx` for components, `camelCase.ts` for utilities
- Components: `PascalCase`
- Hooks: `useCamelCase`
- Types/Interfaces: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Jotai atoms: `camelCaseAtom`

### Error Handling

- Sentry is integrated for error tracking (client + server)
- Use try/catch for async operations
- Report errors with `Sentry.captureException(error)`
- Use Next.js `error.tsx` files for route-level error boundaries

## Multi-Tenant Architecture

The app supports multiple domains via middleware rewriting:

1. **Middleware** (`middleware.ts`) reads the hostname from the request
2. For known paths (`/s/`, `/e/`, `/l/`, `/lemonheads`, etc.), it rewrites to `/{hostname}{path}`
3. For unknown hostnames, it queries GraphQL to check if it's a community space
4. If it's a space, it rewrites to `/{hostname}/community{path}`
5. The `[domain]` dynamic route segment captures the hostname

**Important:** Changes to middleware affect ALL routes. Test with multiple hostnames.

## Authentication Flow

1. **Ory Kratos** handles registration, login, password reset
2. **Ory Hydra** handles OAuth2 flows
3. Sessions are stored in cookies on the `.lemonade.social` domain
4. Web3 wallets provide an alternative auth path (sign message → verify → session)
5. Farcaster and Lens provide social login options

**Local dev:** Must use `localhost.staging.lemonade.social` as hostname (set in `/etc/hosts`).

## Key Commands

```bash
yarn dev          # Dev server (port 8000, Turbopack, experimental HTTPS)
yarn build        # Production build
yarn start        # Run production build
yarn lint         # ESLint + Next.js checks
yarn test         # Vitest unit tests
yarn coverage     # Vitest with coverage report
yarn e2e          # Playwright E2E tests
yarn codegen      # Regenerate GraphQL types
```

## Environment Variables

Copy `.env.example` to `.env` and fill in values. Key groups:

- **Auth:** `NEXT_PUBLIC_KRATOS_PUBLIC_URL`, `NEXT_PUBLIC_HYDRA_PUBLIC_URL`
- **API:** `NEXT_PUBLIC_GRAPHQL_URL`, `NEXT_PUBLIC_LMD_BE`
- **Web3:** `NEXT_PUBLIC_WALLET_HTTP_URL`, `NEXT_PUBLIC_WALLET_WSS_URL`, `NEXT_PUBLIC_REOWN_PROJECT_ID`
- **Services:** `NEXT_PUBLIC_AIRSTACK_URL`, `NEXT_PUBLIC_IPFS_GATEWAY_URL`, `NEXT_PUBLIC_GOOGLE_MAP_KEY`
- **Lens:** `NEXT_PUBLIC_LENS_APP_ID`, `NEXT_PUBLIC_LENS_NAMESPACE`, `NEXT_PUBLIC_LEMONADE_FEED_ADDRESS`
- **Private:** `DATABASE_URL`, `NOCODB_ACCESS_KEY` (server-only, never prefix with NEXT_PUBLIC_)

## What NOT to Do

- **Don't edit `lib/graphql/generated/`** — run `yarn codegen` instead
- **Don't use relative imports** — use path aliases (`$lib/`, `$core/`, etc.)
- **Don't add `"use client"` without reason** — default to Server Components
- **Don't use `any` type** — TypeScript strict mode is on for a reason
- **Don't install new deps without checking for overlap** — the project already has 118 dependencies
- **Don't hardcode env values** — use `process.env.NEXT_PUBLIC_*` or server-only env vars
- **Don't modify middleware casually** — it affects every route in the app
- **Don't commit `.env` files** — only `.env.example` is tracked

## Known Codebase Context

- **ESLint has some rules disabled:** `no-img-element`, `alt-text`, `exhaustive-deps`, `no-explicit-any` — these represent known tech debt
- **TypeScript `ignoreBuildErrors: true`** in next.config.ts — the build bypasses TS errors
- **Both Zod and Yup** are used for validation — historical inconsistency, should consolidate
- **`button.css` has a WIP comment** — button styling is incomplete
- **E2E tests are mostly placeholder** — Playwright is configured but tests need writing
- **25+ TODO/FIXME comments** in the codebase — see TODO.md for the full list
