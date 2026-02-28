#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const currentFilePath = decodeURIComponent(new URL(import.meta.url).pathname);
const root = path.resolve(path.dirname(currentFilePath), '..', '..');
const strict = process.argv.includes('--strict');

const results = [];

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

function push(status, area, id, detail) {
  results.push({ status, area, id, detail });
}

function pass(area, id, detail) {
  push('PASS', area, id, detail);
}

function fail(area, id, detail) {
  push('FAIL', area, id, detail);
}

function warn(area, id, detail) {
  push('WARN', area, id, detail);
}

function extractOperationVariables(gqlText) {
  const map = new Map();
  const opRegex = /(query|mutation)\s+(\w+)\s*(\(([^)]*)\))?/g;
  let m;
  while ((m = opRegex.exec(gqlText)) !== null) {
    const opName = m[2];
    const varBlock = m[4] || '';
    const vars = [];
    const varRegex = /\$([A-Za-z_][A-Za-z0-9_]*)\s*:/g;
    let vm;
    while ((vm = varRegex.exec(varBlock)) !== null) vars.push(vm[1]);
    map.set(opName, vars);
  }
  return map;
}

function findMatchingBrace(text, openIndex) {
  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let i = openIndex; i < text.length; i += 1) {
    const ch = text[i];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if (ch === '"' || ch === '\'' || ch === '`') {
      quote = ch;
      continue;
    }

    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }

  return -1;
}

function extractTopLevelKeys(objectText) {
  const keys = new Set();
  let depth = 0;
  let quote = null;
  let escaped = false;
  let i = 0;

  while (i < objectText.length) {
    const ch = objectText[i];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === quote) {
        quote = null;
      }
      i += 1;
      continue;
    }

    if (ch === '"' || ch === '\'' || ch === '`') {
      quote = ch;
      i += 1;
      continue;
    }

    if (ch === '{' || ch === '[' || ch === '(') {
      depth += 1;
      i += 1;
      continue;
    }

    if (ch === '}' || ch === ']' || ch === ')') {
      depth -= 1;
      i += 1;
      continue;
    }

    if (depth === 1) {
      const idMatch = objectText.slice(i).match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:/);
      if (idMatch) {
        keys.add(idMatch[1]);
        i += idMatch[0].length;
        continue;
      }

      const quotedMatch = objectText.slice(i).match(/^['"]([A-Za-z_][A-Za-z0-9_]*)['"]\s*:/);
      if (quotedMatch) {
        keys.add(quotedMatch[1]);
        i += quotedMatch[0].length;
        continue;
      }
    }

    i += 1;
  }

  return keys;
}

function findVariablesKeySets(fileText, anchor) {
  const sets = [];
  let start = 0;

  while (true) {
    const idx = fileText.indexOf(anchor, start);
    if (idx === -1) break;

    const varsIdx = fileText.indexOf('variables', idx);
    if (varsIdx === -1) break;

    const braceStart = fileText.indexOf('{', varsIdx);
    if (braceStart === -1) break;

    const braceEnd = findMatchingBrace(fileText, braceStart);
    if (braceEnd === -1) break;

    const objText = fileText.slice(braceStart, braceEnd + 1);
    sets.push(extractTopLevelKeys(objText));

    start = braceEnd + 1;
  }

  return sets;
}

