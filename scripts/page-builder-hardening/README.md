# Page Builder Hardening Checks

Lightweight pre-launch checks for:

1. Backend schema to frontend operation variable-name conformance.
2. Whitelabel/custom-domain parity seams.
3. Subscription gating matrix consistency (`free/pro/plus/max/enterprise`).

## Commands

- Standard mode (non-blocking advisory warnings allowed):
  - `yarn hardening:page-builder`
- Strict mode (advisories become blocking):
  - `yarn hardening:page-builder:strict`

## What is validated

- `PB-OP-*`: operation variable key conformance in critical Page Builder and domain-routing callsites.
- `PB-DOM-*`: domain/hostname and custom-domain parity checks across middleware + app + community settings.
- `PB-SUB-*`: tier map and template tier filtering wiring checks.

## Exit behavior

- Always fails on `FAIL` checks.
- Standard mode permits `WARN` checks.
- Strict mode converts selected `WARN` checks into `FAIL`.
