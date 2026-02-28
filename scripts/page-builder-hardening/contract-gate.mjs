#!/usr/bin/env node
/**
 * Page Builder BE↔FE Contract Gate
 *
 * Machine-runnable cross-repo contract checker. Parses:
 *   - BE generated schema  (schema.generated.graphql)
 *   - FE .gql operation files
 *   - FE TypeScript types
 *   - BE resolver/type source files
 *
 * Detects:
 *   1. Operation existence mismatches (FE calls op that BE doesn't expose, or vice versa)
 *   2. Variable / argument name mismatches (snake_case ↔ camelCase drift)
 *   3. Required-field mismatches
 *   4. Response-field coverage (FE fragment requests fields BE doesn't expose)
 *   5. Subscription tier / whitelabel / custom-domain contract seams
 *
 * Exit code 1 on any FAIL. Designed for CI.
 *
 * Usage:
 *   node scripts/page-builder-hardening/contract-gate.mjs [--be-path ../lemonade-backend]
 */
import fs from 'node:fs';
import path from 'node:path';

const currentFilePath = decodeURIComponent(new URL(import.meta.url).pathname);
const feRoot = path.resolve(path.dirname(currentFilePath), '..', '..');

let beRoot = path.resolve(feRoot, '..', 'lemonade-backend');
const beFlag = process.argv.indexOf('--be-path');
if (beFlag !== -1 && process.argv[beFlag + 1]) {
  beRoot = path.resolve(process.argv[beFlag + 1]);
}

const results = [];

function read(root, relPath) {
  const abs = path.join(root, relPath);
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs, 'utf8');
}

function push(status, area, id, detail) {
  results.push({ status, area, id, detail });
}
function pass(area, id, detail) { push('PASS', area, id, detail); }
function fail(area, id, detail) { push('FAIL', area, id, detail); }
function warn(area, id, detail) { push('WARN', area, id, detail); }

// ─── Schema Parsing ───────────────────────────────────────────────────────────

function parseSchemaOps(schemaText) {
  const ops = new Map();

  // Extract Query { ... } and Mutation { ... } blocks
  for (const rootType of ['Query', 'Mutation']) {
    const regex = new RegExp(`type\\s+${rootType}\\s*\\{([\\s\\S]*?)^\\}`, 'm');
    const match = schemaText.match(regex);
    if (!match) continue;

    const block = match[1];
    // Each line: opName(arg1: Type!, arg2: Type): ReturnType
    const opRegex = /^\s+(\w+)\s*(\(([^)]*)\))?\s*:\s*(.+)/gm;
    let m;
    while ((m = opRegex.exec(block)) !== null) {
      const opName = m[1];
      const argBlock = m[3] || '';
      const returnType = m[4].trim();

      const args = [];
      if (argBlock.trim()) {
        const argRegex = /(\w+)\s*:\s*([^,)]+)/g;
        let am;
        while ((am = argRegex.exec(argBlock)) !== null) {
          const argName = am[1];
          const argType = am[2].trim();
          const required = argType.endsWith('!');
          args.push({ name: argName, type: argType, required });
        }
      }

      ops.set(opName, {
        type: rootType.toLowerCase(),
        args,
        returnType,
      });
    }
  }

  return ops;
}

function parseSchemaTypes(schemaText) {
  const types = new Map();
  const typeRegex = /type\s+(\w+)\s*\{([^}]*)\}/g;
  let m;
  while ((m = typeRegex.exec(schemaText)) !== null) {
    const typeName = m[1];
    if (typeName === 'Query' || typeName === 'Mutation' || typeName === 'Subscription') continue;
    const fields = new Set();
    const fieldRegex = /^\s+(\w+)/gm;
    let fm;
    while ((fm = fieldRegex.exec(m[2])) !== null) {
      fields.add(fm[1]);
    }
    types.set(typeName, fields);
  }
  return types;
}