function checkVariableConformance(opVarsMap) {
  const checks = [
    {
      id: 'PB-OP-001',
      file: 'lib/components/features/page-builder/utils.ts',
      operation: 'GetPageConfig',
      anchor: 'query: GetPageConfigDocument',
      expectedKeys: ['id'],
      minMatches: 1,
    },
    {
      id: 'PB-OP-002',
      file: 'lib/components/features/page-builder/utils.ts',
      operation: 'CreatePageConfig',
      anchor: 'query: CreatePageConfigDocument',
      expectedKeys: ['input'],
      minMatches: 1,
    },
    {
      id: 'PB-OP-003',
      file: 'lib/components/features/page-builder/Editor.tsx',
      operation: 'UpdatePageConfig',
      anchor: 'updateConfig({',
      expectedKeys: ['id', 'input'],
      minMatches: 3,
    },
    {
      id: 'PB-OP-004',
      file: 'lib/components/features/page-builder/Editor.tsx',
      operation: 'PublishPageConfig',
      anchor: 'publishConfig({',
      expectedKeys: ['id'],
      minMatches: 1,
    },
    {
      id: 'PB-OP-005',
      file: 'lib/components/features/page-builder/panels/VersionHistoryPanel.tsx',
      operation: 'ListConfigVersions',
      anchor: 'useQuery(',
      expectedKeys: ['config_id'],
      minMatches: 1,
    },
    {
      id: 'PB-OP-006',
      file: 'lib/components/features/page-builder/panels/VersionHistoryPanel.tsx',
      operation: 'SaveConfigVersion',
      anchor: 'saveVersion({',
      expectedKeys: ['config_id', 'name'],
      minMatches: 1,
    },
    {
      id: 'PB-OP-007',
      file: 'lib/components/features/page-builder/panels/VersionHistoryPanel.tsx',
      operation: 'RestoreConfigVersion',
      anchor: 'restoreVersion({',
      expectedKeys: ['config_id', 'version'],
      minMatches: 1,
    },
    {
      id: 'PB-OP-008',
      file: 'lib/components/features/page-builder/panels/PreviewSharePanel.tsx',
      operation: 'GeneratePreviewLink',
      anchor: 'generatePreviewLink({',
      expectedKeys: ['config_id', 'options'],
      minMatches: 1,
    },
    {
      id: 'PB-OP-009',
      file: 'lib/components/features/page-builder/panels/TemplatePanel.tsx',
      operation: 'CloneTemplateToConfig',
      anchor: 'cloneTemplate({',
      expectedKeys: ['template_id', 'owner_type', 'owner_id'],
      minMatches: 1,
    },
    {
      id: 'PB-OP-010',
      file: 'lib/components/features/page-builder/panels/SaveAsTemplatePanel.tsx',
      operation: 'SaveConfigAsTemplate',
      anchor: 'saveAsTemplate({',
      expectedKeys: ['config_id', 'input'],
      minMatches: 1,
    },
    {
      id: 'PB-OP-011',
      file: 'app/[domain]/(blank)/e/[shortid]/custom/page.tsx',
      operation: 'GetPublishedConfig',
      anchor: 'query: GetPublishedConfigDocument',
      expectedKeys: ['owner_type', 'owner_id'],
      minMatches: 1,
    },
    {
      id: 'PB-OP-012',
      file: 'app/[domain]/(blank)/s/[uid]/custom/page.tsx',
      operation: 'GetPublishedConfig',
      anchor: 'query: GetPublishedConfigDocument',
      expectedKeys: ['owner_type', 'owner_id'],
      minMatches: 1,
    },
    {
      id: 'PB-OP-013',
      file: 'middleware.ts',
      operation: 'GetSpace',
      anchor: 'query: GetSpaceDocument',
      expectedKeys: ['hostname'],
      minMatches: 1,
    },
    {
      id: 'PB-OP-014',
      file: 'lib/components/features/community-manage/panes/CustomDomainPane.tsx',
      operation: 'UpdateSpace',
      anchor: 'updateSpace({',
      expectedKeys: ['id', 'input'],
      minMatches: 1,
    },
  ];

  for (const check of checks) {
    const abs = path.join(root, check.file);
    if (!fs.existsSync(abs)) {
      fail('operation-vars', check.id, `Missing file: ${check.file}`);
      continue;
    }

    const text = read(check.file);
    const keySets = findVariablesKeySets(text, check.anchor);

    if (keySets.length < check.minMatches) {
      fail(
        'operation-vars',
        check.id,
        `Found ${keySets.length} variable block(s), expected >= ${check.minMatches} (${check.file})`,
      );
      continue;
    }

    let foundValid = 0;
    for (const keys of keySets) {
      const hasAll = check.expectedKeys.every((k) => keys.has(k));
      if (hasAll) foundValid += 1;
    }

    if (foundValid < check.minMatches) {
      fail(
        'operation-vars',
        check.id,
        `Expected keys [${check.expectedKeys.join(', ')}] not found in >= ${check.minMatches} variable block(s) in ${check.file}`,
      );
      continue;
    }

    const opVars = opVarsMap.get(check.operation) || [];
    const invalid = check.expectedKeys.filter((k) => !opVars.includes(k));
    if (invalid.length > 0) {
      fail(
        'operation-vars',
        check.id,
        `Expected variable key(s) not in GraphQL schema for ${check.operation}: ${invalid.join(', ')}`,
      );
      continue;
    }

    pass(
      'operation-vars',
      check.id,
      `${check.operation} keys verified in ${check.file}: ${check.expectedKeys.join(', ')}`,
    );
  }
}

