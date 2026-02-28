# Page Builder Hardening Checks

Two complementary check suites:

## 1. FE-only checks (`checks.mjs`)

Lightweight pre-launch checks for:

1. Backend schema to frontend operation variable-name conformance.
2. Whitelabel/custom-domain parity seams.
3. Subscription gating matrix consistency (`free/pro/plus/max/enterprise`).

### Commands

- Standard mode: `yarn hardening:page-builder`
- Strict mode: `yarn hardening:page-builder:strict`

### Check IDs

- `PB-OP-*`: operation variable key conformance in critical Page Builder and domain-routing callsites.
- `PB-DOM-*`: domain/hostname and custom-domain parity checks across middleware + app + community settings.
- `PB-SUB-*`: tier map and template tier filtering wiring checks.

## 2. Cross-repo contract gate (`contract-gate.mjs`)

Machine-runnable BE↔FE contract checker. Parses the BE generated schema and FE .gql files to detect drift.

### Commands

```bash
# Default (expects ../lemonade-backend relative to web-new root)
node scripts/page-builder-hardening/contract-gate.mjs

# Explicit BE path
node scripts/page-builder-hardening/contract-gate.mjs --be-path /path/to/lemonade-backend
```

### What is validated (137 checks across 36 operations)

- `CTR-EX-*`: Operation existence — FE operation ↔ BE resolver parity.
- `CTR-VA-*`: Variable ↔ argument alignment — catches snake_case/camelCase drift and name mismatches.
- `CTR-RF-*`: Required field presence — FE supplies all required BE args.
- `CTR-FC-*`: Fragment coverage — FE fragments only request fields that exist in BE schema.
- `CTR-IT-*`: Input type alignment — required/optional field contracts match.
- `CTR-CC-*`: Case consistency — all args/vars use snake_case.
- `CTR-TS-*`: Subscription tier seam — tier gating fields wired end-to-end.
- `CTR-DS-*`: Custom domain seam — hostnames field and owner_type abstraction.
- `CTR-SE-*`: Section type enum parity — 37 section types match between BE and FE.

### Categories covered

| Category    | Operations |
|-------------|-----------|
| page-config | 6         |
| versioning  | 3         |
| locking     | 3         |
| preview     | 2         |
| catalog     | 1         |
| templates   | 13        |
| ai          | 4         |
| assets      | 4         |

## Exit behavior

- Both scripts exit with code 1 on any `FAIL` check — suitable for CI gates.
- Standard mode permits `WARN` checks.
- Strict mode converts selected `WARN` checks into `FAIL`.
