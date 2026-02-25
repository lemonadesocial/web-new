<a href="https://lemonade.social">
  <h1 align="center">Lemonade — Event Platform</h1>
</a>

<p align="center">
  A whitelabel event platform with Web3 integration, community features, and multi-tenant support.<br/>
  Built with Next.js 15, React 19, TypeScript, and Tailwind CSS.
</p>

<p align="center">
  <a href="#getting-started"><strong>Getting Started</strong></a> ·
  <a href="#architecture"><strong>Architecture</strong></a> ·
  <a href="#development"><strong>Development</strong></a> ·
  <a href="#testing"><strong>Testing</strong></a> ·
  <a href="#deployment"><strong>Deployment</strong></a>
</p>

---

## Overview

**web-new** is Lemonade's frontend application — an event platform where users create and manage events, build communities, mint NFT passports, create avatar identities (Lemonheads), interact with token economics, and connect via decentralized social protocols (Farcaster, Lens).

The platform supports multi-tenant whitelabel deployments where each community can have its own domain, branding, and theme.

### Key Features

- **Event Management** — Create, manage, and promote events with ticketing, guest lists, and check-in
- **Communities (Spaces)** — Community pages with custom domains, branding, and member management
- **Lemonheads** — Customizable NFT avatar system with trait-based composition
- **Passports** — NFT-based event passes and identity verification
- **Red Envelopes** — Crypto-powered digital red envelopes (Chinese New Year feature)
- **Token/Coin** — Token launchpad and trading features
- **AI Agents** — Community-managed AI agent integration
- **Social Integration** — Farcaster frames, Lens Protocol feeds, wallet-based identity

## Getting Started

### Prerequisites

- **Node.js 22** (see `.nvmrc` or Dockerfile)
- **Yarn 1.22+** (package manager)
- **Git**

### 1. Clone and Install

```bash
git clone https://github.com/lemonadesocial/web-new.git
cd web-new
yarn install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Fill in the required environment variables. See `.env.example` for the full list. Key categories:

| Category | Variables | Description |
|----------|----------|-------------|
| Auth | `NEXT_PUBLIC_KRATOS_PUBLIC_URL`, `NEXT_PUBLIC_HYDRA_PUBLIC_URL` | Ory identity management endpoints |
| API | `NEXT_PUBLIC_GRAPHQL_URL`, `NEXT_PUBLIC_LMD_BE` | Backend API endpoints |
| Web3 | `NEXT_PUBLIC_WALLET_HTTP_URL`, `NEXT_PUBLIC_WALLET_WSS_URL` | Wallet service endpoints |
| Services | `NEXT_PUBLIC_GOOGLE_MAP_KEY`, `NEXT_PUBLIC_GIPHY_API_KEY` | Third-party service keys |
| Lens | `NEXT_PUBLIC_LENS_APP_ID`, `NEXT_PUBLIC_LENS_NAMESPACE` | Lens Protocol configuration |
| Database | `DATABASE_URL` | MongoDB connection string (server-only) |

### 3. Configure Local Hostname

Authentication cookies require a specific hostname. Add to your `/etc/hosts`:

```
127.0.0.1    localhost.staging.lemonade.social
```

### 4. Identity Management (Optional)

For local auth, either:
- Run [lemonade-identity](https://github.com/lemonadesocial/lemonade-identity) locally (follow its README)
- Or remove `NEXT_PUBLIC_IDENTITY_URL` from `.env` to use the staging identity service

### 5. Start Development Server

```bash
yarn dev
```

Opens at `https://localhost.staging.lemonade.social:8000` with Turbopack (fast refresh) and experimental HTTPS.

## Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Language | TypeScript 5 (strict mode) |
| State | Jotai (global) + React Query (server) |
| API | tRPC (internal) + GraphQL (external, 6+ schemas) |
| Web3 | Wagmi + Viem + Ethers.js + Thirdweb |
| Auth | Ory (Kratos/Hydra) + Wallet signatures + OIDC |
| Payments | Stripe |
| Database | MongoDB |
| Testing | Vitest + Playwright |
| Monitoring | Sentry |

### Directory Structure