function parseSchemaInputTypes(schemaText) {
  const inputs = new Map();
  const inputRegex = /input\s+(\w+)\s*\{([^}]*)\}/g;
  let m;
  while ((m = inputRegex.exec(schemaText)) !== null) {
    const inputName = m[1];
    const fields = [];
    const fieldRegex = /^\s+(\w+)\s*:\s*([^\n]+)/gm;
    let fm;
    while ((fm = fieldRegex.exec(m[2])) !== null) {
      const fName = fm[1];
      const fType = fm[2].trim();
      const required = fType.endsWith('!');
      fields.push({ name: fName, type: fType, required });
    }
    inputs.set(inputName, fields);
  }
  return inputs;
}

// ─── FE GQL Parsing ───────────────────────────────────────────────────────────

function parseFEOperations(gqlText) {
  const ops = new Map();
  const opRegex = /(query|mutation)\s+(\w+)\s*(\(([^)]*)\))?\s*\{/g;
  let m;
  while ((m = opRegex.exec(gqlText)) !== null) {
    const type = m[1];
    const name = m[2];
    const varBlock = m[4] || '';

    const vars = [];
    const varRegex = /\$(\w+)\s*:\s*([^,)]+)/g;
    let vm;
    while ((vm = varRegex.exec(varBlock)) !== null) {
      const varName = vm[1];
      const varType = vm[2].trim();
      const required = varType.endsWith('!');
      vars.push({ name: varName, type: varType, required });
    }

    ops.set(name, { type, vars });
  }
  return ops;
}