function checkWhitelabelParity() {
  const middleware = read('middleware.ts');
  const domainLayout = read('app/[domain]/layout.tsx');
  const communityPage = read('app/[domain]/(blank)/community/page.tsx');
  const customDomainPane = read('lib/components/features/community-manage/panes/CustomDomainPane.tsx');
  const advancedSettings = read('lib/components/features/community-manage/settings/SettingsCommunityAvanced.tsx');

  const checks = [
    {
      id: 'PB-DOM-001',
      ok:
        middleware.includes("req.headers.get('x-forwarded-host') || req.headers.get('host')") &&
        middleware.includes('variables: { hostname: hostname }') &&
        middleware.includes('/community'),
      detail: 'middleware host header resolution + GetSpace(hostname) + community rewrite',
    },
    {
      id: 'PB-DOM-002',
      ok:
        domainLayout.includes('getSiteData(domain)') &&
        domainLayout.includes('getSpaceHydraKeys(domain)'),
      detail: 'domain layout parity: metadata + hydra keys both use decoded domain',
    },
    {
      id: 'PB-DOM-003',
      ok:
        communityPage.includes('getSpace({ hostname: domain })') &&
        communityPage.includes('decodeURIComponent(res.domain)'),
      detail: 'community page resolves space by hostname consistently',
    },
    {
      id: 'PB-DOM-004',
      ok:
        customDomainPane.includes('const hostnames = uniq([...(space.hostnames || []), values.domain, ...subdomainsList]);') &&
        customDomainPane.includes('input: { hostnames }'),
      detail: 'custom domain pane writes canonical hostnames list',
    },
    {
      id: 'PB-DOM-005',
      ok: advancedSettings.includes("filter((hostname) => !hostname.endsWith('lemonade.social'))"),
      detail: 'advanced settings UI isolates custom domains from lemonade.social hostnames',
    },
  ];

  for (const check of checks) {
    if (check.ok) pass('domain-parity', check.id, check.detail);
    else fail('domain-parity', check.id, check.detail);
  }
}

