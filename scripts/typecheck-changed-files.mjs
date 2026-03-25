import path from 'path';
import ts from 'typescript';
import { execFileSync } from 'child_process';
import { existsSync } from 'fs';

const repoRoot = process.cwd();
const tsconfigPath = path.join(repoRoot, 'tsconfig.json');
const ambientTypeFiles = ['next-env.d.ts', 'index.d.ts']
  .map((filePath) => path.join(repoRoot, filePath))
  .filter((filePath) => existsSync(filePath));

const parseArgs = (argv) => {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (!arg.startsWith('--')) {
      continue;
    }

    const key = arg.slice(2);
    const value = argv[index + 1];

    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}`);
    }

    args[key] = value;
    index += 1;
  }

  return args;
};

const isTypeScriptFile = (filePath) =>
  filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.d.ts');

const normalizeToAbsolutePath = (filePath) => path.resolve(repoRoot, filePath);
const normalizeForComparison = (filePath) => {
  const normalizedPath = path.resolve(filePath);
  return ts.sys.useCaseSensitiveFileNames ? normalizedPath : normalizedPath.toLowerCase();
};
const toRelativePath = (filePath) => path.relative(repoRoot, filePath);

const main = () => {
  const { base, head } = parseArgs(process.argv.slice(2));

  if (!base || !head) {
    throw new Error('Usage: yarn typecheck:changed --base <sha-or-ref> --head <sha-or-ref>');
  }

  if (!existsSync(tsconfigPath)) {
    throw new Error(`Missing tsconfig at ${tsconfigPath}`);
  }

  const diffOutput = execFileSync(
    'git',
    ['diff', '--name-only', '--diff-filter=ACMR', `${base}...${head}`],
    {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );

  const changedTypeScriptFiles = diffOutput
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter(isTypeScriptFile)
    .map(normalizeToAbsolutePath)
    .filter((filePath) => existsSync(filePath));

  const filesToTypecheck = [...new Set([...ambientTypeFiles, ...changedTypeScriptFiles])];
  const changedFileSet = new Set(changedTypeScriptFiles.map(normalizeForComparison));

  if (changedTypeScriptFiles.length === 0) {
    console.log(`No changed TypeScript files found between ${base} and ${head}.`);
    return;
  }

  const { config, error } = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

  if (error) {
    const formattedError = ts.formatDiagnosticsWithColorAndContext([error], {
      getCanonicalFileName: (fileName) => fileName,
      getCurrentDirectory: () => repoRoot,
      getNewLine: () => ts.sys.newLine,
    });

    throw new Error(formattedError);
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
    {
      ...config,
      include: [],
      exclude: [],
      files: filesToTypecheck.map(toRelativePath),
      compilerOptions: {
        ...config.compilerOptions,
        incremental: false,
      },
    },
    ts.sys,
    repoRoot,
    undefined,
    tsconfigPath,
  );

  if (parsedConfig.errors.length > 0) {
    const formattedErrors = ts.formatDiagnosticsWithColorAndContext(parsedConfig.errors, {
      getCanonicalFileName: (fileName) => fileName,
      getCurrentDirectory: () => repoRoot,
      getNewLine: () => ts.sys.newLine,
    });

    throw new Error(formattedErrors);
  }

  console.log(`Type-checking ${changedTypeScriptFiles.length} changed TypeScript file(s).`);
  changedTypeScriptFiles.forEach((filePath) => {
    console.log(`- ${toRelativePath(filePath)}`);
  });

  const program = ts.createProgram({
    options: parsedConfig.options,
    projectReferences: parsedConfig.projectReferences,
    rootNames: parsedConfig.fileNames,
  });

  const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .filter((diagnostic) => !diagnostic.file || changedFileSet.has(normalizeForComparison(diagnostic.file.fileName)));

  if (diagnostics.length === 0) {
    console.log(`TypeScript check passed for ${changedTypeScriptFiles.length} changed TypeScript file(s).`);
    return;
  }

  const formattedDiagnostics = ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => repoRoot,
    getNewLine: () => ts.sys.newLine,
  });

  throw new Error(formattedDiagnostics);
};

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