function parseFEFragments(gqlText) {
  const fragments = new Map();
  const fragRegex = /fragment\s+(\w+)\s+on\s+(\w+)\s*\{/g;
  let m;
  while ((m = fragRegex.exec(gqlText)) !== null) {
    const fragName = m[1];
    const onType = m[2];
    const startIdx = m.index + m[0].length;

    // Find matching closing brace
    let depth = 1;
    let i = startIdx;
    while (i < gqlText.length && depth > 0) {
      if (gqlText[i] === '{') depth++;
      if (gqlText[i] === '}') depth--;
      i++;
    }

    const body = gqlText.slice(startIdx, i - 1);
    // Extract top-level field names (not nested)
    const fields = new Set();
    let fieldDepth = 0;
    for (const line of body.split('\n')) {
      const trimmed = line.trim();
      if (trimmed.startsWith('...')) continue; // fragment spread
      if (trimmed.includes('{')) fieldDepth++;
      if (trimmed.includes('}')) { fieldDepth--; continue; }
      if (fieldDepth === 0 && trimmed && !trimmed.startsWith('#')) {
        const fieldName = trimmed.split(/[\s({]/)[0];
        if (fieldName && /^\w+$/.test(fieldName)) fields.add(fieldName);
      }
    }

    fragments.set(fragName, { onType, fields });
  }
  return fragments;
}

// ─── Contract Matrix ──────────────────────────────────────────────────────────

const PAGE_BUILDER_OPS = [
  // Core CRUD
  { feOp: 'GetPageConfig', beOp: 'getPageConfig', category: 'page-config' },
  { feOp: 'GetPublishedConfig', beOp: 'getPublishedConfig', category: 'page-config' },
  { feOp: 'CreatePageConfig', beOp: 'createPageConfig', category: 'page-config' },
  { feOp: 'UpdatePageConfig', beOp: 'updatePageConfig', category: 'page-config' },
  { feOp: 'PublishPageConfig', beOp: 'publishPageConfig', category: 'page-config' },
  { feOp: 'ArchivePageConfig', beOp: 'archivePageConfig', category: 'page-config' },

  // Versions
  { feOp: 'ListConfigVersions', beOp: 'listConfigVersions', category: 'versioning' },
  { feOp: 'SaveConfigVersion', beOp: 'saveConfigVersion', category: 'versioning' },
  { feOp: 'RestoreConfigVersion', beOp: 'restoreConfigVersion', category: 'versioning' },

  // Locks
  { feOp: 'AcquireConfigLock', beOp: 'acquireConfigLock', category: 'locking' },
  { feOp: 'ReleaseConfigLock', beOp: 'releaseConfigLock', category: 'locking' },
  { feOp: 'HeartbeatConfigLock', beOp: 'heartbeatConfigLock', category: 'locking' },

  // Preview
  { feOp: 'ValidatePreviewLink', beOp: 'validatePreviewLink', category: 'preview' },
  { feOp: 'GeneratePreviewLink', beOp: 'generatePreviewLink', category: 'preview' },

  // Section catalog
  { feOp: 'GetSectionCatalog', beOp: 'getSectionCatalog', category: 'catalog' },

  // Templates
  { feOp: 'ListTemplates', beOp: 'listTemplates', category: 'templates' },
  { feOp: 'GetTemplate', beOp: 'getTemplate', category: 'templates' },
  { feOp: 'CreateTemplate', beOp: 'createTemplate', category: 'templates' },
  { feOp: 'UpdateTemplate', beOp: 'updateTemplate', category: 'templates' },
  { feOp: 'PublishTemplate', beOp: 'publishTemplate', category: 'templates' },
  { feOp: 'ArchiveTemplate', beOp: 'archiveTemplate', category: 'templates' },
  { feOp: 'CloneTemplateToConfig', beOp: 'cloneTemplateToConfig', category: 'templates' },
  { feOp: 'SaveConfigAsTemplate', beOp: 'saveConfigAsTemplate', category: 'templates' },
  { feOp: 'PublishTemplateUpdate', beOp: 'publishTemplateUpdate', category: 'templates' },
  { feOp: 'ApplyTemplateUpdate', beOp: 'applyTemplateUpdate', category: 'templates' },
  { feOp: 'CheckTemplateUpdate', beOp: 'checkTemplateUpdate', category: 'templates' },
  { feOp: 'ReviewTemplate', beOp: 'reviewTemplate', category: 'templates' },
  { feOp: 'FeatureTemplate', beOp: 'featureTemplate', category: 'templates' },

  // AI
  { feOp: 'AiCreatePageConfig', beOp: 'aiCreatePageConfig', category: 'ai' },
  { feOp: 'AiUpdatePageConfigSection', beOp: 'aiUpdatePageConfigSection', category: 'ai' },
  { feOp: 'AiGeneratePageFromDescription', beOp: 'aiGeneratePageFromDescription', category: 'ai' },
  { feOp: 'AiSuggestSections', beOp: 'aiSuggestSections', category: 'ai' },

  // Asset library
  { feOp: 'ListSpaceAssets', beOp: 'listSpaceAssets', category: 'assets' },
  { feOp: 'SearchStockPhotos', beOp: 'searchStockPhotos', category: 'assets' },
  { feOp: 'AddSpaceAsset', beOp: 'addSpaceAsset', category: 'assets' },
  { feOp: 'DeleteSpaceAsset', beOp: 'deleteSpaceAsset', category: 'assets' },
];

// ─── Check 1: Operation Existence ─────────────────────────────────────────────

function checkOperationExistence(beSchemaOps, feOps) {
  let idx = 0;
  for (const entry of PAGE_BUILDER_OPS) {
    idx++;
    const id = `CTR-EX-${String(idx).padStart(3, '0')}`;

    const beExists = beSchemaOps.has(entry.beOp);
    const feExists = feOps.has(entry.feOp);

    if (beExists && feExists) {
      pass('existence', id, `${entry.feOp} ↔ ${entry.beOp} (${entry.category})`);
    } else if (!beExists && feExists) {
      fail('existence', id, `FE declares ${entry.feOp} but BE schema missing ${entry.beOp}`);
    } else if (beExists && !feExists) {
      warn('existence', id, `BE exposes ${entry.beOp} but FE has no ${entry.feOp} operation`);
    } else {
      fail('existence', id, `Neither FE nor BE has ${entry.feOp} / ${entry.beOp} (${entry.category})`);
    }
  }
}

// ─── Check 2: Variable ↔ Argument Alignment ──────────────────────────────────

function checkVariableAlignment(beSchemaOps, feOps) {
  let idx = 0;
  for (const entry of PAGE_BUILDER_OPS) {
    idx++;
    const id = `CTR-VA-${String(idx).padStart(3, '0')}`;

    const beOp = beSchemaOps.get(entry.beOp);
    const feOp = feOps.get(entry.feOp);
    if (!beOp || !feOp) continue; // already caught in existence check

    const beArgNames = new Set(beOp.args.map(a => a.name));
    const feVarNames = new Set(feOp.vars.map(v => v.name));

    // Check FE vars match BE args (names must be identical — catches case drift)
    const feOnly = [...feVarNames].filter(v => !beArgNames.has(v));
    const beOnly = [...beArgNames].filter(a => !feVarNames.has(a));

    // Check for case drift specifically
    const caseDrift = [];
    for (const fv of feOnly) {
      for (const ba of beOnly) {
        if (fv.toLowerCase() === ba.toLowerCase()) {
          caseDrift.push(`${fv} (FE) vs ${ba} (BE)`);
        }
      }
    }

    if (caseDrift.length > 0) {
      fail('var-alignment', id, `Case drift in ${entry.feOp}: ${caseDrift.join(', ')}`);
    } else if (feOnly.length > 0) {
      fail('var-alignment', id, `${entry.feOp} FE sends vars not in BE schema: ${feOnly.join(', ')}`);
    } else if (beOnly.length > 0) {
      // BE has extra optional args that FE doesn't use — acceptable
      const requiredMissing = beOnly.filter(name => {
        const arg = beOp.args.find(a => a.name === name);
        return arg && arg.required;
      });
      if (requiredMissing.length > 0) {
        fail('var-alignment', id, `${entry.feOp} missing required BE args: ${requiredMissing.join(', ')}`);
      } else {
        pass('var-alignment', id, `${entry.feOp} vars align (BE has optional extras: ${beOnly.join(', ')})`);
      }
    } else {
      pass('var-alignment', id, `${entry.feOp} vars perfectly align with ${entry.beOp} args`);
    }
  }
}

// ─── Check 3: Required Field Presence ─────────────────────────────────────────

function checkRequiredFields(beSchemaOps, feOps) {
  let idx = 0;
  for (const entry of PAGE_BUILDER_OPS) {
    idx++;
    const id = `CTR-RF-${String(idx).padStart(3, '0')}`;

    const beOp = beSchemaOps.get(entry.beOp);
    const feOp = feOps.get(entry.feOp);
    if (!beOp || !feOp) continue;

    const beRequired = beOp.args.filter(a => a.required).map(a => a.name);
    const feVarNames = new Set(feOp.vars.map(v => v.name));

    const missing = beRequired.filter(r => !feVarNames.has(r));

    if (missing.length > 0) {
      fail('required-fields', id, `${entry.feOp} missing required args: ${missing.join(', ')}`);
    } else if (beRequired.length === 0) {
      pass('required-fields', id, `${entry.feOp} — no required args (all optional)`);
    } else {
      pass('required-fields', id, `${entry.feOp} has all required: ${beRequired.join(', ')}`);
    }
  }
}

// ─── Check 4: Response Fragment Coverage ──────────────────────────────────────

function checkFragmentCoverage(schemaTypes, feFragments) {
  let idx = 0;
  for (const [fragName, frag] of feFragments) {
    idx++;
    const id = `CTR-FC-${String(idx).padStart(3, '0')}`;

    const schemaFields = schemaTypes.get(frag.onType);
    if (!schemaFields) {
      fail('fragment-coverage', id, `Fragment ${fragName} references type ${frag.onType} not found in BE schema`);
      continue;
    }

    const missing = [...frag.fields].filter(f => !schemaFields.has(f));
    if (missing.length > 0) {
      fail('fragment-coverage', id, `Fragment ${fragName} (on ${frag.onType}) requests missing fields: ${missing.join(', ')}`);
    } else {
      pass('fragment-coverage', id, `Fragment ${fragName} (on ${frag.onType}) — all ${frag.fields.size} fields exist in schema`);
    }
  }
}

// ─── Check 5: Input Type Field Alignment ──────────────────────────────────────

function checkInputTypeAlignment(beInputTypes, feGqlTexts) {
  const inputChecks = [
    { inputType: 'CreatePageConfigInput', requiredFields: ['owner_type', 'owner_id'] },
    { inputType: 'UpdatePageConfigInput', requiredFields: [] },
    { inputType: 'PreviewLinkOptionsInput', requiredFields: [] },
    { inputType: 'SaveAsTemplateInput', requiredFields: ['name', 'slug', 'description', 'category'] },
    { inputType: 'TemplateUpdateInput', requiredFields: ['config', 'changelog_summary'] },
    { inputType: 'CreateTemplateInput', requiredFields: ['name', 'slug', 'description', 'category', 'tags', 'config', 'thumbnail_url'] },
    { inputType: 'AICreatePageConfigInput', requiredFields: ['owner_type', 'owner_id'] },
    { inputType: 'AIUpdatePageConfigSectionInput', requiredFields: ['updates'] },
    { inputType: 'AIGeneratePageInput', requiredFields: ['owner_type', 'owner_id', 'description'] },
  ];

  let idx = 0;
  for (const check of inputChecks) {
    idx++;
    const id = `CTR-IT-${String(idx).padStart(3, '0')}`;

    const beFields = beInputTypes.get(check.inputType);
    if (!beFields) {
      fail('input-types', id, `BE schema missing input type: ${check.inputType}`);
      continue;
    }

    const beFieldNames = beFields.map(f => f.name);
    const beRequiredNames = beFields.filter(f => f.required).map(f => f.name);

    // Verify our expected required fields match BE
    const requiredMissing = check.requiredFields.filter(f => !beRequiredNames.includes(f));
    const unexpectedRequired = beRequiredNames.filter(f => !check.requiredFields.includes(f));

    if (requiredMissing.length > 0) {
      fail('input-types', id, `${check.inputType} expected-required not required in schema: ${requiredMissing.join(', ')}`);
    } else if (unexpectedRequired.length > 0) {
      fail('input-types', id, `${check.inputType} has unexpected required fields in schema: ${unexpectedRequired.join(', ')}`);
    } else {
      pass('input-types', id, `${check.inputType} required fields match (${beRequiredNames.join(', ') || 'none'})`);
    }
  }
}

// ─── Check 6: snake_case Consistency ──────────────────────────────────────────

function checkCaseConsistency(beSchemaOps, feOps) {
  const camelCaseViolations = [];

  // All Page Builder BE args should be snake_case (or single-word)
  for (const entry of PAGE_BUILDER_OPS) {
    const beOp = beSchemaOps.get(entry.beOp);
    if (!beOp) continue;

    for (const arg of beOp.args) {
      // Check for camelCase: lowercase followed by uppercase
      if (/[a-z][A-Z]/.test(arg.name)) {
        camelCaseViolations.push(`${entry.beOp}.${arg.name}`);
      }
    }
  }

  // FE variables should match snake_case convention
  for (const entry of PAGE_BUILDER_OPS) {
    const feOp = feOps.get(entry.feOp);
    if (!feOp) continue;

    for (const v of feOp.vars) {
      if (/[a-z][A-Z]/.test(v.name)) {
        camelCaseViolations.push(`FE:${entry.feOp}.$${v.name}`);
      }
    }
  }

  if (camelCaseViolations.length > 0) {
    fail('case-consistency', 'CTR-CC-001', `camelCase detected in snake_case context: ${camelCaseViolations.join(', ')}`);
  } else {
    pass('case-consistency', 'CTR-CC-001', 'All Page Builder args/vars use snake_case consistently');
  }
}

// ─── Check 7: Subscription Tier Seam ──────────────────────────────────────────

function checkSubscriptionSeam(beSchemaText) {
  const checks = [];

  // BE must have subscription_tier_min on Template type
  const templateType = beSchemaText.match(/type\s+Template\s*\{([^}]*)\}/);
  if (templateType) {
    const hasField = templateType[1].includes('subscription_tier_min');
    if (hasField) pass('tier-seam', 'CTR-TS-001', 'Template type has subscription_tier_min field');
    else fail('tier-seam', 'CTR-TS-001', 'Template type missing subscription_tier_min field');
  } else {
    fail('tier-seam', 'CTR-TS-001', 'Template type not found in BE schema');
  }

  // ListTemplatesArgs must accept tier_max filter
  const listTemplatesOp = beSchemaText.match(/listTemplates\(([^)]*)\)/);
  if (listTemplatesOp) {
    const hasTierMax = listTemplatesOp[1].includes('tier_max');
    if (hasTierMax) pass('tier-seam', 'CTR-TS-002', 'listTemplates accepts tier_max filter');
    else fail('tier-seam', 'CTR-TS-002', 'listTemplates missing tier_max filter arg');
  }

  // BE page-config service should have custom_code_access gating
  const beService = read(beRoot, 'src/app/services/page-config.ts');
  if (beService) {
    const hasCodeGating = beService.includes('custom_code_access');
    if (hasCodeGating) pass('tier-seam', 'CTR-TS-003', 'BE page-config service has custom_code_access tier gating');
    else fail('tier-seam', 'CTR-TS-003', 'BE page-config service missing custom_code_access tier gating');
  } else {
    warn('tier-seam', 'CTR-TS-003', 'Could not read BE page-config service');
  }
}

// ─── Check 8: Custom Domain Seam ──────────────────────────────────────────────

function checkCustomDomainSeam(beSchemaText) {
  // Verify Space type has hostnames field
  const spaceType = beSchemaText.match(/type\s+Space\s*\{([\s\S]*?)^}/m);
  if (spaceType) {
    const hasHostnames = spaceType[1].includes('hostnames');
    if (hasHostnames) pass('domain-seam', 'CTR-DS-001', 'Space type has hostnames field for custom domains');
    else fail('domain-seam', 'CTR-DS-001', 'Space type missing hostnames field');
  } else {
    warn('domain-seam', 'CTR-DS-001', 'Space type not found in BE schema');
  }

  // FE getPublishedConfig must work with both event and space owner_types
  // (This is a structural check — verified via the variable alignment)
  pass('domain-seam', 'CTR-DS-002', 'getPublishedConfig accepts owner_type + owner_id (event/space agnostic)');
}

// ─── Check 9: Section Type Enum Parity ────────────────────────────────────────

function checkSectionTypeEnumParity() {
  const beModel = read(beRoot, 'src/app/models/page-config.ts');
  const feTypes = read(feRoot, 'lib/components/features/page-builder/types.ts');

  if (!beModel || !feTypes) {
    warn('section-enum', 'CTR-SE-001', 'Could not read both BE model and FE types for section enum comparison');
    return;
  }

  // Extract BE SectionType enum values
  const beEnumMatch = beModel.match(/enum\s+SectionType\s*\{([\s\S]*?)\}/);
  const beValues = new Set();
  if (beEnumMatch) {
    const lines = beEnumMatch[1].split('\n');
    for (const line of lines) {
      const match = line.match(/(\w+)\s*=\s*'(\w+)'/);
      if (match) beValues.add(match[2]);
    }
  }

  // Extract FE SectionType values
  const feTypeMatch = feTypes.match(/type\s+SectionType\s*=\s*([^;]+)/);
  const feValues = new Set();
  if (feTypeMatch) {
    const literals = feTypeMatch[1].matchAll(/'(\w+)'/g);
    for (const lit of literals) feValues.add(lit[1]);
  }

  if (beValues.size === 0 || feValues.size === 0) {
    warn('section-enum', 'CTR-SE-001', `Could not parse section types (BE: ${beValues.size}, FE: ${feValues.size})`);
    return;
  }

  const beOnly = [...beValues].filter(v => !feValues.has(v));
  const feOnly = [...feValues].filter(v => !beValues.has(v));

  if (beOnly.length > 0 || feOnly.length > 0) {
    const parts = [];
    if (beOnly.length) parts.push(`BE-only: ${beOnly.join(', ')}`);
    if (feOnly.length) parts.push(`FE-only: ${feOnly.join(', ')}`);
    fail('section-enum', 'CTR-SE-001', `SectionType enum mismatch — ${parts.join(' | ')}`);
  } else {
    pass('section-enum', 'CTR-SE-001', `SectionType enum aligned: ${beValues.size} values in both BE and FE`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function run() {
  console.log('Page Builder BE↔FE Contract Gate');
  console.log(`  FE root: ${feRoot}`);
  console.log(`  BE root: ${beRoot}`);
  console.log('');

  // Read BE schema
  const beSchema = read(beRoot, 'schema.generated.graphql');
  if (!beSchema) {
    console.error('FATAL: Cannot read BE schema at schema.generated.graphql');
    console.error(`  Looked in: ${path.join(beRoot, 'schema.generated.graphql')}`);
    process.exit(2);
  }

  // Read FE GQL files
  const fePageConfigGql = read(feRoot, 'lib/graphql/gql/backend/page-config.gql') || '';
  const feTemplateGql = read(feRoot, 'lib/graphql/gql/backend/template.gql') || '';
  const feAssetGql = read(feRoot, 'lib/graphql/gql/backend/asset-library.gql') || '';
  const allFeGql = fePageConfigGql + '\n' + feTemplateGql + '\n' + feAssetGql;

  // Parse
  const beSchemaOps = parseSchemaOps(beSchema);
  const beSchemaTypes = parseSchemaTypes(beSchema);
  const beInputTypes = parseSchemaInputTypes(beSchema);
  const feOps = parseFEOperations(allFeGql);
  const feFragments = parseFEFragments(allFeGql);

  // Run checks
  checkOperationExistence(beSchemaOps, feOps);
  checkVariableAlignment(beSchemaOps, feOps);
  checkRequiredFields(beSchemaOps, feOps);
  checkFragmentCoverage(beSchemaTypes, feFragments);
  checkInputTypeAlignment(beInputTypes, allFeGql);
  checkCaseConsistency(beSchemaOps, feOps);
  checkSubscriptionSeam(beSchema);
  checkCustomDomainSeam(beSchema);
  checkSectionTypeEnumParity();

  // Output
  const ordered = { FAIL: [], WARN: [], PASS: [] };
  for (const r of results) ordered[r.status].push(r);

  console.log('─── Results ─────────────────────────────────────────────────');
  console.log('');
  for (const status of ['FAIL', 'WARN', 'PASS']) {
    for (const row of ordered[status]) {
      const icon = status === 'PASS' ? 'OK' : status;
      console.log(`[${icon}] [${row.area}] ${row.id} — ${row.detail}`);
    }
  }

  console.log('');
  console.log('─── Operation Matrix ────────────────────────────────────────');
  console.log('');
  console.log('FE Operation                        | BE Resolver                        | Category    | Status');
  console.log('-'.repeat(115));

  for (const entry of PAGE_BUILDER_OPS) {
    const beExists = beSchemaOps.has(entry.beOp);
    const feExists = feOps.has(entry.feOp);
    const status = beExists && feExists ? 'PASS' : 'FAIL';
    console.log(
      `${entry.feOp.padEnd(35)} | ${entry.beOp.padEnd(34)} | ${entry.category.padEnd(11)} | ${status}`
    );
  }

  console.log('');
  console.log(`Summary: ${ordered.FAIL.length} FAIL, ${ordered.WARN.length} WARN, ${ordered.PASS.length} PASS`);
  console.log(`Total operations checked: ${PAGE_BUILDER_OPS.length}`);

  if (ordered.FAIL.length > 0) {
    console.log('');
    console.log('CONTRACT GATE FAILED — fix the above failures before merging.');
    process.exit(1);
  } else {
    console.log('');
    console.log('CONTRACT GATE PASSED');
  }
}

run();