function checkSubscriptionMatrix() {
  const sectionCatalog = read('lib/components/features/page-builder/SectionCatalog.tsx');
  const typesFile = read('lib/components/features/page-builder/types.ts');
  const templateGql = read('lib/graphql/gql/backend/template.gql');
  const templatePanel = read('lib/components/features/page-builder/panels/TemplatePanel.tsx');

  const expectedTiers = ['free', 'pro', 'plus', 'max', 'enterprise'];

  const orderBlockMatch = sectionCatalog.match(/const\s+TIER_ORDER\s*:\s*Record<SubscriptionTier,\s*number>\s*=\s*\{([\s\S]*?)\};/);
  if (!orderBlockMatch) {
    fail('subscription-matrix', 'PB-SUB-001', 'Could not find TIER_ORDER in SectionCatalog.tsx');
  } else {
    const orderBlock = orderBlockMatch[1];
    const present = new Set(Array.from(orderBlock.matchAll(/\b([a-z]+)\s*:/g)).map((m) => m[1]));
    const missing = expectedTiers.filter((t) => !present.has(t));
    if (missing.length > 0) fail('subscription-matrix', 'PB-SUB-001', `TIER_ORDER missing tiers: ${missing.join(', ')}`);
    else pass('subscription-matrix', 'PB-SUB-001', 'TIER_ORDER contains free/pro/plus/max/enterprise');
  }

  const unionMatch = typesFile.match(/export\s+type\s+SubscriptionTier\s*=\s*([^;]+);/);
  if (!unionMatch) {
    fail('subscription-matrix', 'PB-SUB-002', 'Could not find SubscriptionTier type union in types.ts');
  } else {
    const union = unionMatch[1];
    const missing = expectedTiers.filter((t) => !union.includes(`'${t}'`));
    if (missing.length > 0) fail('subscription-matrix', 'PB-SUB-002', `SubscriptionTier union missing: ${missing.join(', ')}`);
    else pass('subscription-matrix', 'PB-SUB-002', 'SubscriptionTier type union contains all expected tiers');
  }

  const requiredTiers = new Set(Array.from(sectionCatalog.matchAll(/tier_required:\s*'([a-z]+)'/g)).map((m) => m[1]));
  const invalid = Array.from(requiredTiers).filter((t) => !expectedTiers.includes(t));
  if (invalid.length > 0) {
    fail('subscription-matrix', 'PB-SUB-003', `SectionCatalog tier_required has unknown tier(s): ${invalid.join(', ')}`);
  } else {
    pass('subscription-matrix', 'PB-SUB-003', `SectionCatalog tier_required values valid: ${Array.from(requiredTiers).sort().join(', ')}`);
  }

  const tierMaxWired =
    templateGql.includes('$tier_max: String') &&
    templateGql.includes('tier_max: $tier_max') &&
    templateGql.includes('subscription_tier_min');
  if (tierMaxWired) pass('subscription-matrix', 'PB-SUB-004', 'Template GraphQL tier fields wired (tier_max + subscription_tier_min)');
  else fail('subscription-matrix', 'PB-SUB-004', 'Template GraphQL tier fields missing');

  const panelPassesTierMax = /useQuery\(\s*ListTemplatesDocument\s*,\s*\{[\s\S]*?tier_max\s*:/.test(templatePanel);
  if (panelPassesTierMax) {
    pass('subscription-matrix', 'PB-SUB-005', 'TemplatePanel passes tier_max when listing templates');
  } else {
    const msg = 'TemplatePanel does not pass tier_max to ListTemplatesDocument (gating currently UI-only).';
    if (strict) fail('subscription-matrix', 'PB-SUB-005', msg);
    else warn('subscription-matrix', 'PB-SUB-005', msg);
  }
}

function run() {
  const pageConfigOps = extractOperationVariables(read('lib/graphql/gql/backend/page-config.gql'));
  const templateOps = extractOperationVariables(read('lib/graphql/gql/backend/template.gql'));
  const spaceOps = extractOperationVariables(read('lib/graphql/gql/backend/space.gql'));

  const opVarsMap = new Map([...pageConfigOps, ...templateOps, ...spaceOps]);

  checkVariableConformance(opVarsMap);
  checkWhitelabelParity();
  checkSubscriptionMatrix();

  const ordered = { FAIL: [], WARN: [], PASS: [] };
  for (const r of results) ordered[r.status].push(r);

  console.log(`Page Builder Hardening Checks (${strict ? 'STRICT' : 'STANDARD'})`);
  console.log('');
  for (const status of ['FAIL', 'WARN', 'PASS']) {
    for (const row of ordered[status]) {
      console.log(`[${row.status}] [${row.area}] ${row.id} - ${row.detail}`);
    }
  }

  console.log('');
  console.log(`Summary: ${ordered.FAIL.length} fail, ${ordered.WARN.length} warn, ${ordered.PASS.length} pass`);

  if (ordered.FAIL.length > 0) process.exit(1);
}

run();