```
app/                    Next.js App Router pages and layouts
  [domain]/             Multi-tenant routing (hostname-based)
  api/                  API routes (tRPC, OAuth, OG images, etc.)
  styles/               Themes and component CSS

lib/                    Shared library code
  components/
    core/               31 base UI components (atomic design)
    features/           35+ feature-specific component modules
    ui/                 Higher-level composed components
    layouts/            Page layouts and navigation
  services/             14 business logic service modules
  hooks/                36 custom React hooks
  utils/                37 utility modules
  trpc/                 tRPC router and procedures
  graphql/              GraphQL clients, queries, generated types
  jotai/                Global state atoms
  abis/                 Smart contract ABIs
  icons/                262 SVG icons

__tests__/              Unit tests (Vitest)
e2e/                    E2E tests (Playwright)
.github/workflows/      CI/CD pipelines
```

### Multi-Tenant Routing

The app supports multiple domains through Next.js middleware:

1. Middleware reads the hostname from the request
2. Known paths (`/s/`, `/e/`, `/lemonheads`, etc.) rewrite to `/{hostname}{path}`
3. Unknown hostnames query GraphQL to check if it's a registered community
4. Community hostnames rewrite to `/{hostname}/community{path}`
5. The `[domain]` dynamic segment captures the resolved hostname

### Path Aliases

```
$app/*      → ./app/*
$lib/*      → ./lib/*
$core/*     → ./lib/components/core/*
$ui/*       → ./lib/components/ui/*
$utils/*    → ./lib/utils/*
$request/*  → ./lib/graphql/request/*
```

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start dev server (port 8000, Turbopack, HTTPS) |
| `yarn build` | Production build |
| `yarn start` | Run production build |
| `yarn lint` | ESLint checks |
| `yarn test` | Run unit tests |
| `yarn coverage` | Unit tests with coverage report |
| `yarn e2e` | Run Playwright E2E tests |
| `yarn codegen` | Regenerate GraphQL types from schemas |

### Code Style

- **Formatting:** Prettier (single quotes, 120 char width, semicolons, 2-space tabs)
- **Linting:** ESLint with Next.js core-web-vitals and TypeScript rules
- **Pre-commit:** Husky + lint-staged runs Prettier and ESLint on staged files

### GraphQL Workflow

When modifying GraphQL queries:

1. Edit `.gql` files in `lib/graphql/gql/`
2. Run `yarn codegen` to regenerate types
3. Never edit files in `lib/graphql/generated/` directly

### Theming

Three themes available: `dark`, `light`, `lemonheads`. Applied via `data-theme` attribute on the root HTML element. CSS variables define the color system.

## Testing

### Unit Tests (Vitest)

```bash
yarn test              # Run all tests
yarn coverage          # Run with coverage report
```

Tests live in `__tests__/` and use `@testing-library/react` with `jsdom`.

### E2E Tests (Playwright)

```bash
yarn e2e               # Run all E2E tests
npx playwright test --ui  # Interactive test runner
```

Configured for Chromium, Firefox, and WebKit. Tests live in `e2e/`.

## Deployment

### Docker

The project uses a multi-stage Docker build:

```bash
docker build -t web-new .
docker run -p 3000:3000 web-new
```

Stages: dependency install, build (with Sentry source maps), nginx for static assets, and the standalone Next.js server.

### CI/CD

GitHub Actions workflows handle:
- **Lint** — Runs on PRs
- **Playwright** — E2E tests on push to main
- **Deploy to Staging** — Docker build + Kubernetes deploy
- **Deploy to Production** — Triggered by release publish
- **Release Please** — Automated semantic versioning and changelog

### Versioning

Semantic versioning via [release-please](https://github.com/google-github-app/release-please). Versions are managed automatically from conventional commit messages. See `CHANGELOG.md` for release history.

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [React](https://react.dev/)
- [Wagmi (Web3)](https://wagmi.sh/)
- [tRPC](https://trpc.io/)
- [Jotai](https://jotai.org/)
- [Ory (Auth)](https://www.ory.sh/docs/)
- [Framer Motion](https://www.framer.com/motion/)

## AI Agent Support

This project includes a `CLAUDE.md` file with detailed project context for AI-assisted development. See also `TODO.md` for known issues and improvement opportunities.
