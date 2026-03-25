import path from 'path';
import { spawn } from 'child_process';

const repoRoot = process.cwd();
const typecheckScriptPath = path.resolve(
  repoRoot,
  process.env.TYPECHECK_CHANGED_SCRIPT ?? path.join('scripts', 'typecheck-changed-files.mjs'),
);
const args = [typecheckScriptPath, ...process.argv.slice(2)];
const fatalNodeOomPattern = /FATAL ERROR:\s.*JavaScript heap out of memory/i;
const gcPreamblePattern = /<--- Last few GCs --->/;
const killedByKernelOomSignal = new Set(['SIGKILL']);
const killedByKernelOomExitCodes = new Set([137]);
const abortedByNodeOomSignal = new Set(['SIGABRT']);
const abortedByNodeOomExitCodes = new Set([134]);

const child = spawn(process.execPath, args, {
  cwd: repoRoot,
  stdio: ['ignore', 'pipe', 'pipe'],
});

let stderrOutput = '';

child.stdout.on('data', (chunk) => {
  const text = chunk.toString();
  process.stdout.write(text);
});

child.stderr.on('data', (chunk) => {
  const text = chunk.toString();
  stderrOutput += text;
  process.stderr.write(text);
});

child.on('error', (error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

child.on('close', (code, signal) => {
  const endedWithFatalNodeOom = fatalNodeOomPattern.test(stderrOutput);
  const endedWithNodeOomAbort =
    (abortedByNodeOomSignal.has(signal ?? '') || abortedByNodeOomExitCodes.has(code ?? -1))
    && (endedWithFatalNodeOom || gcPreamblePattern.test(stderrOutput));
  const endedWithKernelStyleOomKill =
    killedByKernelOomSignal.has(signal ?? '') || killedByKernelOomExitCodes.has(code ?? -1);

  if (endedWithFatalNodeOom || endedWithNodeOomAbort || endedWithKernelStyleOomKill) {
    console.warn('Typecheck skipped after a likely out-of-memory termination.');
    process.exit(0);
  }

  if (signal) {
    console.error(`Typecheck process terminated by signal ${signal}.`);
    process.exit(1);
  }

  process.exit(code ?? 1);
});
